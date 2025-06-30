import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environments';
import { MensajeChat } from '../../model/MensajeChat.model';

import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/api/mensajes'; // Ajusta si tu endpoint es diferente
  private stompClient: Client | null = null;
  private mensajeSubject = new Subject<MensajeChat>();

  constructor(private http: HttpClient) { }

  getMensajesByConversacion(idConversacion: number): Observable<MensajeChat[]> {
    return this.http.get<MensajeChat[]>(`${this.apiUrl}/conversacion/${idConversacion}`);
  }

  sendMensaje(mensaje: MensajeChat) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(mensaje)
      );
    }
  }

  marcarMensajesLeidos(ids: number[]) {
    return this.http.post(`${this.apiUrl}/marcar-leidos`, { ids });
  }

  connectWebSocket(idConversacion: number) {
    const socket = new SockJS(environment.apiUrl.replace('/api', '') + '/ws-chat');
    this.stompClient = over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient?.subscribe(`/topic/chat/${idConversacion}`, (message) => {
        const mensaje: MensajeChat = JSON.parse(message.body);
        this.mensajeSubject.next(mensaje);
      });
    });
  }

  onMensaje(): Observable<MensajeChat> {
    return this.mensajeSubject.asObservable();
  }

  disconnectWebSocket() {
    this.stompClient?.disconnect(() => { });
    this.stompClient = null;
  }
}