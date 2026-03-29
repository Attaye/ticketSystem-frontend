// src/app/UI/reporting/reporting.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { HeaderComponent } from '../../core/header/header';
import { FooterComponent } from '../../core/footer/footer';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './reporting.html',
  styleUrl: './reporting.css'
})
export class ReportingComponent {
  form = {
    openedBy:    '',
    title:       '',
    description: ''
  };

  successMessage: string = '';
  errorMessage:   string = '';

  constructor(private router: Router, private ticketService: TicketService) {}

  onSubmit(): void {
    if (!this.form.openedBy || !this.form.title || !this.form.description) {
      this.errorMessage   = 'Please fill in all fields.';
      this.successMessage = '';
      return;
    }
    this.ticketService.createTicket(this.form).subscribe({
      next: () => {
        this.successMessage = 'Issue submitted successfully!';
        this.errorMessage   = '';
        this.form = { openedBy: '', title: '', description: '' };
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: () => {
        this.errorMessage   = 'Failed to submit. Please try again.';
        this.successMessage = '';
      }
    });
  }
  // reporting.component.ts
  openedBy: string = '';

  ngOnInit(): void {
    // FALSCH: this.openedBy = localStorage.getItem('username') || '';

    // RICHTIG: form.openedBy setzen!
    this.form.openedBy = localStorage.getItem('username') || '';
  }

  onCancel(): void { this.router.navigate(['/home']); }
  goBack(): void   { this.router.navigate(['/home']); }
}
