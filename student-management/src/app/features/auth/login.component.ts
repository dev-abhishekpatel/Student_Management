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
  activeTab: Role = 'student';
  email = 'aarav.patel@school.com';
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
    this.loading = true;
    this.error = '';
    this.spinner.show(`Logging in as ${this.activeTab.toUpperCase()}...`);
    try {
      await this.auth.login(this.email, this.password, this.activeTab);
      const name = this.auth.currentUser()?.name || 'User';
      this.toast.success(`Welcome back, ${name}!`, `Authenticated as ${this.activeTab.toUpperCase()}`);
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
    this.spinner.show(`Entering ${role.toUpperCase()} Workspace...`);
    setTimeout(() => {
      this.auth.switchDemoRole(role);
      this.toast.info(`Logged into ${role.toUpperCase()} Portal`, 'Demo Access Granted');
      this.spinner.hide();
      this.router.navigate(['/dashboard']);
    }, 400);
  }
}
