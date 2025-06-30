export interface Factura {
  idFactura: number;
  fechaEmision: string;
  montoTotal: number;
  estadoPago: string;
  cita: {
    idCita: number;
    usuarios: {
      idUsuario: number;
      nombre: string;
      email: string;
      contrasena: string | null;
      telefono: string;
      tipoUsuario: string;
      fotoPerfil: string | null;
      token: string | null;
      fechaRegistro: string | null;
    } | null;
    vehiculos: {
      idVehiculo: number;
      marca: string;
      modelo: string;
      matricula: string;
      anoFabricacion: string | null;
      tipoMotor: string | null;
    } | null;
    mecanico: {
      idUsuario: number;
      nombre: string;
      email: string;
      contrasena: string | null;
      telefono: string;
      tipoUsuario: string;
      fotoPerfil: string | null;
      token: string | null;
      fechaRegistro: string | null;
    } | null;
    idConversacion: number | null;
    fechaHora: string;
    descripcion: string;
    estado: string;
    fechaCreacion: string | null;
  };
}