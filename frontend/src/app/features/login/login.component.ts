import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page">
      <form class="login-card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>DevPanel</h1>
        <p class="subtitle">Inicia sesión para continuar</p>

        <label>
          Email
          <input type="email" formControlName="email" placeholder="admin@devpanel.local" autocomplete="username" />
        </label>

        <label>
          Password
          <input type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password" />
        </label>

        @if (errorMessage()) {
          <div class="error">{{ errorMessage() }}</div>
        }

        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Ingresando...' : 'Ingresar' }}
        </button>

        <p class="hint">Demo: admin&#64;devpanel.local / Admin123!</p>
      </form>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg);
      padding: var(--space-4);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      box-shadow: 0 4px 24px rgba(20, 30, 60, 0.06);
    }
    h1 { margin: 0; color: var(--color-primary); }
    .subtitle { margin: 0; color: var(--color-text-muted); font-size: 14px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--color-text-muted); }
    input {
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 14px;
    }
    input:focus { outline: 2px solid var(--color-primary); outline-offset: 1px; }
    button {
      margin-top: var(--space-2);
      padding: 10px 12px;
      border: none;
      border-radius: var(--radius-sm);
      background: var(--color-primary);
      color: white;
      font-weight: 600;
    }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    button:not(:disabled):hover { background: var(--color-primary-dark); }
    .error {
      background: #fdecea;
      color: var(--color-danger);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      font-size: 13px;
    }
    .hint { margin: 0; font-size: 12px; color: var(--color-text-muted); text-align: center; }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'No se pudo iniciar sesión. Verifica tus credenciales.'
        );
      }
    });
  }
}