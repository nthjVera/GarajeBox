export interface Vehiculo {
  idVehiculo?: number;
  usuarios?: number;
  marca: string;
  modelo: string;
  matricula: string;
  anoFabricacion?: number;
  tipoMotor?: string;
}