import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerApplicationDto } from '../model/manager-disbursement.model';

@Component({
  selector: 'app-manager-app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-app-card.html',
  styleUrl: './manager-app-card.css'
})
export class ManagerAppCard {
  @Input() data!: ManagerApplicationDto;
  @Output() initiate = new EventEmitter<ManagerApplicationDto>();
  @Output() process = new EventEmitter<ManagerApplicationDto>();
  @Output() delete = new EventEmitter<ManagerApplicationDto>();

  get formattedId(): string {
    return `APP-${this.data.applicationID.toString().padStart(3, '0')}`;
  }

  get status(): string {
    if (!this.data.disbursementID) return 'APPROVED';
    const s = this.data.disbursementStatus?.toUpperCase();
    if (s === 'PROCESSING' || s === 'INITIATED') return 'INITIATED';
    if (s === 'COMPLETED') return 'COMPLETED';
    return 'APPROVED';
  }

  get badgeClass(): string {
    const map: Record<string, string> = {
      APPROVED: 'badge-idle',
      INITIATED: 'badge-initiated',
      COMPLETED: 'badge-completed'
    };
    return map[this.status] ?? 'badge-idle';
  }
}
