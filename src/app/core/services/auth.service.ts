// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // POST /api/auth/login → { token, role, username }
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { username, password });
  }

  setSession(response: any): void {
    // Backend gibt KEIN token zurück, nur userId/username/role
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('role', response.role);
    localStorage.setItem('username', response.username);
  }

  getToken(): string | null {
    return null; // Kein JWT Token vorhanden
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  isSupport(): boolean {
    return this.getRole() === 'SUPPORT';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }
}
