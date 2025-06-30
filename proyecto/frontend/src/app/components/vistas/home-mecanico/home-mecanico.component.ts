import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MecanicosCitasService } from '../../../services/mecanicosCitas/mecanicos-citas.service';
import { Seguimiento } from '../../../model/Seguimientos.model';
import { SeguimientoService } from '../../../services/seguimiento/seguimiento.service';
import { CitasService } from '../../../services/citas/citas.service';
import { Cita } from '../../../model/Citas.model';
import { Usuario } from '../../../model/Usuarios.model';
import { ChatComponent } from '../../chat/chat/chat.component';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-mecanico',
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './home-mecanico.component.html',
  styleUrls: ['./home-mecanico.component.css']
})
export class HomeMecanicoComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  activeSection: 'citas' | 'onhold' = 'citas';
  showSidebar = false;

  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  citaOnHold: Cita | null = null;

  busquedaCitas = '';
  activeCitaFilter = 'todas';

  editingCita: Cita | null = null;
  seguimientosExistentes: Seguimiento[] = [];
  nuevosSeguimientos: any[] = [];
  seguimientoFiles: (File | null)[] = [];
  seguimientoExistenteFiles: (File | null)[] = [];
  seguimientosOnHold: Seguimiento[] = [];
  seguimientoActualIndex = 0;
  seguimientoFinalizado = false;
  seguimientoWsSub: Subscription | null = null;

  showFacturaModal = false;
  montoFactura: number | null = null;

  // Para finalizar seguimiento en tiempo real
  mostrarInputImagen = false;
  indexInputImagen = -1;
  fileOnHold: File | null = null;

  constructor(
    private router: Router,
    private seguimientoService: SeguimientoService,
    private citasService: CitasService,
    private mecanicosCitasService: MecanicosCitasService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      const savedSection = localStorage.getItem('activeSection');
      this.activeSection = (savedSection as 'citas' | 'onhold') || 'citas';
      this.cargarCitas();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeSeguimientoWs();
    this.seguimientoService.disconnectWebSocket();
  }

  // --- UI helpers ---
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  setActiveSection(section: 'citas' | 'onhold'): void {
    this.activeSection = section;
    localStorage.setItem('activeSection', section);
    this.showSidebar = false;
    if (section === 'onhold') {
      this.seleccionarCitaOnHold();
    }
  }

  // --- Citas ---
  cargarCitas(): void {
    if (!this.usuario) return;
    this.citasService.getCitasByMecanico(this.usuario.idUsuario!).subscribe({
      next: (citas: Cita[]) => {
        this.citas = citas;
        this.seleccionarCitaOnHold();
        this.filtrarCitas(this.activeCitaFilter);
      },
      error: (error) => {
        console.error('Error al cargar las citas:', error);
      }
    });
  }

  buscarCitas(): void {
    const term = this.busquedaCitas.toLowerCase();
    this.citasFiltradas = this.citas.filter(cita =>
      (cita.descripcion || '').toLowerCase().includes(term) ||
      (cita.usuarios?.nombre || '').toLowerCase().includes(term) ||
      (cita.vehiculos?.matricula || '').toLowerCase().includes(term) ||
      (cita.estado || '').toLowerCase().includes(term)
    );
    this.filtrarCitas(this.activeCitaFilter);
  }

  filtrarCitas(filtro: string): void {
    this.activeCitaFilter = filtro;
    let citas = [...this.citas];
    if (filtro !== 'todas') {
      citas = citas.filter(cita => cita.estado === filtro);
    }
    if (this.busquedaCitas) {
      const term = this.busquedaCitas.toLowerCase();
      citas = citas.filter(cita =>
        (cita.descripcion || '').toLowerCase().includes(term) ||
        (cita.usuarios?.nombre || '').toLowerCase().includes(term) ||
        (cita.vehiculos?.matricula || '').toLowerCase().includes(term) ||
        (cita.estado || '').toLowerCase().includes(term)
      );
    }
    this.citasFiltradas = citas;
  }

  tieneCitaEnProceso(): boolean {
    return this.citas.some(c => c.estado === 'En Proceso');
  }

  seleccionarCitaOnHold(): void {
    this.citaOnHold = this.citas.find(cita => cita.estado === 'En Proceso') || null;
    if (this.citaOnHold) {
      this.cargarSeguimientosOnHold(this.citaOnHold.idCita!);
      this.seguimientoService.connectWebSocket(this.citaOnHold.idCita!);
      this.unsubscribeSeguimientoWs();
      this.seguimientoWsSub = this.seguimientoService.onSeguimientoUpdate().subscribe(() => {
        this.cargarSeguimientosOnHold(this.citaOnHold!.idCita!);
      });
    } else {
      this.resetSeguimientosOnHold();
      this.unsubscribeSeguimientoWs();
      this.seguimientoService.disconnectWebSocket();
    }
  }

  // --- Seguimientos ---
  cargarSeguimientosOnHold(idCita: number): void {
    this.seguimientoService.getSeguimientosByCita(idCita).subscribe({
      next: (seguimientos: Seguimiento[]) => {
        this.seguimientosOnHold = [...seguimientos].sort((a, b) => (a.idSeguimiento ?? 0) - (b.idSeguimiento ?? 0));
        this.seguimientoActualIndex = this.seguimientosOnHold.findIndex(
          s => s.estado !== 'Finalizado' && s.estado !== 'Cancelada'
        );
        this.seguimientoFinalizado = this.seguimientoActualIndex === -1;
      }
    });
  }

  cargarSeguimientos(idCita: number): void {
    this.seguimientoService.getSeguimientosByCita(idCita).subscribe({
      next: (seguimientos: Seguimiento[]) => {
        this.seguimientosExistentes = seguimientos;
      },
      error: (error) => {
        console.error('Error al cargar seguimientos:', error);
      }
    });
  }

  // --- Seguimiento en tiempo real ---
  onFileSelectedOnHold(event: any) {
    this.fileOnHold = event.target.files[0];
  }

  async finalizarSeguimientoConImagen(seguimiento: Seguimiento, index: number) {
    // Si YA hay imagen, solo actualiza el estado
    if (seguimiento.imagenUrl) {
      const actualizado = {
        ...seguimiento,
        estado: 'Finalizado',
        fechaActualizacion: new Date()
      };
      this.seguimientoService.updateSeguimiento(actualizado).subscribe({
        next: () => {
          this.cargarSeguimientosOnHold(this.citaOnHold!.idCita!);
          Swal.fire('Éxito', 'Seguimiento finalizado correctamente.', 'success');
        },
        error: () => {
          Swal.fire('Error', 'No se pudo finalizar el seguimiento. Inténtalo de nuevo.', 'error');
        }
      });
      return;
    }

    // Si NO hay imagen, pide la imagen y súbela
    if (!this.mostrarInputImagen || this.indexInputImagen !== index) {
      this.mostrarInputImagen = true;
      this.indexInputImagen = index;
      this.fileOnHold = null;
      return;
    }
    if (!this.fileOnHold) {
      Swal.fire('Imagen requerida', 'Por favor, selecciona una imagen antes de finalizar el seguimiento.', 'info');
      return;
    }
    const url = await this.uploadSeguimientoImage(this.fileOnHold);
    if (!url) {
      Swal.fire('Error', 'No se pudo subir la imagen. Inténtalo de nuevo.', 'error');
      return;
    }
    const actualizado = {
      idSeguimiento: seguimiento.idSeguimiento,
      idCita: seguimiento.idCita,
      descripcion: seguimiento.descripcion,
      imagenUrl: url,
      estado: 'Finalizado',
      fechaActualizacion: new Date()
    };
    this.seguimientoService.updateSeguimiento(actualizado).subscribe({
      next: () => {
        this.cargarSeguimientosOnHold(this.citaOnHold!.idCita!);
        this.mostrarInputImagen = false;
        this.indexInputImagen = -1;
        this.fileOnHold = null;
        Swal.fire('Éxito', 'Seguimiento finalizado correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo finalizar el seguimiento. Inténtalo de nuevo.', 'error');
      }
    });
  }

  // --- CRUD Seguimientos (modal) ---
  addSeguimientoField(): void {
    this.nuevosSeguimientos.push({ descripcion: '', estado: 'En Proceso' });
  }

  removeSeguimientoField(index: number): void {
    this.nuevosSeguimientos.splice(index, 1);
    this.seguimientoFiles.splice(index, 1);
  }

  onEstadoChange(index: number) {
    if (this.nuevosSeguimientos[index].estado !== 'Finalizado') {
      this.seguimientoFiles[index] = null;
    }
  }

  onFileSelected(event: any, index: number) {
    this.seguimientoFiles[index] = event.target.files[0];
  }

  onEstadoExistenteChange(index: number) {
    if (this.seguimientosExistentes[index].estado !== 'Finalizado') {
      this.seguimientoExistenteFiles[index] = null;
    }
  }

  onFileSelectedExistente(event: any, index: number) {
    this.seguimientoExistenteFiles[index] = event.target.files[0];
  }

  async guardarCitaEditada(): Promise<void> {
    if (!this.editingCita) return;
    const citaActualizada = { ...this.editingCita };

    const seguimientosToUpdate = await Promise.all(
      this.seguimientosExistentes.map(async (s, i) => {
        let imagenUrl = s.imagenUrl;
        if (s.estado === 'Finalizado' && this.seguimientoExistenteFiles[i]) {
          const url = await this.uploadSeguimientoImage(this.seguimientoExistenteFiles[i]);
          imagenUrl = url !== null ? url : imagenUrl;
        }
        return {
          ...s,
          idCita: s.idCita!,
          fechaActualizacion: new Date(s.fechaActualizacion),
          imagenUrl
        };
      })
    );

    const seguimientosToSave = await Promise.all(
      this.nuevosSeguimientos
        .filter(s => s.descripcion && s.descripcion.trim().length > 0)
        .map(async (s, i) => {
          let imagenUrl: string | undefined = undefined;
          if (s.estado === 'Finalizado' && this.seguimientoFiles[i]) {
            const url = await this.uploadSeguimientoImage(this.seguimientoFiles[i]);
            imagenUrl = url !== null ? url : undefined;
          }
          return {
            idCita: this.editingCita!.idCita,
            descripcion: s.descripcion,
            estado: s.estado || 'En Proceso',
            fechaActualizacion: new Date(),
            imagenUrl
          };
        })
    );

    this.citasService.update(this.editingCita.idCita, citaActualizada).subscribe({
      next: () => {
        let seguimientosObs = seguimientosToUpdate.length && this.seguimientoService.updateMultiple
          ? this.seguimientoService.updateMultiple(seguimientosToUpdate)
          : { subscribe: (cb: any) => cb() };

        seguimientosObs.subscribe({
          next: () => {
            if (seguimientosToSave.length > 0 && this.seguimientoService.createMultiple) {
              this.seguimientoService.createMultiple(seguimientosToSave).subscribe({
                next: () => this.finalizarEdicionCita(),
                error: () => this.finalizarEdicionCita()
              });
            } else {
              this.finalizarEdicionCita();
            }
          },
          error: () => this.finalizarEdicionCita()
        });
      },
      error: () => {
        Swal.fire('Error', 'Error al guardar la cita. Inténtalo de nuevo.', 'error');
      }
    });
  }

  async uploadSeguimientoImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await this.http.post('http://localhost:8080/api/files/seguimiento', formData, { responseType: 'text' }).toPromise();
      return res as string;
    } catch {
      return null;
    }
  }

  // --- Citas: acciones rápidas ---
  iniciarCita(cita: Cita): void {
    const citaActualizada = { ...cita, estado: 'En Proceso' };
    this.citasService.update(citaActualizada.idCita!, citaActualizada).subscribe({
      next: () => {
        this.cargarCitas();
        setTimeout(() => this.setActiveSection('onhold'), 300);
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo iniciar la cita' });
      }
    });
  }

  finalizarCita(): void {
    if (!this.citaOnHold) return;
    const citaFinalizada = { ...this.citaOnHold, estado: 'Finalizada' };
    this.citasService.update(citaFinalizada.idCita!, citaFinalizada).subscribe({
      next: () => {
        this.citaOnHold = null;
        this.cargarCitas();
        this.activeSection = 'citas';
        this.seguimientoService.disconnectWebSocket();
      }
    });
  }

  cancelarCita(cita: Cita): void {
    const citaCancelada = { ...cita, estado: 'Cancelada' };
    this.citasService.update(citaCancelada.idCita!, citaCancelada).subscribe({
      next: () => {
        this.cargarCitas();
        if (this.citaOnHold && this.citaOnHold.idCita === citaCancelada.idCita) {
          this.citaOnHold = null;
        }
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cancelar la cita' });
      }
    });
  }

  noAsignarCita(cita: Cita): void {
    const mecanicoAsignado = (cita as any).mecanico?.idUsuario ?? null;
    if (!mecanicoAsignado) {
      Swal.fire('Info', 'La cita ya no tiene mecánico asignado.', 'info');
      return;
    }
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La cita quedará sin mecánico asignado y pasará a estado Pendiente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, designar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const citaActualizada = { ...cita, idMecanico: null, estado: 'Pendiente' };
        this.citasService.update(cita.idCita!, citaActualizada).subscribe({
          next: () => {
            this.mecanicosCitasService.desasignarMecanico(cita.idCita!, mecanicoAsignado).subscribe({
              next: () => {
                this.cargarCitas();
                Swal.fire('Designada', 'La cita ha sido designada correctamente.', 'success');
              },
              error: () => {
                this.cargarCitas();
                Swal.fire('Error', 'Error al designar la cita. Inténtalo de nuevo.', 'error');
              }
            });
          },
          error: () => {
            Swal.fire('Error', 'Error al actualizar la cita. Inténtalo de nuevo.', 'error');
          }
        });
      }
    });
  }

  // --- Seguimiento: acciones rápidas ---
  cambiarEstadoSeguimiento(seguimiento: Seguimiento, nuevoEstado: string): void {
    const actualizado = {
      ...seguimiento,
      estado: nuevoEstado,
      fechaActualizacion: new Date(),
      citas: { idCita: seguimiento.idCita ?? this.citaOnHold?.idCita }
    };
    this.seguimientoService.updateSeguimiento(actualizado).subscribe({
      next: () => {
        this.cargarSeguimientosOnHold(this.citaOnHold!.idCita!);
      }
    });
  }

  deleteSeguimiento(idSeguimiento: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.seguimientoService.deleteSeguimiento(idSeguimiento).subscribe({
          next: () => {
            this.seguimientosExistentes = this.seguimientosExistentes.filter(s => s.idSeguimiento !== idSeguimiento);
            Swal.fire('Eliminado', 'El seguimiento ha sido eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'Error al eliminar el seguimiento. Inténtalo de nuevo.', 'error'),
        });
      }
    });
  }

  // --- Factura ---
  abrirModalFactura(): void {
    this.montoFactura = null;
    this.showFacturaModal = true;
  }

  cerrarModalFactura(): void {
    this.showFacturaModal = false;
    this.montoFactura = null;
  }

  finalizarCitaConFactura(): void {
    if (!this.citaOnHold || this.montoFactura === null || this.montoFactura < 0) {
      Swal.fire('Error', 'Debes introducir un monto válido para la factura.', 'error');
      return;
    }
    this.citasService.finalizarCita(this.citaOnHold.idCita, this.montoFactura).subscribe({
      next: () => {
        this.showFacturaModal = false;
        this.montoFactura = null;
        this.cargarCitas();
        Swal.fire('Éxito', 'Cita finalizada y factura generada.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo finalizar la cita ni generar la factura.', 'error');
      }
    });
  }

  // --- Modal y edición ---
  onEditCita(cita: Cita): void {
    this.editingCita = { ...cita };
    this.cargarSeguimientos(cita.idCita!);
    this.nuevosSeguimientos = [];
    this.seguimientoFiles = [];
    this.seguimientoExistenteFiles = [];
  }

  cerrarModalCita(): void {
    this.editingCita = null;
    this.seguimientosExistentes = [];
    this.nuevosSeguimientos = [];
    this.seguimientoFiles = [];
    this.seguimientoExistenteFiles = [];
  }

  finalizarEdicionCita(): void {
    this.cerrarModalCita();
    this.cargarCitas();
  }

  // --- Utilidades privadas ---
  private unsubscribeSeguimientoWs() {
    if (this.seguimientoWsSub) {
      this.seguimientoWsSub.unsubscribe();
      this.seguimientoWsSub = null;
    }
  }

  private resetSeguimientosOnHold() {
    this.seguimientosOnHold = [];
    this.seguimientoActualIndex = 0;
    this.seguimientoFinalizado = false;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}