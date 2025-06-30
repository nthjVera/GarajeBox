import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../../model/Usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';
  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, contrasena: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials).pipe(
      tap(usuario => this.usuarioActual = usuario)
    );
  }

  register(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuario);
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  logout(): void {
    this.usuarioActual = null;
  }
}