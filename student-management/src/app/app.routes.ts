import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [RoleGuard] },
  { path: 'students', loadComponent: () => import('./features/students/list.component').then(m => m.StudentsListComponent), canActivate: [RoleGuard] },
  { path: 'students/new', loadComponent: () => import('./features/students/form.component').then(m => m.StudentFormComponent), canActivate: [RoleGuard] },
  { path: 'students/:id/edit', loadComponent: () => import('./features/students/form.component').then(m => m.StudentFormComponent), canActivate: [RoleGuard] },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
