import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ProgramService } from '../service/program.service';
import { ProgramDataService } from '../service/program-data.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { PagedResponse } from '../model/paged-model';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-view-program',
  standalone: true,
  imports: [CommonModule, RouterModule, ManagerHeaderComponent],
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.css'],
})
export class ViewProgramComponent implements OnInit {
  programData: any;
  viewMode: 'manager' | 'researcher' = 'manager'; // This could come from an Auth service

  @ViewChild('analyticsChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  isLoading: boolean = true;
  isDescriptionExpanded = false;
  readonly DESCRIPTION_LIMIT = 1300;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private programService: ProgramService,
    private dataService: ProgramDataService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // 1. Get the ID from the URL
    const id = this.route.snapshot.paramMap.get('id');

    // 2. Fetch data
    if (id) {
      this.loadProgramData(id);
    }
  }

  // ngAfterViewInit() {
  //   if (this.viewMode === 'manager' && !this.programData?.isDraft && this.programData?.analytics?.monthlyStats?.labels?.length > 0) {
  //     this.initChart();
  //   }
  // }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  shouldShowReadMore(text: string): boolean {
    return text ? text.length > this.DESCRIPTION_LIMIT : false;
  }

  goBack() {
    this.location.back();
  }

  private loadProgramData(id: string): void {
    // 1. Ensure the observable is typed as a Page/any or array based on your latest service
    this.programService
      .searchPrograms(undefined, Number(id))
      .pipe(
        switchMap((respones: PagedResponse<any>) => {
          const content = respones.content || [];
          if (content.length === 0) return of([]);

          const id = content.map((p: any) => Number(p.programID));

          return forkJoin({
            program: content,
            budget: this.dataService.getBudgetByBudgetId(id[0]),
            analytics: this.dataService.getBulkAnalytics(id),
          }).pipe(
            switchMap(({ program, budget, analytics }) => {
              const mapped = {
                program: program,
                isDraft: program.status?.toUpperCase() === 'DRAFT',
                budget: {
                  spentAmount: budget?.spentAmount || 0,
                  totalAmount: budget?.allocatedAmount || 0,
                  remainingAmount: budget?.remainingAmount || 0,
                },
                analytics: analytics[program.programID] || {
                  totalApplications: 0,
                  acceptanceRate: 0,
                },
              };
              console.log('Mapped Program Data:', mapped);
              return of(mapped);
            }),
          );
        }),
      )
      .subscribe({
        next: (mappedData: any) => {
          this.programData = mappedData;
          this.isLoading = false;

          this.cdr.detectChanges();

          if (
            this.viewMode === 'manager' &&
            !this.programData.isDraft &&
            this.programData.analytics?.totalApplications > 0
          ) {
            setTimeout(() => this.initChart());
          }
        },
      });
  }

  initChart() {
    const stats = this.programData.analytics.monthlyStats;
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
}
