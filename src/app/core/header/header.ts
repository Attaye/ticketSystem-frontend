// src/app/core/header/header.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
