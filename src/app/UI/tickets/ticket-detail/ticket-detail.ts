// src/app/UI/tickets/ticket-detail/ticket-detail.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { HeaderComponent } from '../../../core/header/header';
import { FooterComponent } from '../../../core/footer/footer';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetailComponent implements OnInit {
  ticket: any = null;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadTicket(+id);
  }

  loadTicket(id: number): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => { this.ticket = data; },
      error: () => {
        // Fallback mock data while backend is not ready
        this.ticket = {
          id,
          number:      'INC000' + id,
          openedBy:    'Max Mustermann',
          title:       'Docker problem',
          description: 'Docker is not working because of some issue in the configuration. The container fails to start and throws an error on boot.',
          comments:    []
        };
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;
    this.ticketService.addComment(this.ticket.id, this.newComment).subscribe({
      next:  () => { this.ticket.comments.push(this.newComment); this.newComment = ''; },
      error: () => { this.ticket.comments.push(this.newComment); this.newComment = ''; }
    });
  }

  goBack(): void { this.router.navigate(['/tickets']); }
}
