import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { VehiculosService } from '../../../services/vehiculos/vehiculos.service';
import { Vehiculo } from '../../../model/Vehiculos.model';
import { Usuario } from '../../../model/Usuarios.model';
import { Cita } from '../../../model/Citas.model';
import { VehiculoAdd } from '../../../model/VehiculosAdd.model';
import { CitasService } from '../../../services/citas/citas.service';
import { SeguimientoService } from '../../../services/seguimiento/seguimiento.service';
import { Seguimiento } from '../../../model/Seguimientos.model';
import { ChatComponent } from '../../chat/chat/chat.component';
import { FacturasService } from '../../../services/factura/facrtura.service';
import { DescargarFacturaComponent } from '../../factura/factira/factira.component';
import { CarApiService, CarBrand, CarModel } from '../../../services/CarsModels/marks.service';

import { Factura } from '../../../model/Factura.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-cliente',
  imports: [CommonModule, FormsModule, RouterModule, ChatComponent, DescargarFacturaComponent], // Incluye RouterModule aquí
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.css'],
})
export class HomeClienteComponent implements OnInit {
  usuario: Usuario | null = null;

  errorMessage: string | null = null;
  showUserMenu = false;
  showSidebar = false;
  editMode = false;
  showAddVehiculoModal = false;
  activeSection: 'vehiculos' | 'citas' | 'facturas' = 'vehiculos';
  vehiculos: Vehiculo[] = [];
  nuevoVehiculo: Partial<Vehiculo> = { matricula: '', marca: '', modelo: '', anoFabricacion: 2000, tipoMotor: '' };
  citas: Cita[] = [];
  nuevaCita: Partial<Cita> = { fechaHora: undefined, descripcion: '', estado: 'Pendiente' };
  showAddCitaModal = false;
  citaSeleccionada: Cita | null = null;
  seguimientos: Seguimiento[] = [];
  seguimientoActual: Seguimiento | null = null;
  showDetallesCita = false;

  facturas: Factura[] = [];
  carBrands: CarBrand[] = [];
  carModels: CarModel[] = [];
  selectedBrandId: string = '';
  selectedModelId: string = '';


  constructor(
    private authService: AuthService,
    private vehiculosService: VehiculosService,
    private citasService: CitasService,
    private seguimientoService: SeguimientoService,
    private facturasService: FacturasService,
    private carApiService: CarApiService,
    private router: Router
  ) { }
  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);

      // Restaurar la sección activa desde localStorage
      const savedSection = localStorage.getItem('activeSection') as 'vehiculos' | 'citas';
      this.activeSection = savedSection || 'vehiculos'; // Si no hay sección guardada, usar 'vehiculos' por defecto

      // Cargar los datos correspondientes a la sección activa
      this.cargarVehiculos();
      this.cargarCitas();
      this.cargarFacturas();
      this.carApiService.getCarBrands().subscribe(brands => this.carBrands = brands);
    }
  }

  // Método para cargar los vehículos del usuario
  cargarVehiculos(): void {
    if (!this.usuario?.idUsuario) {
      console.error('No se encontró un usuario válido.');
      return;
    }

    this.vehiculosService.findByUsuarioId(this.usuario.idUsuario).subscribe({
      next: (data) => {
        this.vehiculos = data.sort((a, b) => (a.anoFabricacion! < b.anoFabricacion! ? -1 : 1));
        if (this.vehiculos.length === 0) {
          console.warn('No se encontraron vehículos para este usuario.');
        }
      },
      error: (err) => {
        console.error('Error al cargar los vehículos:', err);
        this.vehiculos = [];

      },
    });
  }
  // Método para cargar las citas del usuario
  cargarCitas(): void {
    if (!this.usuario?.idUsuario) {
      console.error('No se encontró un usuario válido.');
      return;
    }

    this.citasService.getByUsuarioId(this.usuario.idUsuario).subscribe({
      next: (data) => {
        this.citas = data.sort((a, b) => (a.fechaHora < b.fechaHora ? -1 : 1));
        if (this.citas.length === 0) {
          console.warn('No se encontraron citas para este usuario.');
        }

      },
      error: (err) => {
        console.error('Error al cargar las citas:', err);
        this.citas = [];
      },
    });
  }

  cargarFacturas(): void {
    if (!this.usuario?.idUsuario) {
      console.error('No se encontró un usuario válido.');
      return;
    }
    this.facturasService.getFacturasByUsuario(this.usuario.idUsuario).subscribe({
      next: (data) => {
        this.facturas = data;
        if (this.facturas.length === 0) {
          console.warn('No se encontraron facturas para este usuario.');
        }
      },
      error: (err) => {
        console.error('Error al cargar las facturas:', err);
        this.facturas = [];
      }
    });
  }
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  setActiveSection(section: 'vehiculos' | 'citas' | 'facturas'): void {
    this.activeSection = section;
    this.showSidebar = false;
    localStorage.setItem('activeSection', section);
    if (section === 'vehiculos') this.cargarVehiculos();
    if (section === 'citas') this.cargarCitas();
    if (section === 'facturas') this.cargarFacturas();
  }

  logout(): void {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToConfig(): void {
    this.router.navigate(['/configuracion-cuenta']);
  }

  onAddVehiculo(): void {
    this.nuevoVehiculo = { matricula: '', marca: '', modelo: '', anoFabricacion: 0, tipoMotor: '' };
    this.showAddVehiculoModal = true;
  }
  onEditVehiculo(vehiculo: Vehiculo): void {
    this.editMode = true;
    this.nuevoVehiculo = { ...vehiculo };
    this.showAddVehiculoModal = true;
  }

  closeAddVehiculoModal(): void {
    this.showAddVehiculoModal = false;
  }

  confirmAddVehiculo(): void {
    // Validación de campos obligatorios
    if (
      !this.nuevoVehiculo.matricula ||
      !this.nuevoVehiculo.marca ||
      !this.nuevoVehiculo.modelo ||
      !this.nuevoVehiculo.anoFabricacion ||
      !this.nuevoVehiculo.tipoMotor
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    // Crear el objeto Vehiculo para guardar


    // Llamar al servicio para guardar el vehículo

    if (this.editMode) {
      const vehiculoToSave: Vehiculo = {
        idVehiculo: this.nuevoVehiculo.idVehiculo!,
        usuarios: { idUsuario: this.usuario!.idUsuario } as any,
        marca: this.nuevoVehiculo.marca!,
        modelo: this.nuevoVehiculo.modelo!,
        matricula: this.nuevoVehiculo.matricula!,
        anoFabricacion: this.nuevoVehiculo.anoFabricacion,
        tipoMotor: this.nuevoVehiculo.tipoMotor
      };
      localStorage.setItem('vehiculo', JSON.stringify(vehiculoToSave));
      this.vehiculosService.updateVehiculo(vehiculoToSave).subscribe({
        next: () => {
          this.cargarVehiculos();
          this.showAddVehiculoModal = false;
          this.editMode = false;
        },
        error: () => alert('Error al actualizar el vehículo')
      });
    }
    else {
      const vehiculoToSave: VehiculoAdd = {

        marca: this.nuevoVehiculo.marca!,
        modelo: this.nuevoVehiculo.modelo!,
        matricula: this.nuevoVehiculo.matricula!,
        anoFabricacion: this.nuevoVehiculo.anoFabricacion,
        tipoMotor: this.nuevoVehiculo.tipoMotor,
        usuarios: { idUsuario: this.usuario!.idUsuario } as any
      };
      localStorage.setItem('vehiculo', JSON.stringify(vehiculoToSave));
      this.vehiculosService.saveVehiculo(vehiculoToSave).subscribe({
        next: () => {
          // Si se guarda correctamente, recargar la lista y cerrar el modal
          this.cargarVehiculos();
          this.showAddVehiculoModal = false;
        },
        error: () => {
          // Si ocurre un error, mostrar un mensaje de error
          this.errorMessage = 'Error al añadir el vehículo. Inténtalo de nuevo.';
        },
      });
    }
  }

  onDeleteVehiculo(MatriculaVehiculo: string): void {
    console.log('Eliminando vehículo con matrícula:', MatriculaVehiculo);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehiculosService.deleteVehiculoByMatricula(MatriculaVehiculo).subscribe({
          next: () => {
            this.cargarVehiculos();
            Swal.fire('Eliminado', 'El vehículo ha sido eliminado.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el vehículo. Inténtalo de nuevo.', 'error');
          },
        });
      }
    });
  }
  // Funciones para gestionar citas
  onAddCita(): void {
    this.editMode = false;
    this.nuevaCita = { fechaHora: new Date(), descripcion: '', estado: 'Pendiente', fechaCreacion: new Date() };
    this.showAddCitaModal = true;
  }

  onEditCita(cita: any): void {
    this.editMode = true;

    // Buscar el vehículo correspondiente en la lista de vehículos
    const vehiculoSeleccionado = this.vehiculos.find(
      (vehiculo) => vehiculo.idVehiculo === cita.vehiculos?.idVehiculo
    );

    this.nuevaCita = {
      ...cita,
      vehiculos: vehiculoSeleccionado || null,
    };

    this.showAddCitaModal = true;
  }

  closeAddCitaModal(): void {
    this.showAddCitaModal = false;
  }

  confirmAddCita(): void {
    if (!this.nuevaCita.vehiculos || !this.nuevaCita.fechaHora) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Construir el objeto cita con solo los campos visibles
    const citaToSave = {
      usuarios: { idUsuario: this.usuario!.idUsuario }, // Usuario actual
      vehiculos: this.nuevaCita.vehiculos, // Vehículo seleccionado
      fechaHora: Date.now(), // Fecha y hora de la cita
      descripcion: this.nuevaCita.descripcion || '', // Descripción de la cita
      estado: this.nuevaCita.estado, // Estado de la cita
      fechaCreacion: this.nuevaCita.fechaCreacion, // Fecha de creación de la cita
    };

    if (this.editMode) {
      // Lógica para editar una cita existente
      localStorage.setItem('cita', JSON.stringify(citaToSave));
      if (this.nuevaCita.idCita !== undefined) {
        this.citasService.update(this.nuevaCita.idCita, citaToSave).subscribe({
          next: () => {
            this.cargarCitas();
            this.showAddCitaModal = false;
            this.editMode = false;
          },
          error: () => alert('Error al actualizar la cita. Inténtalo de nuevo.'),
        });
      } else {
        alert('No se puede actualizar la cita porque no tiene un ID válido.');
      }
    } else {
      // Lógica para añadir una nueva cita
      this.citasService.create(citaToSave).subscribe({
        next: () => {
          this.cargarCitas();
          this.showAddCitaModal = false;
        },
        error: () => alert('Error al añadir la cita. Inténtalo de nuevo.'),
      });
    }
  }

  onDeleteCita(idCita?: number): void {
    if (!idCita) {
      alert('No se puede cancelar la cita porque no tiene un ID válido.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.citasService.delete(idCita).subscribe({
        next: () => this.cargarCitas(),
        error: () => alert('Error al cancelar la cita. Inténtalo de nuevo.'),
      });
    }
  }

  verDetallesCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.showDetallesCita = true;
    document.body.style.overflow = 'hidden';
    // Cargar seguimientos históricos
    this.seguimientoService.getSeguimientosByCita(cita.idCita!).subscribe(segs => {
      this.seguimientos = segs;
      localStorage.setItem('seguimientos', JSON.stringify(segs));
      this.seguimientoActual = segs[segs.length - 1] || null;
      localStorage.setItem('seguimientoActual', JSON.stringify(this.seguimientoActual));
    });
    // Conectar WebSocket para seguimiento en tiempo real
    this.seguimientoService.connectWebSocket(cita.idCita!);
    this.seguimientoService.onSeguimientoUpdate().subscribe(seg => {
      const idx = this.seguimientos.findIndex(s => s.idSeguimiento === seg.idSeguimiento);
      if (idx !== -1) {
        this.seguimientos[idx] = seg;
      } else {
        this.seguimientos.push(seg);
      }
      this.seguimientoActual = seg;
    });
  }

  cerrarDetallesCita(): void {
    this.showDetallesCita = false;
    this.citaSeleccionada = null;
    this.seguimientos = [];
    this.seguimientoActual = null;
    this.seguimientoService.disconnectWebSocket();
    document.body.style.overflow = ''; // Restaura scroll
  }
  pagarFactura(factura: Factura): void {
    this.facturasService.pagarFactura(factura.idFactura).subscribe({
      next: () => {
        this.cargarFacturas();
        Swal.fire('Éxito', 'Factura pagada correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo pagar la factura.', 'error');
      }
    });
  }

  onBrandChange() {
    this.carApiService.getCarModels(this.selectedBrandId).subscribe(models => this.carModels = models);
    this.selectedModelId = '';
  }

  onModelChange() {
    const selectedModel = this.carModels.find(m => m.id === this.selectedModelId);
    this.nuevoVehiculo.modelo = selectedModel?.name || '';
  }

  onBrandSelect() {
    const selectedBrand = this.carBrands.find(b => b.id === this.selectedBrandId);
    this.nuevoVehiculo.marca = selectedBrand?.name || '';
  }
  getImagenUrl(url: string | undefined): string {
    if (!url) return '';
    // Si la URL ya es absoluta, no la modifiques
    if (url.startsWith('http')) return url;
    // Si es relativa, añade el host del backend
    return 'http://localhost:8080' + url;
  }
  seleccionarSeguimiento(seg: Seguimiento) {
    this.seguimientoActual = seg;
  }

}