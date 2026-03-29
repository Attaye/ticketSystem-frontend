// src/app/UI/home/home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../core/header/header';
import { FooterComponent } from '../../core/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  isSupport: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isSupport = this.authService.isSupport();
  }

  goToMyTickets(): void  { this.router.navigate(['/tickets']);     }
  goToReporting(): void  { this.router.navigate(['/reporting']);   }
  goToAllTickets(): void { this.router.navigate(['/all-tickets']); }
}
