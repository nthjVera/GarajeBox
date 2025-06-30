import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../../model/Citas.model';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(id: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/usuario/${id}`);
  }

  getByVehiculoId(id: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/vehiculo/${id}`);
  }

  getByUsuarioAndVehiculo(idUsuario: number, idVehiculo: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/usuario/${idUsuario}/vehiculo/${idVehiculo}`);
  }
  getCitasByMecanico(idMecanico: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/mecanico/${idMecanico}`);
  }

  getSeguimientosByCita(idCita: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seguimiento/${idCita}`);
  }
  finalizarCita(idCita: number, montoTotal: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/finalizar/${idCita}`, { montoTotal });
  }

  create(cita: any): Observable<any> {
  return this.http.post(this.apiUrl, cita);
  }

  update(id: number, cita: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cita);
}

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
