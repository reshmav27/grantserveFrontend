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
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-view-program',
  standalone: true,
  imports: [CommonModule, RouterModule, ManagerHeaderComponent, Sidebar],
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.css'],
})
export class ViewProgramComponent implements OnInit {
  programData: any;
  viewMode: 'manager' | 'researcher' = 'researcher'; // This could come from an Auth service

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
    // 1. Get role from local storage
    const storedRole = localStorage.getItem('userRole')?.toLowerCase();

    // 2. Set viewMode (defaulting to researcher if not found)
    this.viewMode = storedRole === 'manager' ? 'manager' : 'researcher';

    // 3. Get the ID from the URL
    const id = this.route.snapshot.paramMap.get('id');

    // 2. Fetch data
    if (id) {
      this.loadProgramData(id);
    }
  }

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
    this.isLoading = true;

    // 1. Determine which stream to use based on role
    const programRequest$ = this.viewMode === 'manager'
      ? this.programService.searchPrograms(undefined, Number(id))
      : this.programService.searchProgramsForResearcher(undefined, Number(id));

    programRequest$.pipe(
      switchMap((response: PagedResponse<any>) => {
        const content = response.content || [];
        if (content.length === 0) return of(null);

        // FIX: Grab the FIRST item (the specific program) from the results array
        const actualProgram = content[0];
        const ids = [Number(actualProgram.programID)];

        // 2. Prepare parallel requests
        const sources: any = {
          program: of(actualProgram),
          budget: this.dataService.getBudgetByBudgetId(actualProgram.programID)
        };

        // Only fetch analytics if manager
        if (this.viewMode === 'manager') {
          sources.analytics = this.dataService.getBulkAnalytics(ids);
        }

        return forkJoin(sources);
      }),
      switchMap((results: any) => {
        if (!results) return of(null);

        const { program, budget, analytics } = results;

        // 3. Map to the specific format the HTML expects
        const mapped = {
          program: program, // This is now a single object, not an array
          isDraft: program.status?.toUpperCase() === 'DRAFT',
          budget: {
            spentAmount: budget?.spentAmount || 0,
            totalAmount: budget?.allocatedAmount || 0,
            remainingAmount: budget?.remainingAmount || 0,
          },
          analytics: (analytics && analytics[program.programID]) || {
            totalApplications: 0,
            acceptanceRate: 0,
            monthlyStats: { labels: [], accepted: [], rejected: [], pending: [] }
          },
        };

        return of(mapped);
      })
    ).subscribe({
      next: (mappedData: any) => {
        this.programData = mappedData;
        this.isLoading = false;
        this.cdr.detectChanges();

        // 4. Initialize chart for managers if data exists
        if (
          this.viewMode === 'manager' &&
          !this.programData?.isDraft &&
          this.programData?.analytics?.totalApplications > 0
        ) {
          setTimeout(() => this.initChart());
        }
      },
      error: (err) => {
        console.error("Error loading program:", err);
        this.isLoading = false;
      }
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
