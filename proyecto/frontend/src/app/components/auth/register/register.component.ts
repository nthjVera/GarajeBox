import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../model/Usuarios.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  contrasena: string = '';
  telefono: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    const usuario: Usuario = {
      nombre: this.nombre,
      email: this.email,
      contrasena: this.contrasena,
      telefono: this.telefono,
      tipoUsuario: 'Cliente' // replace with appropriate default or value
    };
    console.log(JSON.stringify(usuario));
    this.authService.register(usuario).subscribe({
      next: () => {
        Swal.fire({
        title: "Registro exitoso",
        icon: "success"
      }).then(() => {
        this.router.navigate(['/login']);
      });
        
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar usuario';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}