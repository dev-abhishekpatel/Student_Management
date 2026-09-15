import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { Notice } from '../../core/models/models';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notices.component.html'
})
export class NoticesComponent {
  selectedCategory = signal('');

  // Form fields
  title = '';
  message = '';
  category: 'General' | 'Academic' | 'Exam' | 'Event' | 'Urgent' = 'General';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents' = 'All';
  isPinned = false;

  filteredNotices = computed(() => {
    let list = this.data.notices();
    const cat = this.selectedCategory();
    if (cat) {
      list = list.filter(n => n.category === cat);
    }
    return list;
  });

  constructor(
    public data: DataService,
    public auth: AuthService
  ) {}

  addNotice() {
    if (!this.title || !this.message) return;
    const author = this.auth.currentUser()?.name || 'School Office';
    const today = new Date().toISOString().split('T')[0];

    const newNotice: Notice = {
      title: this.title,
      message: this.message,
      category: this.category,
      targetAudience: this.targetAudience,
      isPinned: this.isPinned,
      authorName: author,
      createdAt: today
    };

    this.data.addNotice(newNotice);

    // Reset Form
    this.title = '';
    this.message = '';
    this.isPinned = false;
  }

  deleteNotice(id: string) {
    if (confirm('Delete announcement?')) {
      this.data.deleteNotice(id);
    }
  }
}
