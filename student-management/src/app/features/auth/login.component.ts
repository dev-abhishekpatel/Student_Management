import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
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

  constructor(
    public auth: AuthService, 
    private router: Router,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  async submit() {
    this.loading = true;
    this.error = '';
    this.spinner.show('Authenticating...');
    try {
      await this.auth.login(this.email, this.password);
      this.toast.success('Logged in successfully!', `Welcome ${this.auth.currentUser()?.name}`);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e?.message || 'Login failed';
      this.toast.error(this.error, 'Authentication Failed');
    } finally {
      this.loading = false;
      this.spinner.hide();
    }
  }

  quickLogin(role: Role) {
    this.spinner.show(`Switching to ${role} demo workspace...`);
    setTimeout(() => {
      this.auth.switchDemoRole(role);
      this.toast.info(`Switched to ${role.toUpperCase()} mode`, 'Demo Role Activated');
      this.spinner.hide();
      this.router.navigate(['/dashboard']);
    }, 400);
  }
}
