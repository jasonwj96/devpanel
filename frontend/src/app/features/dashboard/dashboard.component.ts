import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/layout/header.component';
import { UserService } from '../../core/services/user.service';
import { DashboardMetrics } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  template: `
    <app-header />
    <main class="page">
      <h1>Dashboard</h1>

      @if (loading()) {
        <p class="muted">Cargando métricas...</p>
      } @else if (metrics(); as m) {
        <div class="cards">
          <div class="card">
            <span class="card-label">Usuarios totales</span>
            <span class="card-value">{{ m.totalUsers }}</span>
          </div>
          <div class="card">
            <span class="card-label">Usuarios activos</span>
            <span class="card-value">{{ m.activeUsers }}</span>
          </div>
          <div class="card">
            <span class="card-label">Usuarios inactivos</span>
            <span class="card-value">{{ m.inactiveUsers }}</span>
          </div>
          <div class="card">
            <span class="card-label">Administradores</span>
            <span class="card-value">{{ m.adminUsers }}</span>
          </div>
        </div>
      } @else {
        <p class="muted">No se pudieron cargar las métricas.</p>
      }
    </main>
  `,
  styles: [`
    .page { padding: var(--space-4); max-width: 960px; margin: 0 auto; }
    h1 { margin: 0 0 var(--space-4); }
    .muted { color: var(--color-text-muted); }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-3);
    }
    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .card-label { font-size: 13px; color: var(--color-text-muted); }
    .card-value { font-size: 32px; font-weight: 700; color: var(--color-primary); }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  metrics = signal<DashboardMetrics | null>(null);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.metrics().subscribe({
      next: (m) => {
        this.metrics.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
