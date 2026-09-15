import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = 'admin@school.com';
  password = 'password123';
  loading = false;
  error = '';

  constructor(public auth: AuthService, private router: Router) {}

  async submit() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e?.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  quickLogin(role: Role) {
    this.auth.switchDemoRole(role);
    this.router.navigate(['/dashboard']);
  }
}
