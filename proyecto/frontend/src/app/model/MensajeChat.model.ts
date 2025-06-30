export interface MensajeChat {
  idMensaje?: number;
  idConversacion: number;
  idRemitente: number;
  contenido: string;
  fechaEnvio?: Date;
  leido?: boolean;
}