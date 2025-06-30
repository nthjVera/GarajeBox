import { Usuario } from './Usuarios.model';
import { Vehiculo } from './Vehiculos.model';

export interface Cita {
  idCita: number;
  usuarios: Usuario;      // Usuario que solicita la cita
  vehiculos: Vehiculo;    // Vehículo relacionado
  mecanico?: Usuario | null; // Mecánico asignado (puede ser null)
  idConversacion?: number;
  fechaHora: Date;
  descripcion?: string;
  estado?: string;
  fechaCreacion?: Date;
}