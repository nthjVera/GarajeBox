import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../../model/Factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private apiUrl = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) {}

  getFacturasByUsuario(idUsuario: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }
  getFacturaById(idFactura: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${idFactura}`);
  }

  pagarFactura(idFactura: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idFactura}/pagar`, {});
  }
}