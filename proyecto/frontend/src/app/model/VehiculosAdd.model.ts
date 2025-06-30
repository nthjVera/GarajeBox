export interface VehiculoAdd { 
  marca: string;
  modelo: string;
  matricula: string;
  anoFabricacion?: number;
  tipoMotor?: string;
  usuarios?: { idUsuario: number };
}