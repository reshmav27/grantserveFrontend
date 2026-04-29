import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgramService } from '../service/program.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramDataService } from '../service/program-data.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProgramCardComponent } from '../program-card.component/program-card.component';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ScrollToTopComponent } from '../scroll-to-top.component/scroll-to-top.component';
import { FilterCriteria } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { PagedResponse } from '../model/paged-model';

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
      0, // Page reset
      10,
      criteria.sortBy,
      criteria.direction
    ).pipe(
      switchMap((response: PagedResponse<any>) => {
        const content = response.content || [];
        if (content.length === 0) return of([]);

        const ids = content.map((p: any) => Number(p.programID));

        return forkJoin({
          list: of(content),
          budgets: this.dataService.getAllBudgets(),
          analytics: this.dataService.getBulkAnalytics(ids)
        }).pipe(
          switchMap(({ list, budgets, analytics }) => {
            const mapped = list.map((prog: any) => {
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
            console.log('Mapped Program Data:', mapped);
            return of(mapped);
          })
        );
      })
    ).subscribe({
      next: (mappedData: any) => {
        this.allPrograms = mappedData;
        this.isLoading = false;
        this.cdr.detectChanges();

        // console.log('Mapped Program Data:', this.allPrograms);
      }
    });
  }

}