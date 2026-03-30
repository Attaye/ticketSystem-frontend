// src/app/UI/all-tickets/all-tickets.ts
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService, Ticket } from '../../core/services/ticket.service';
import { HeaderComponent } from '../../core/header/header';
import { FooterComponent } from '../../core/footer/footer';

@Component({
  selector: 'app-all-tickets',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './all-tickets.html',
  styleUrl: './all-tickets.css'
})
export class AllTicketsComponent implements OnInit {
  allTickets: Ticket[] = [];

  constructor(private router: Router,
              private ticketService: TicketService,
              private cdr: ChangeDetectorRef,
  ) {}

ngOnInit(): void {
  this.ticketService.getAllTickets().subscribe({
    next: (tickets: Ticket[]) => {
      this.allTickets = [...tickets];
      this.cdr.detectChanges();  // NEU: erzwingt UI-Update
    },
    error: () => {
      this.allTickets = [];
      this.cdr.detectChanges();
    }
  });
}

  loadMockData(): void {
    this.allTickets = [
      { id: 1, number: 'INC0001', openedBy: 'Max M.', title: 'Docker problem',
        createdAt: '2026-03-16',  // ← opened → createdAt
        status: 'Open', priority: 'HIGH', category: 'Software',
        description: 'Docker is not working', updatedAt: '', comments: [] },
      // ... andere Einträge gleich anpassen
    ];
  }

  getStatusClass(status: string): string {
    const s = status?.toUpperCase();
    if (s === 'OPEN')                                         return 'status-open';
    if (s === 'ON PROGRESS' || s === 'IN_PROGRESS' || s === 'ON_PROGRESS') return 'status-progress';
    if (s === 'DONE')                                         return 'status-done';
    if (s === 'CLOSE' || s === 'CLOSED')                      return 'status-close';
    return '';
  }

  openTicket(id: number): void { this.router.navigate(['/tickets', id]); }
  goBack(): void               { this.router.navigate(['/home']); }
}
