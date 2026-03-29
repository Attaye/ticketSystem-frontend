// src/app/core/services/ticket.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ticket {
  id:          number;
  number:      string;
  openedBy:    string;
  title:       string;
  description: string;
  priority:    string;
  category:    string;
  status:      string;
  createdAt:   string;   // ← opened → createdAt
  updatedAt:   string;
  comments:    any[];
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET /api/tickets/my  → my own tickets (MITARBEITER)
  getMyTickets(): Observable<Ticket[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<Ticket[]>(`${this.api}/api/tickets/my?userId=${userId}`);
  }


  // GET /api/tickets → ALL tickets (SUPPORT only)
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.api}/api/tickets`);
  }

  // GET /api/tickets/{id}
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.api}/api/tickets/${id}`);
  }

  // POST /api/tickets
  createTicket(dto: any): Observable<Ticket> {
    const userId = localStorage.getItem('userId');
    return this.http.post<Ticket>(`${this.api}/api/tickets?userId=${userId}`, dto);
  }

  // PATCH /api/tickets/{id}/status  (SUPPORT only)
  updateStatus(id: number, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.api}/api/tickets/${id}/status`, { status });
  }

  // POST /api/tickets/{id}/comments
  addComment(ticketId: number, text: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.post(`${this.api}/api/tickets/${ticketId}/comments?userId=${userId}`, { text });
  }
}
