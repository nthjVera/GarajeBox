export interface Usuario {
  idUsuario?: number;
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
  tipoUsuario: string;
  fotoPerfil?: string;
  token?: string;
  fechaRegistro?: Date;
}