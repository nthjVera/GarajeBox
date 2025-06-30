import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat/chat.service';
import { MensajeChat } from '../../../model/MensajeChat.model';
import { Usuario } from '../../../model/Usuarios.model';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() idConversacion!: number;
  @Input() usuario!: Usuario;
  @Input() modoFlotante: boolean = true;

  mensajesChat: MensajeChat[] = [];
  nuevoMensaje: string = '';
  mensajeWsSub: Subscription | null = null;

  mostrarChat = false;
  hayNuevoMensaje = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    if (this.idConversacion) {
      this.chatService.connectWebSocket(this.idConversacion);
      this.cargarMensajes();

      if (this.mensajeWsSub) this.mensajeWsSub.unsubscribe();
      this.mensajeWsSub = this.chatService.onMensaje().subscribe(mensaje => {
        // Si el chat está oculto, muestra el indicador de nuevo mensaje
        if (!this.mostrarChat) {
          this.hayNuevoMensaje = true;
        }
        this.cargarMensajes();
      });
    }
  }

  toggleChat() {
  this.mostrarChat = !this.mostrarChat;
  if (this.mostrarChat) {
    this.hayNuevoMensaje = false;
    // Marcar como leídos los mensajes de tu compañero
    const mensajesNoLeidos = this.mensajesChat.filter(
      m => m.idRemitente !== this.usuario.idUsuario && !m.leido
    );
    if (mensajesNoLeidos.length > 0) {
      const ids: number[] = mensajesNoLeidos
        .map((m: MensajeChat) => m.idMensaje)
        .filter((id): id is number => id !== undefined); // Asegúrate de tener idMensaje en el modelo
      this.chatService.marcarMensajesLeidos(ids).subscribe(() => {
        // Actualiza el estado localmente
        this.mensajesChat.forEach(m => {
          if (m.idRemitente !== this.usuario.idUsuario) m.leido = true;
        });
      });
    }
    setTimeout(() => this.scrollChatToBottom(), 100);
  }
}

  enviarMensajeChat() {
    if (!this.nuevoMensaje.trim() || !this.idConversacion || !this.usuario) return;
    const mensaje: MensajeChat = {
      idConversacion: this.idConversacion,
      idRemitente: this.usuario.idUsuario!,
      contenido: this.nuevoMensaje.trim(),
      fechaEnvio: new Date()
    };
    this.chatService.sendMensaje(mensaje);
    this.nuevoMensaje = '';
  }

  cargarMensajes() {
    this.chatService.getMensajesByConversacion(this.idConversacion).subscribe(mensajes => {
      this.mensajesChat = mensajes;
      setTimeout(() => this.scrollChatToBottom(), 100);
    });
  }

  scrollChatToBottom() {
    const chatDiv = document.getElementById('chat-mensajes');
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  ngOnDestroy(): void {
    if (this.mensajeWsSub) this.mensajeWsSub.unsubscribe();
    this.chatService.disconnectWebSocket();
  }
}