import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="brand">DevPanel</div>
      <nav class="nav">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/users" routerLinkActive="active">Usuarios</a>
      </nav>
      <div class="user-area">
        @if (auth.currentUser(); as user) {
          <span class="user-name">{{ user.fullName }}</span>
          <span class="user-role">{{ user.role }}</span>
        }
        <button class="logout-btn" (click)="auth.logout()">Salir</button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .brand { font-weight: 700; color: var(--color-primary); }
    .nav { display: flex; gap: var(--space-3); flex: 1; }
    .nav a { text-decoration: none; color: var(--color-text-muted); font-size: 14px; }
    .nav a.active { color: var(--color-primary); font-weight: 600; }
    .user-area { display: flex; align-items: center; gap: var(--space-2); }
    .user-name { font-size: 14px; font-weight: 600; }
    .user-role {
      font-size: 11px;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      padding: 2px 8px;
    }
    .logout-btn {
      border: 1px solid var(--color-border);
      background: transparent;
      border-radius: var(--radius-sm);
      padding: 6px 12px;
      font-size: 13px;
    }
    .logout-btn:hover { background: var(--color-bg); }
  `]
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}
