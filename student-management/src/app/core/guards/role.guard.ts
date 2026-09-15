import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    if (!this.auth.user) {
      return this.router.parseUrl('/login');
    }
    try {
      const role = await this.auth.getUserRole();
      if (!role) return this.router.parseUrl('/login');
      return true;
    } catch (e) {
      return this.router.parseUrl('/login');
    }
  }
}
