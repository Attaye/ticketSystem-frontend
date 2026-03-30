// src/app/UI/tickets/tickets.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { HeaderComponent } from '../../core/header/header';
import { FooterComponent } from '../../core/footer/footer';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class TicketsComponent implements OnInit {
  ongoingTickets: any[] = [];
  closedTickets:  any[] = [];
  activeTab: 'ongoing' | 'closed' = 'ongoing';

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.ongoingTickets = tickets.filter(t => {
          const s = t.status?.toUpperCase();
          return s === 'OPEN' || s === 'ON PROGRESS' || s === 'IN_PROGRESS' || s === 'ON_PROGRESS';
        });
        this.closedTickets = tickets.filter(t => {
          const s = t.status?.toUpperCase();
          return s === 'DONE' || s === 'CLOSE' || s === 'CLOSED';
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading my tickets:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status?.toUpperCase();
    if (s === 'OPEN')                                                      return 'status-open';
    if (s === 'ON PROGRESS' || s === 'ON_PROGRESS' || s === 'IN_PROGRESS') return 'status-progress';
    if (s === 'DONE')                                                      return 'status-done';
    if (s === 'CLOSE' || s === 'CLOSED')                                   return 'status-close';
    return '';
  }

  openTicket(id: number): void { this.router.navigate(['/tickets', id]); }
  goBack(): void               { this.router.navigate(['/home']); }
}
