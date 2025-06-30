import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Seguimiento } from '../../model/Seguimientos.model';

import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  private apiUrl = environment.apiUrl + '/api/seguimientos';
  private stompClient: Client | null = null;
  private seguimientoSubject = new Subject<Seguimiento>();

  constructor(private http: HttpClient) {}

  getSeguimientosByCita(idCita: number): Observable<Seguimiento[]> {
      return this.http.get<Seguimiento[]>(`${this.apiUrl}/cita/${idCita}`);
  }

  createSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.post<Seguimiento>(this.apiUrl, seguimiento);
  }
  createMultiple(seguimientos: Seguimiento[]): Observable<Seguimiento[]> {
    return this.http.post<Seguimiento[]>(`${this.apiUrl}/multiple`, seguimientos);
  }
  updateSeguimiento(seguimiento: Seguimiento): Observable<Seguimiento> {
    return this.http.put<Seguimiento>(`${this.apiUrl}/${seguimiento.idSeguimiento}`, seguimiento);
  }
  updateMultiple(seguimientos: Seguimiento[]): Observable<Seguimiento[]> {
    return this.http.put<Seguimiento[]>(`${this.apiUrl}/multiple`, seguimientos);
  }
  deleteSeguimiento(idSeguimiento: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idSeguimiento}`);
  }
  
  connectWebSocket(idCita: number) {
    const socket = new SockJS(environment.apiUrl.replace('/api', '') + '/ws-chat');
    this.stompClient = over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient?.subscribe(`/topic/seguimiento/${idCita}`, (message) => {
              const seguimiento: Seguimiento = JSON.parse(message.body);
              this.seguimientoSubject.next(seguimiento);
            });
    });
  }

  onSeguimientoUpdate(): Observable<Seguimiento> {
      return this.seguimientoSubject.asObservable();
    }

  disconnectWebSocket() {
    this.stompClient?.disconnect(() => {});
    this.stompClient = null;
  }
}