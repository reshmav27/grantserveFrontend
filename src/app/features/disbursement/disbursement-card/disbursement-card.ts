import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursementDto } from '../model/disbursement.model';

@Component({
  selector: 'app-disbursement-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disbursement-card.html',
  styleUrl: './disbursement-card.css'
})
export class DisbursementCard {
  @Input() data!: DisbursementDto;
  @Output() viewDetails = new EventEmitter<DisbursementDto>();

  get formattedId(): string {
    return `APP-${this.data.applicationID.toString().padStart(3, '0')}`;
  }

  get resolvedStatus(): string {
    if (!this.data.disbursementID) return 'PENDING';
    const s = this.data.disbursementStatus?.toUpperCase();
    if (s === 'PROCESSING') return 'INITIATED';
    return s;
  }

  get dateDisplay(): string {
    if (this.resolvedStatus === 'COMPLETED') return this.data.payment?.paymentDate ?? '--';
    return '--';
  }

  get isInitiated(): boolean {
    return this.resolvedStatus === 'INITIATED';
  }

  get statusClass(): string {
    const map: Record<string, string> = {
      PENDING: 'status-pending',
      INITIATED: 'status-processing',
      COMPLETED: 'status-completed'
    };
    return map[this.resolvedStatus] ?? 'status-pending';
  }
}
