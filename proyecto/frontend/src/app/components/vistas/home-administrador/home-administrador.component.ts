import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Usuario } from '../../../model/Usuarios.model';
import { Cita } from '../../../model/Citas.model';
import { UsuarioService } from '../../../services/usuarioService/usuario-service.service';
import { CitasService } from '../../../services/citas/citas.service';
import { SeguimientoService } from '../../../services/seguimiento/seguimiento.service';
import { MecanicosCitasService } from '../../../services/mecanicosCitas/mecanicos-citas.service';
import { MecanicosCitas } from '../../../model/MecanicosCitas.model';
import { Seguimiento } from '../../../model/Seguimientos.model';


import Swal from 'sweetalert2'; // Asegúrate de tener SweetAlert2 instalado

@Component({
  selector: 'app-home-administrador',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home-administrador.component.html',
  styleUrls: ['./home-administrador.component.css'],
})
export class HomeAdministradorComponent implements OnInit {
  usuario: Usuario | null = null;
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  editingUser: Usuario | null = null;
  busquedaUsuarios: string = '';
  activeFilter: string = 'todos'; // Por defecto, el filtro es "todos"
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  editingCita: any = null;
  busquedaCitas: string = '';
  activeCitaFilter: string = 'todas';
  mecanicos: Usuario[] = [];
  showSidebar = false;
  isModalOpen: boolean = false;
  activeSection: 'usuarios' | 'citas' = 'usuarios';
  seguimientosExistentes: Seguimiento[] = [];
  nuevosSeguimientos: Seguimiento[] = [];


  constructor(
    private router: Router,
    private commonModule: CommonModule,
    private usuariosService: UsuarioService,
    private citasService: CitasService,
    private seguimientoService: SeguimientoService,
    private mecanicosCitasService: MecanicosCitasService
  ) { }

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);

      // Restaurar la sección activa desde localStorage
      const savedSection = localStorage.getItem('activeSection') as 'usuarios' | 'citas';
      this.activeSection = savedSection || 'usuarios';

      this.cargarUsuarios();
      this.cargarCitas();
      this.cargarMecanicos();
    }
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  setActiveSection(section: 'usuarios' | 'citas'): void {
    this.activeSection = section;
    localStorage.setItem('activeSection', section); // <-- Guarda la sección
    this.showSidebar = false;
  }

  cargarUsuarios(): void {
    this.usuariosService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data; this.usuariosFiltrados = data;
      },
      error: () => { this.usuarios = []; this.usuariosFiltrados = []; }
    });
  }

  cargarCitas(): void {
    this.citasService.getAll().subscribe({
      next: (data) => {
        this.citas = data;
        // Para cada cita, busca el mecánico asignado
        this.citas.forEach(cita => {
          this.mecanicosCitasService.getMecanicoByCita(cita.idCita!).subscribe({
            next: (mc) => {
              // Añade el mecánico a la cita para mostrarlo en la vista
              (cita as any).mecanico = mc?.mecanico || null;
            }
          });
        });
        this.citasFiltradas = this.citas;
      },
      error: () => {
        this.citas = [];
        this.citasFiltradas = [];
      }
    });
  }
  cargarMecanicos(): void {
    this.usuariosService.getAll().subscribe({
      next: (data) => {
        this.mecanicos = data.filter(u => u.tipoUsuario === 'Mecanico');
      },
      error: () => { this.mecanicos = []; }
    });
  }

  onEditUsuario(user: Usuario): void {
    this.isModalOpen = true; // Abre el modal
    this.editingUser = { ...user }; // Crea una copia para no modificar el original hasta guardar

  }

  guardarUsuarioEditado(): void {
    if (this.editingUser && this.editingUser.idUsuario != null) {
      if (!this.editingUser.contrasena) {
        delete (this.editingUser as any).contrasena;
      }
      this.usuariosService.updateUsuario(this.editingUser.idUsuario, this.editingUser).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.editingUser = null;
          window.location.reload();
        },
        error: () => Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al guardar el usuario. Inténtalo de nuevo.',
        }),
      });
      this.cerrarModal();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede guardar el usuario porque no tiene un ID válido.',
      });
    }
  }

  cerrarModal(): void {
    this.editingUser = null;
    window.location.reload();
  }

  onDeleteUsuario(idUsuario: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(idUsuario).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.cargarMecanicos();
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
          },
          error: () => alert('Error al eliminar el usuario. Inténtalo de nuevo.'),
        });
      }
    });
  }

  filtrarCitas(estado: string): void {
    const busqueda = this.busquedaCitas.toLowerCase();
    if (estado === 'todas') {
      this.citasFiltradas = this.citas.filter(cita =>
      (cita.usuarios?.nombre?.toLowerCase().includes(busqueda) ||
        cita.vehiculos?.matricula?.toLowerCase().includes(busqueda) ||
        cita.estado?.toLowerCase().includes(busqueda))
      );
    } else {
      this.citasFiltradas = this.citas.filter(cita =>
        cita.estado === estado &&
        (cita.usuarios?.nombre?.toLowerCase().includes(busqueda) ||
          cita.vehiculos?.matricula?.toLowerCase().includes(busqueda) ||
          cita.estado?.toLowerCase().includes(busqueda))
      );
    }
  }

  buscarCitas(): void {
    const estado = this.activeCitaFilter || 'todas';
    this.filtrarCitas(estado);
  }

  addSeguimientoField(): void {
    this.nuevosSeguimientos.push({ descripcion: '', estado: 'En Proceso', fechaActualizacion: new Date() });
  }

  removeSeguimientoField(index: number): void {
    this.nuevosSeguimientos.splice(index, 1);
  }
  onEditCita(cita: Cita): void {
    this.isModalOpen = true;
    this.editingCita = { ...cita };

    // Selecciona el mecánico asignado (si existe)
    this.editingCita.idMecanico = (cita as any).mecanico?.idUsuario ?? null;

    // Carga los seguimientos de la cita
    this.seguimientoService.getSeguimientosByCita(cita.idCita!).subscribe({
      next: (seguimientos) => {
        this.seguimientosExistentes = seguimientos.map(s => ({
          ...s,
          fechaActualizacion: s.fechaActualizacion ? new Date(s.fechaActualizacion) : new Date()
        }));
      },
      error: () => {
        this.seguimientosExistentes = [];
      }
    });

    // Limpia los nuevos seguimientos por si acaso
    this.nuevosSeguimientos = [];

  }
  guardarCitaEditada(): void {
    if (!this.editingCita) return;

    const citaActualizada = { ...this.editingCita };
    const mecanicoAnterior = (this.citas.find(c => c.idCita === this.editingCita.idCita) as any)?.mecanico?.idUsuario ?? null;
    const mecanicoNuevo = this.editingCita.idMecanico ?? null;

    // Cambia el estado según si hay mecánico asignado o no
    if (!mecanicoAnterior && mecanicoNuevo) {
      citaActualizada.estado = 'Asignada';
    } else if (!mecanicoNuevo) {
      citaActualizada.estado = 'Pendiente';
    }
    // Actualizar seguimientos existentes (si tienes un método update, si no, omite este paso)
    const seguimientosToUpdate = this.seguimientosExistentes.map(s => ({
      ...s,
      idCita: s.idCita!,
      fechaActualizacion: new Date(s.fechaActualizacion)
    }));

    // Nuevos seguimientos
    const seguimientosToSave = this.nuevosSeguimientos
      .filter(s => s.descripcion && s.descripcion.trim().length > 0)
      .map(s => ({
        idCita: this.editingCita.idCita,
        descripcion: s.descripcion,
        estado: s.estado || 'En Proceso',
        fechaActualizacion: new Date()
      }));

    // Primero actualiza la cita
    this.citasService.update(this.editingCita.idCita, citaActualizada).subscribe({
      next: () => {
        // Actualiza seguimientos existentes si tienes un método updateMultiple
        let seguimientosObs = seguimientosToUpdate.length && this.seguimientoService.updateMultiple
          ? this.seguimientoService.updateMultiple(seguimientosToUpdate)
          : { subscribe: (cb: any) => cb() };

        seguimientosObs.subscribe({
          next: () => {
            // Crea nuevos seguimientos si hay
            if (seguimientosToSave.length > 0 && this.seguimientoService.createMultiple) {
              console.log('Creando nuevos seguimientos:', JSON.stringify(seguimientosToSave));
              this.seguimientoService.createMultiple(seguimientosToSave).subscribe({
                next: () => this.gestionarMecanico(mecanicoAnterior, mecanicoNuevo),
                error: () => this.gestionarMecanico(mecanicoAnterior, mecanicoNuevo)
              });
            } else {
              this.gestionarMecanico(mecanicoAnterior, mecanicoNuevo);
            }
          },
          error: () => this.gestionarMecanico(mecanicoAnterior, mecanicoNuevo)
        });
      },
      error: () => {
        Swal.fire('Error', 'Error al guardar la cita. Inténtalo de nuevo.', 'error');
      }
    });
  }

  // Lógica de asignación/desasignación de mecánico
  gestionarMecanico(mecanicoAnterior: number | null, mecanicoNuevo: number | null): void {
    if (mecanicoAnterior !== mecanicoNuevo) {
      if (mecanicoAnterior) {
        this.mecanicosCitasService.desasignarMecanico(this.editingCita.idCita, mecanicoAnterior).subscribe({
          next: () => {
            if (mecanicoNuevo) {
              this.mecanicosCitasService.asignarMecanico(this.editingCita.idCita, mecanicoNuevo).subscribe({
                next: () => this.finalizarEdicionCita(),
                error: () => this.finalizarEdicionCita()
              });
            } else {
              this.finalizarEdicionCita();
            }
          },
          error: () => {
            if (mecanicoNuevo) {
              this.mecanicosCitasService.asignarMecanico(this.editingCita.idCita, mecanicoNuevo).subscribe({
                next: () => this.finalizarEdicionCita(),
                error: () => this.finalizarEdicionCita()
              });
            } else {
              this.finalizarEdicionCita();
            }
          }
        });
      } else if (mecanicoNuevo) {
        this.mecanicosCitasService.asignarMecanico(this.editingCita.idCita, mecanicoNuevo).subscribe({
          next: () => this.finalizarEdicionCita(),
          error: () => this.finalizarEdicionCita()
        });
      } else {
        this.finalizarEdicionCita();
      }
    } else {
      this.finalizarEdicionCita();
    }
  }

  finalizarEdicionCita(): void {
    this.editingCita = null;
    this.nuevosSeguimientos = [];
    this.seguimientosExistentes = [];
    this.cargarCitas();
    this.cargarMecanicos();
    this.cerrarModalCita();
  }
  cerrarModalCita(): void {
    this.editingCita = null;
    window.location.reload();
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
            window.location.reload();
          },
          error: () => alert('Error al eliminar el seguimiento. Inténtalo de nuevo.'),
        });
      }
    });
  }

  onDeleteCita(idCita?: number): void {
    if (!idCita) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede cancelar la cita porque no tiene un ID válido.',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      const cita = this.citas.find(c => c.idCita === idCita);
      if (cita) {
        const citaActualizada = { ...cita, estado: 'Cancelada' };
        this.citasService.update(idCita, citaActualizada).subscribe({
          next: () => {
            this.cargarCitas();
            Swal.fire('Cancelada', 'La cita ha sido cancelada.', 'success');
          },
          error: () => alert('Error al cancelar la cita. Inténtalo de nuevo.'),
        });
      }
    });
  }

  filtrarUsuarios(tipoUsuario: string): void {
    const busqueda = this.busquedaUsuarios.toLowerCase();

    if (tipoUsuario === 'todos') {
      // Mostrar todos los usuarios y aplicar búsqueda
      this.usuariosFiltrados = this.usuarios.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(busqueda)
      );
    } else {
      // Filtrar usuarios por tipo y aplicar búsqueda
      this.usuariosFiltrados = this.usuarios.filter(
        (usuario) =>
          usuario.tipoUsuario === tipoUsuario &&
          usuario.nombre.toLowerCase().includes(busqueda)
      );
    }
  }

  buscarUsuarios(): void {
    // Llama a filtrarUsuarios con el tipo de usuario actualmente seleccionado
    const tipoUsuario = this.activeFilter || 'todos';
    this.filtrarUsuarios(tipoUsuario);
  }

  goToConfig(): void {
    this.router.navigate(['/configuracion']);
  }
  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}