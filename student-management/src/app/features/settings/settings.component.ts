import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { SchoolSettings, Role } from '../../core/models/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  settings: SchoolSettings = {
    schoolName: '',
    code: '',
    academicYear: '',
    email: '',
    phone: '',
    address: '',
    principalName: '',
    themeColor: '#4f46e5'
  };

  savedMessage = false;
  userSearch = signal('');
  userFilterStatus = signal<string>('All'); // 'All' | 'Pending' | 'Active' | 'Inactive'

  filteredAccounts = computed(() => {
    let list = this.auth.registeredAccounts();
    const search = this.userSearch().toLowerCase().trim();
    const statusFilter = this.userFilterStatus();

    if (search) {
      list = list.filter(u => 
        u.name.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search) ||
        u.role.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'All') {
      if (statusFilter === 'Pending') {
        list = list.filter(u => !u.active || u.status === 'Pending');
      } else if (statusFilter === 'Active') {
        list = list.filter(u => u.active && u.status !== 'Pending');
      } else if (statusFilter === 'Inactive') {
        list = list.filter(u => !u.active && u.status !== 'Pending');
      }
    }

    return list;
  });

  pendingCount = computed(() => {
    return this.auth.registeredAccounts().filter(u => !u.active).length;
  });

  constructor(
    public data: DataService,
    public auth: AuthService,
    private toast: ToastService,
    private spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.settings = { ...this.data.schoolSettings() };
  }

  save() {
    this.spinner.show('Saving institutional settings...');
    setTimeout(() => {
      this.data.updateSettings(this.settings);
      this.savedMessage = true;
      this.toast.success('School configuration updated successfully!', 'Settings Saved');
      this.spinner.hide();
      setTimeout(() => this.savedMessage = false, 3000);
    }, 350);
  }

  // Account Activation Controls (Admin Permissions)
  approveAccount(uid: string, name: string) {
    this.auth.approveAccount(uid);
    this.toast.success(`User account for "${name}" has been APPROVED and ACTIVATED!`, 'Account Activated');
  }

  deactivateAccount(uid: string, name: string) {
    this.auth.toggleAccountStatus(uid, false);
    this.toast.warning(`User account for "${name}" deactivated.`, 'Account Deactivated');
  }

  changeUserRole(uid: string, newRole: string) {
    this.auth.updateAccountRole(uid, newRole as Role);
    this.toast.info(`Updated user role to ${newRole.toUpperCase()}`, 'Role Permission Updated');
  }

  deleteAccount(uid: string, name: string) {
    if (confirm(`Are you sure you want to delete user account "${name}"?`)) {
      this.auth.deleteAccount(uid);
      this.toast.info(`Account "${name}" permanently removed.`, 'User Account Removed');
    }
  }
}
