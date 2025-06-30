import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Usuario } from '../../../model/Usuarios.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loguin',
  imports: [FormsModule, CommonModule],
  templateUrl: './loguin.component.html',
  styleUrl: './loguin.component.css'
})
export class LoguinComponent implements OnInit {
  email: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario: Usuario = JSON.parse(usuarioGuardado);
      // Redirige automáticamente según el tipo de usuario
      if (usuario.tipoUsuario === 'Cliente') {
        this.router.navigate(['/homeCliente']);
      } else if (usuario.tipoUsuario === 'Mecanico') {
        this.router.navigate(['/homeMecanico']);
      } else if (usuario.tipoUsuario === 'Administrador') {
        this.router.navigate(['/homeAdmin']);
      }
    }
  }

  onSubmit(): void {
    this.error = '';
    this.authService.login({ email: this.email, contrasena: this.contrasena }).subscribe({
      next: (usuario: Usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        if (usuario.tipoUsuario === 'Cliente') {
          this.router.navigate(['/homeCliente']);
        } else if (usuario.tipoUsuario === 'Mecanico') {
          this.router.navigate(['/homeMecanico']);
        } else if (usuario.tipoUsuario === 'Administrador') {
          this.router.navigate(['/homeAdmin']);
        } else {
          this.error = 'Tipo de usuario no reconocido';
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
  forgotPassword(): void {
    // Lógica para recuperar contraseña
  }
}