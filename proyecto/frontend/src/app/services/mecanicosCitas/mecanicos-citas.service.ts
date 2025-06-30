import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { MecanicosCitas } from '../../model/MecanicosCitas.model';

@Injectable({
  providedIn: 'root'
})
export class MecanicosCitasService {
  private apiUrl = environment.apiUrl + '/api/mecanicos_citas';

  constructor(private http: HttpClient) {}

  // Asignar mecánico a cita
  asignarMecanico(idCita: number, idMecanico: number): Observable<MecanicosCitas> {
    return this.http.post<MecanicosCitas>(`${this.apiUrl}/asignar`, { idCita, idMecanico });
  }

  // Obtener mecánico asignado a una cita
  getMecanicoByCita(idCita: number): Observable<MecanicosCitas | null> {
    return this.http.get<MecanicosCitas | null>(`${this.apiUrl}/cita/${idCita}`);
  }

  // Desasignar mecánico de cita
  desasignarMecanico(idCita: number, idMecanico: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cita/${idCita}/mecanico/${idMecanico}`);
  }
}