import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgramService } from '../../program/service/program.service';
import { ProgramCardComponent } from '../../program/program-card.component/program-card.component';
import { PagedResponse } from '../../program/model/paged-model';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { forkJoin, of, switchMap } from 'rxjs';
import { FilterCriteria } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ProgramDataService } from '../../program/service/program-data.service';

@Component({
  selector: 'app-program-list',
  imports: [ProgramCardComponent, Sidebar, FormsModule, CommonModule],
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit {
  pagedData: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  searchTerm: string = '';
  status: string = 'ALL';
  startDate: string = '';
  endDate: string = '';
  sortBy: string = 'programID';
  direction: string = 'desc';
  showAdvancedFilters: boolean = false;
  
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;

  currentFilters: FilterCriteria = {
    title: '',
    status: '',
    sortBy: '',
    direction: ''
  };

  constructor(
    private programService: ProgramService,
    private dataService: ProgramDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPrograms(this.currentFilters);
  }

  applyFilters(): void {
    this.currentFilters = {
      ...this.currentFilters,
      title: this.searchTerm,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      sortBy: this.sortBy,
      direction: this.direction,
      status: this.status === "ALL" ? undefined : this.status
    };
    
    this.loadPrograms(this.currentFilters);
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadPrograms(this.currentFilters, page);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadPrograms(criteria: FilterCriteria, page: number = 0): void {
      this.isLoading = true;
      this.currentPage = page;
      
      this.programService.searchProgramsForResearcher(
        criteria.title,
        undefined,
        criteria.status,
        criteria.startDate,
        criteria.endDate,
        this.currentPage,
        this.pageSize,
        criteria.sortBy,
        criteria.direction
      ).pipe(
        switchMap((response: PagedResponse<any>) => {
          this.currentPage = response.page?.number || 0;
          this.totalPages = response.page?.totalPages || 0;

          const content = response.content || [];
          if (content.length === 0) return of([]);
  
          const ids = content.map((p: any) => Number(p.programID));
  
          return forkJoin({
            list: of(content),
            budgets: this.dataService.getAllBudgets()
          }).pipe(
            switchMap(({ list, budgets }) => {
              const mapped = list.map((prog: any) => {
                const budgetData = budgets.find((b: any) => b.programId == prog.programID);
                return {
                  prog: prog,
                  budget: {
                    spentAmount: budgetData?.spentAmount || 0,
                    totalAmount: budgetData?.allocatedAmount || 0
                  }
                };
              });
              return of(mapped);
            })
          );
        })
      ).subscribe({
        next: (mappedData: any) => {
          this.pagedData = mappedData;
          this.isLoading = false;
          this.cdr.detectChanges();

          console.log('Mapped Program Data:', this.pagedData);
        }
      });
    }

}