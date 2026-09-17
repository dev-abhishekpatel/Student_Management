import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';
import { Role } from '../core/models/models';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);

  constructor(
    public auth: AuthService,
    public data: DataService,
    private router: Router,
    private toast: ToastService
  ) {}

  toggleSidebar() {
    if (window.innerWidth < 768) {
      this.mobileSidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(val => !val);
    }
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen.set(false);
  }

  changeDemoRole(role: Role) {
    this.auth.switchDemoRole(role);
    this.closeMobileSidebar();
  }

  logout() {
    this.closeMobileSidebar();
    this.auth.logout();
    this.toast.info('You have been signed out.', 'Logged Out');
    this.router.navigate(['/login']);
  }
}
