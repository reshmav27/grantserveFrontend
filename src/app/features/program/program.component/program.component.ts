import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgramService } from '../service/program.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramDataService } from '../service/program-data.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError, finalize, tap } from 'rxjs/operators';
import { ProgramCardComponent } from '../program-card.component/program-card.component';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ScrollToTopComponent } from '../scroll-to-top.component/scroll-to-top.component';
import { FilterCriteria } from '../../../shared/components/navigation/manager-header.component/manager-header.component';

@Component({
  selector: 'app-program',
  imports: [CommonModule, FormsModule, ProgramCardComponent, ManagerHeaderComponent, ScrollToTopComponent],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css'],
  standalone: true
})
export class ProgramComponent implements OnInit {
  allPrograms: any[] = [];
  isLoading: boolean = true;

  currentCriteria: FilterCriteria = {
    title: '',
    status: undefined,
    sortBy: 'programID',
    direction: 'desc'
  };

  constructor(
    private programService: ProgramService,
    private dataService: ProgramDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPrograms(this.currentCriteria);
  }

  onFilterChange(criteria: FilterCriteria): void {
    this.currentCriteria = criteria;
    this.loadPrograms(criteria);
  }

  loadPrograms(criteria: FilterCriteria): void {
    this.isLoading = true;
    
    this.programService.searchPrograms(
      criteria.title,
      undefined,
      criteria.status,
      criteria.startDate,
      criteria.endDate,
      0, 
      10,
      criteria.sortBy,
      criteria.direction
    ).pipe(
      tap(response => console.log('1. Raw API Result:', response)),
      
      switchMap((response: any) => {
        // FIX: Handle both PagedResponse { content: [] } and raw Array []
        const content = Array.isArray(response) ? response : (response?.content || []);
        
        console.log('2. Extracted Content:', content);

        if (content.length === 0) return of([]);

        const ids = content.map((p: any) => Number(p.programID));

        return forkJoin({
          list: of(content),
          budgets: this.dataService.getAllBudgets().pipe(catchError(() => of([]))),
          analytics: this.dataService.getBulkAnalytics(ids).pipe(catchError(() => of({})))
        });
      }),
      map((combinedData: any) => {
        if (Array.isArray(combinedData) && combinedData.length === 0) return [];

        const { list, budgets, analytics } = combinedData;

        return list.map((prog: any) => {
          // Ensure ID matching handles string vs number
          const budgetData = budgets.find((b: any) => b.programId == prog.programID);
          
          return {
            prog: prog,
            isDraft: prog.status?.toUpperCase() === 'DRAFT',
            budget: {
              spentAmount: budgetData?.spentAmount || 0,
              totalAmount: budgetData?.allocatedAmount || 0
            },
            analytics: analytics[prog.programID] || { totalApplications: 0, acceptanceRate: 0 }
          };
        });
      }),
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (mappedData: any[]) => {
        console.log('3. Final Data assigned to allPrograms:', mappedData);
        this.allPrograms = [...mappedData];
      },
      error: (err) => {
        console.error('Fatal Stream Error:', err);
        this.allPrograms = [];
      }
    });
  }
}