// src/app/UI/tickets/tickets.ts
import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.ongoingTickets = tickets.filter(t => t.status === 'Open' || t.status === 'On progress');
        this.closedTickets  = tickets.filter(t => t.status === 'Done' || t.status === 'Close');
      },
      error: () => this.loadMockData()
    });
  }

  loadMockData(): void {
    const mock = [
      { id: 1, number: 'INC0001', title: 'Docker problem', opened: '16.03.2026', status: 'Open',        description: 'Docker is not working because of some issue in ...' },
      { id: 2, number: 'INC0002', title: 'Docker problem', opened: '17.03.2026', status: 'On progress', description: 'Docker is not working because of some issue in ...' },
      { id: 3, number: 'INC0003', title: 'Docker problem', opened: '20.03.2026', status: 'Open',        description: 'Docker is not working because of some issue in ...' },
      { id: 4, number: 'INC0004', title: 'Docker problem', opened: '30.03.2026', status: 'On progress', description: 'Docker is not working because of some issue in ...' },
    ];
    this.ongoingTickets = mock.filter(t => t.status === 'Open' || t.status === 'On progress');
    this.closedTickets  = mock.filter(t => t.status === 'Done' || t.status === 'Close');
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Open':        'status-open',
      'On progress': 'status-progress',
      'Done':        'status-done',
      'Close':       'status-close'
    };
    return map[status] || '';
  }

  openTicket(id: number): void { this.router.navigate(['/tickets', id]); }
  goBack(): void               { this.router.navigate(['/home']); }
}
