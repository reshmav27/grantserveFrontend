import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { ProgramService } from '../service/program.service';
import { ChangeDetectorRef } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-program-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.css',
})
export class ProgramCardComponent implements AfterViewInit {
  @Input() data: any; 
  @Input() index: number = 0;
  @Input() isDraft: boolean = false;

  @ViewChild('analyticsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  isExpanded: boolean = false;
  isTitleExpanded: boolean = false;
  readonly DESC_LIMIT = 170;
  readonly TITLE_LIMIT = 100;

  constructor(
    private programService: ProgramService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (!this.isDraft && this.data?.analytics?.monthlyStats?.labels?.length > 0) {
      this.initChart();
    }
  }

  toggleDescription() {
    this.isExpanded = !this.isExpanded;
  }

  get description(): string {
    return this.data?.prog?.description || 'No description available.';
  }

  get shouldShowReadMore(): boolean {
    return this.description.length > this.DESC_LIMIT;
  }

  toggleTitle() {
    this.isTitleExpanded = !this.isTitleExpanded;
  }

  get programTitle(): string {
    return this.data?.prog?.title || 'No Title';
  }

  get shouldShowTitleReadMore(): boolean {
    return this.programTitle.length > this.TITLE_LIMIT;
  }

  initChart() {
    const stats = this.data.analytics.monthlyStats;
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: stats.labels,
        datasets: [
          { label: 'Accepted', data: stats.accepted, backgroundColor: '#0d6efd', borderRadius: 4 },
          { label: 'Rejected', data: stats.rejected, backgroundColor: '#e2e8f0', borderRadius: 4 },
          { label: 'Pending', data: stats.pending, backgroundColor: '#ffc107', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter' } } } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f0f0f0', ...({ borderDash: [5, 5] } as any) } }
        }
      }
    });
  }

  closeProgram(id: number): void {
    if (confirm('Are you sure you want to close this program?')) {
      this.programService.closeProgram(id).subscribe({
        next: (response) => {
          alert('Program closed successfully!');
          // Update the local data status to reflect the change immediately
            // this.data.prog = { ...this.data.prog, status: 'CLOSED' };
          this.data.prog.status = 'CLOSED';
          this.cdr.detectChanges();
        },
        error: (err) => {
          // Handle the text response parsing issue if status is 200
          if (err.status === 200) {
            alert('Program closed successfully!');
            this.data.prog.status = 'CLOSED';
            this.cdr.detectChanges();
          } else {
            console.error('Failed to close program:', err);
            alert(err);
          }
        }
      });
    }
  }
}