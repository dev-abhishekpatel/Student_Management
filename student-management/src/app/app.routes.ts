import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [RoleGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./features/students/list.component').then(m => m.StudentsListComponent)
      },
      {
        path: 'students/new',
        loadComponent: () => import('./features/students/form.component').then(m => m.StudentFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'teacher'] }
      },
      {
        path: 'students/:id/edit',
        loadComponent: () => import('./features/students/form.component').then(m => m.StudentFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'teachers',
        loadComponent: () => import('./features/teachers/teachers.component').then(m => m.TeachersComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'classes',
        loadComponent: () => import('./features/classes/classes.component').then(m => m.ClassesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'timetable',
        loadComponent: () => import('./features/timetable/timetable.component').then(m => m.TimetableComponent)
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/exams/exams.component').then(m => m.ExamsComponent)
      },
      {
        path: 'fees',
        loadComponent: () => import('./features/fees/fees.component').then(m => m.FeesComponent)
      },
      {
        path: 'notices',
        loadComponent: () => import('./features/notices/notices.component').then(m => m.NoticesComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
