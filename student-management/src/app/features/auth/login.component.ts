import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { Role } from '../../core/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  activeTab: Role = 'admin';
  email = 'admin@school.com';
  password = 'password123';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    public auth: AuthService, 
    private router: Router,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  selectTab(role: Role) {
    this.activeTab = role;
    this.error = '';
    if (role === 'student') {
      this.email = 'aarav.patel@school.com';
    } else if (role === 'teacher') {
      this.email = 'robert@school.com';
    } else {
      this.email = 'admin@school.com';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email address and password.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.spinner.show(`Logging in...`);
    try {
      await this.auth.login(this.email, this.password, this.activeTab);
      const user = this.auth.currentUser();
      const name = user?.name || 'User';
      const role = user?.role || this.activeTab;
      this.toast.success(`Welcome back, ${name}!`, `Authenticated as ${role.toUpperCase()}`);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e?.message || 'Login failed. Please check credentials.';
      this.toast.error(this.error, 'Authentication Failed');
    } finally {
      this.loading = false;
      this.spinner.hide();
    }
  }

  quickLogin(role: Role) {
    this.selectTab(role);
    this.spinner.show(`Entering ${role.toUpperCase()} Portal...`);
    setTimeout(() => {
      this.auth.switchDemoRole(role);
      this.toast.info(`Logged into ${role.toUpperCase()} Portal`, 'Access Granted');
      this.spinner.hide();
      this.router.navigate(['/dashboard']);
    }, 300);
  }
}
