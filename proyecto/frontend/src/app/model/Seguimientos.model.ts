export interface Seguimiento {
  idSeguimiento?: number;
  idCita?: number;
  descripcion: string;
  imagenUrl?: string;
  estado: string;
  fechaActualizacion: Date;
}