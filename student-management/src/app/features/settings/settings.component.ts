import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { SchoolSettings } from '../../core/models/models';

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

  constructor(
    public data: DataService,
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
}
