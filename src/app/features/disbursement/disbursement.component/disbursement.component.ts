import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { DisbursementService } from '../service/disbursement.service';
import { DisbursementDto } from '../model/disbursement.model';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { DisbursementCard } from '../disbursement-card/disbursement-card';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, DisbursementCard],
  templateUrl: './disbursement.component.html',
  styleUrl: './disbursement.component.css'
})
export class DisbursementComponent implements OnInit {
  all: DisbursementDto[] = [];
  filtered: DisbursementDto[] = [];
  currentFilter = 'All';
  selected: DisbursementDto | null = null;
  statusCounts = { All: 0, Pending: 0, Initiated: 0, Completed: 0 };

  searchTerm = '';
  isSearching = false;
  private searchSubject = new Subject<string>();

  constructor(private service: DisbursementService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.service.getDisbursements().subscribe({
      next: (data) => {
        this.all = data;
        this.filtered = [...data];
        this.calculateCounts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load disbursements', err)
    });

    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(term => {
      this.isSearching = term.trim().length > 0;
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target ? event.target.value : event;
    this.isSearching = this.searchTerm.trim().length > 0;
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.applyFilters();
  }

  filterBy(status: string): void {
    this.currentFilter = status;
    this.applyFilters();
    this.cdr.detectChanges();
  }

  private applyFilters(): void {
    let base = this.isSearching
      ? this.all.filter(d => d.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : [...this.all];

    if (this.currentFilter !== 'All') {
      const target = this.currentFilter === 'Initiated' ? 'INITIATED' : this.currentFilter.toUpperCase();
      base = base.filter(d => this.resolvedStatus(d) === target);
    }
    this.filtered = base;
  }

  resolvedStatus(d: DisbursementDto): string {
    if (!d.disbursementID) return 'PENDING';
    const s = d.disbursementStatus?.toUpperCase();
    if (s === 'PROCESSING') return 'INITIATED';
    return s;
  }

  private calculateCounts(): void {
    this.statusCounts.All = this.all.length;
    this.statusCounts.Pending = this.all.filter(d => this.resolvedStatus(d) === 'PENDING').length;
    this.statusCounts.Initiated = this.all.filter(d => this.resolvedStatus(d) === 'INITIATED').length;
    this.statusCounts.Completed = this.all.filter(d => this.resolvedStatus(d) === 'COMPLETED').length;
  }

  get dateLabel(): string {
    const s = this.selected ? this.resolvedStatus(this.selected) : '';
    return s === 'COMPLETED' ? 'Payment Date' : 'Expected Payment Date';
  }

  get dateValue(): string {
    if (!this.selected) return '--';
    const s = this.resolvedStatus(this.selected);
    if (s === 'COMPLETED') return this.selected.payment?.paymentDate ?? '--';
    if (s === 'INITIATED') return 'Expected within 7 days';
    return '--';
  }
}
