import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgramService } from '../service/program.service';
import { ProgramDataService } from '../service/program-data.service';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ProgramCardComponent } from '../program-card.component/program-card.component';
import { ScrollToTopComponent } from '../scroll-to-top.component/scroll-to-top.component';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Program } from '../model/program.model';

@Component({
  selector: 'app-all-programs',
  standalone: true,
  imports: [CommonModule, ProgramCardComponent, ManagerHeaderComponent, ScrollToTopComponent],
  templateUrl: './all-programs.component.html',
  styleUrl: './all-programs.component.css',
})
export class AllProgramsComponent implements OnInit {
  displayTitle: string = '';
  isDraftView: boolean = false;
  isLoading: boolean = true;
  filteredPrograms: any[] = [];
  
  // Pagination State
  currentPage: number = 0;
  pageSize: number = 10; // Set your preferred items per page
  totalPages: number = 0;
  totalElements: number = 0;
  programType: string = '';

  constructor(
    private route: ActivatedRoute,
    private programService: ProgramService,
    private dataService: ProgramDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.programType = params['type'];
      this.currentPage = 0; // Reset to first page on type change
      this.loadAndFilterPrograms();
    });
  }

  loadAndFilterPrograms(): void {
    this.isLoading = true;
    let statusFilter: string[] = [];
    
    if (this.programType === 'draft') {
      statusFilter = ['DRAFT'];
      this.displayTitle = 'Your Drafts';
      this.isDraftView = true;
    } else {
      statusFilter = ['ACTIVE', 'CLOSED', 'FORECASTED']; 
      this.displayTitle = 'Active & Published Programs';
      this.isDraftView = false;
    }

    // Passing pagination parameters to service
    this.programService.searchPrograms(
      undefined, 
      undefined, 
      statusFilter, 
      this.currentPage, 
      this.pageSize
    ).pipe(
      switchMap((pageData: any) => {
        this.totalPages = pageData.totalPages;
        this.totalElements = pageData.totalElements;
        const content = pageData.content || [];

        if (this.isDraftView) {
          return of(content);
        } else {
          if (content.length === 0) return of([]);

          const ids = content.map((p: Program) => Number(p.programID));
          
          return forkJoin({
            activeList: of(content),
            budgets: this.dataService.getAllBudgets(),
            analytics: this.dataService.getBulkAnalytics(ids)
          }).pipe(
            switchMap(({ activeList, budgets, analytics }) => {
              const mapped = activeList.map((prog: Program) => {
                const budgetData = budgets.find(b => b.programId == prog.programID);
                return {
                  prog: prog,
                  budget: {
                    spentAmount: budgetData?.spentAmount || 0,
                    totalAmount: budgetData?.allocatedAmount || 0
                  },
                  analytics: analytics[prog.programID] || { 
                    totalApplications: 0, 
                    approvedApplications: 0, 
                    acceptanceRate: 0 
                  }
                };
              });
              return of(mapped);
            })
          );
        }
      })
    ).subscribe({
      next: (mappedData) => {
        this.filteredPrograms = mappedData;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading programs:', err);
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadAndFilterPrograms();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}