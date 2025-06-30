import { CanActivateFn } from '@angular/router';
import { Usuario } from '../../model/Usuarios.model'; // Corrige la ruta si es necesario

export function RolGuard(rolesPermitidos: string[]): CanActivateFn {
  return () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      return false;
    }
    let usuario: Usuario;
    try {
      usuario = JSON.parse(usuarioGuardado);
    } catch {
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      return false;
    }
    if (!usuario || !usuario.tipoUsuario || !rolesPermitidos.includes(usuario.tipoUsuario)) {
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      return false;
    }
    return true;
  };
}