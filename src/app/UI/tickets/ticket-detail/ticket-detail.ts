// src/app/UI/tickets/ticket-detail/ticket-detail.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
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
  isSupport: boolean = false;
  statusOptions: string[] = ['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED'];

  // Avatar-Farben für verschiedene User
  private avatarColors: string[] = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isSupport = this.authService.isSupport();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadTicket(+id);
  }

  loadTicket(id: number): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = {
          ...data,
          comments: (data.comments || []).flat()
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading ticket:', err);
        this.ticket = {
          id,
          number: 'INC000' + id,
          openedBy: 'Unknown',
          title: 'Error loading ticket',
          description: 'Could not load ticket data.',
          status: 'OPEN',
          comments: []
        };
        this.cdr.detectChanges();
      }
    });
  }

  onStatusChange(newStatus: string): void {
    this.ticketService.updateStatus(this.ticket.id, newStatus).subscribe({
      next: (updated) => {
        this.ticket.status = updated.status || newStatus;
        this.cdr.detectChanges();
      },
      error: () => {
        this.ticket.status = newStatus;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status?.toUpperCase();
    if (s === 'OPEN')                                                      return 'status-open';
    if (s === 'ON PROGRESS' || s === 'IN_PROGRESS' || s === 'ON_PROGRESS') return 'status-progress';
    if (s === 'DONE')                                                      return 'status-done';
    if (s === 'CLOSE' || s === 'CLOSED')                                   return 'status-close';
    return '';
  }

  // Farbe basierend auf Username-Hash
  getAvatarColor(name: string): string {
    if (!name) return this.avatarColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }

  // Datum schön formatieren
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      return `${day}.${month}.${year} · ${hours}:${mins}`;
    } catch {
      return dateStr.substring(0, 16);
    }
  }

  addComment(): void {
    if (!this.newComment.trim()) return;
    this.ticketService.addComment(this.ticket.id, this.newComment).subscribe({
      next:  () => {
        this.ticket.comments.push({
          text: this.newComment,
          author: localStorage.getItem('username') || 'You',
          createdAt: new Date().toISOString()
        });
        this.newComment = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.ticket.comments.push({
          text: this.newComment,
          author: localStorage.getItem('username') || 'You',
          createdAt: new Date().toISOString()
        });
        this.newComment = '';
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
