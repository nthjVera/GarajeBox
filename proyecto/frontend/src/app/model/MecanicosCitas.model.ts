import { Usuario } from './Usuarios.model';

export interface MecanicosCitas {
  idCita: number;
  idMecanico: number;
  mecanico: Usuario;
}