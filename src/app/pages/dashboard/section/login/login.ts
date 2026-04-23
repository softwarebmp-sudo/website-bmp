import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      this.loading = false;

      if (email === 'admin@bmpcompany.com' && password === '123456') {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_role', 'admin');
        this.router.navigate(['/admin/panel']);
        return;
      }

      if (email === 'ingeniero@bmpcompany.com' && password === '123456') {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_role', 'engineer');
        this.router.navigate(['/admin/panel']);
        return;
      }

      alert('Credenciales inválidas');
    }, 1000);
  }
}