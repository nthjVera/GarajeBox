import { Routes } from '@angular/router';
import { LoguinComponent } from './components/auth/loguin/loguin.component';
import { HomeClienteComponent } from './components/vistas/home-cliente/home-cliente.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RolGuard } from './services/guard/guard.service';
import { HomeMecanicoComponent } from './components/vistas/home-mecanico/home-mecanico.component';
import { HomeAdministradorComponent } from './components/vistas/home-administrador/home-administrador.component';

export const routes: Routes = [
  { path: 'login', component: LoguinComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'homeCliente', component: HomeClienteComponent, canActivate: [RolGuard(['Cliente'])] },
  { path: 'homeMecanico', component: HomeMecanicoComponent, canActivate: [RolGuard(['Mecanico'])]},
  { path: 'homeAdmin', component: HomeAdministradorComponent, canActivate: [RolGuard(['Administrador'])]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];