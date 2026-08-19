import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HeaderComponent } from '../../shared/layout/header.component';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, DatePipe],
  template: `
    <app-header />
    <main class="page">
      <div class="toolbar">
        <h1>Usuarios</h1>
        <input
          class="search"
          type="search"
          placeholder="Buscar por nombre o email..."
          [formControl]="searchControl"
        />
      </div>

      @if (loading()) {
        <p class="muted">Cargando usuarios...</p>
      } @else if (users().length === 0) {
        <p class="muted">Sin resultados para esta búsqueda.</p>
      } @else {
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <span class="badge" [class.inactive]="user.status === 'INACTIVE'">
                    {{ user.status }}
                  </span>
                </td>
                <td>{{ user.createdAt | date: 'short' }}</td>
              </tr>
            }
          </tbody>
        </table>

        <div class="pagination">
          <button [disabled]="page() === 0" (click)="goToPage(page() - 1)">Anterior</button>
          <span class="page-info">Página {{ page() + 1 }} de {{ totalPages() || 1 }}</span>
          <button [disabled]="page() + 1 >= totalPages()" (click)="goToPage(page() + 1)">Siguiente</button>
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: var(--space-4); max-width: 1100px; margin: 0 auto; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }
    h1 { margin: 0; }
    .search {
      padding: 8px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      min-width: 260px;
    }
    .muted { color: var(--color-text-muted); }
    .table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 10px 14px;
      font-size: 14px;
      border-bottom: 1px solid var(--color-border);
    }
    th { color: var(--color-text-muted); font-weight: 600; font-size: 12px; text-transform: uppercase; }
    tbody tr:last-child td { border-bottom: none; }
    .badge {
      display: inline-block;
      font-size: 11px;
      padding: 2px 10px;
      border-radius: 999px;
      background: #e6f4ea;
      color: #1e7a34;
    }
    .badge.inactive { background: #fdecea; color: var(--color-danger); }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin-top: var(--space-4);
    }
    .pagination button {
      padding: 6px 14px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      border-radius: var(--radius-sm);
    }
    .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-info { font-size: 13px; color: var(--color-text-muted); }
  `]
})
export class UsersComponent implements OnInit {
  searchControl = new FormControl('', { nonNullable: true });

  users = signal<User[]>([]);
  loading = signal(true);
  page = signal(0);
  totalPages = signal(0);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load(this.searchControl.value, 0);

    // Debounced search: waits 300ms after the user stops typing, skips the
    // call entirely if the text didn't actually change, and always resets
    // back to page 0 for a fresh search — instead of reloading the whole
    // table on every keystroke.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.loading.set(true);
          this.page.set(0);
          return this.userService.search(term, 0, PAGE_SIZE);
        })
      )
      .subscribe({
        next: (result) => {
          this.users.set(result.content);
          this.totalPages.set(result.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  goToPage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages()) return;
    this.load(this.searchControl.value, newPage);
  }

  private load(search: string, page: number): void {
    this.loading.set(true);
    this.userService.search(search, page, PAGE_SIZE).subscribe({
      next: (result) => {
        this.users.set(result.content);
        this.page.set(result.page);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
