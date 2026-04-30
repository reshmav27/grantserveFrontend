import { CommonModule, Location } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for ngModel

export interface FilterCriteria {
  title: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy: string;
  direction: string;
}

export interface NavItem {
  label: string;
  route: string;
  icon?: string; // used in offcanvas
}

@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.css',
})
export class ManagerHeaderComponent {
  @Input() showSubHeader: boolean = true;
  @Input() isDashboard: boolean = false;
  @Input() title: string = 'All Programs';

  @Output() filterChange = new EventEmitter<FilterCriteria>(); // Updated Output

  isOffcanvasOpen = false;
  navItems: NavItem[] = [
    { label: 'Programs', route: '/programs', icon: 'bi-grid' },
    { label: 'Applications', route: '/applications', icon: 'bi-file-earmark-text' },
    { label: 'Disbursements', route: '/disbursements', icon: 'bi-cash-stack' },
    { label: 'Compliance', route: '/compliance', icon: 'bi-shield-check' }
  ];

  // Internal State
  selectedStatus: string = 'ALL';
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  sortBy: string = 'programID';
  direction: string = 'desc';
  showAdvancedFilters: boolean = false;

  availableStatuses = [
    { label: 'All', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Closed', value: 'CLOSED' },
    { label: 'Forecasted', value: 'FORECASTED' }
  ];

  constructor(private location: Location, private router: Router) { }

  applyFilters() {
    this.filterChange.emit({
      title: this.searchTerm,
      status: this.selectedStatus === 'ALL' ? undefined : this.selectedStatus,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      sortBy: this.sortBy,
      direction: this.direction
    });
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  toggleOffcanvas() {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
  }

  closeOffcanvas() {
    this.isOffcanvasOpen = false;
  }

  logout() {
    this.closeOffcanvas();
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}