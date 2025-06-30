import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { VehiculoAdd } from '../../model/VehiculosAdd.model';
import { Vehiculo } from '../../model/Vehiculos.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private apiUrl = environment.apiUrl + '/api/vehiculos';

  constructor(private http: HttpClient) {}

  getAllVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.apiUrl);
  }

  findByMatricula(matricula: string): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${this.apiUrl}/Matricula`, matricula);
  }

  findByUsuarioId(idUsuario: number): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/usuario/` + idUsuario);
  }

  saveVehiculo(vehiculo: VehiculoAdd): Observable<void> {
    return this.http.post<void>(this.apiUrl, vehiculo);
  }

  updateVehiculo(vehiculo: Vehiculo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/`+vehiculo.idVehiculo, vehiculo);
  }

  deleteVehiculoByMatricula(matricula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matricula/${matricula}`);
  }
  
}