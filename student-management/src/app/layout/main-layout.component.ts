import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';
import { Role } from '../core/models/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);

  constructor(
    public auth: AuthService,
    public data: DataService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  changeDemoRole(role: Role) {
    this.auth.switchDemoRole(role);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
