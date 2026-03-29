// src/app/app.routing.module.ts
import { Routes } from '@angular/router';
import { authGuard }    from './core/guards/auth.guard';
import { supportGuard } from './core/guards/support.guard';

export const routes: Routes = [
  { path: '',            redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./UI/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets',
    loadComponent: () => import('./UI/tickets/tickets').then(m => m.TicketsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tickets/:id',
    loadComponent: () => import('./UI/tickets/ticket-detail/ticket-detail').then(m => m.TicketDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reporting',
    loadComponent: () => import('./UI/reporting/reporting').then(m => m.ReportingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'all-tickets',
    loadComponent: () => import('./UI/all-tickets/all-tickets').then(m => m.AllTicketsComponent),
    canActivate: [authGuard, supportGuard]
  },
  { path: '**', redirectTo: 'login' }
];
