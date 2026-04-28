import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgramService } from '../service/program.service';
import { Program } from '../model/program.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramDataService } from '../service/program-data.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProgramCardComponent } from '../program-card.component/program-card.component';
import { ProgramAnalytics } from '../model/program.model';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { RouterLink } from '@angular/router';
import { ScrollToTopComponent } from '../scroll-to-top.component/scroll-to-top.component';

@Component({
  selector: 'app-program',
  imports: [CommonModule, FormsModule, ProgramCardComponent, ManagerHeaderComponent, RouterLink, ScrollToTopComponent],
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css'],
  standalone: true
})
export class ProgramComponent implements OnInit {
  activePrograms: any[] = []; 
  draftPrograms: any[] = [];
  isLoading: boolean = true;

  constructor(
    private programService: ProgramService,
    private dataService: ProgramDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // 1. We call the API twice: once for DRAFT and once for everything else
    forkJoin({
      draftResponse: this.programService.searchPrograms(undefined, undefined, ['DRAFT'], 0, 4),
      activeResponse: this.programService.searchPrograms(undefined, undefined, ['ACTIVE', 'CLOSED', 'FORECASTED'], 0, 4) 
    }).pipe(
      switchMap(({ draftResponse, activeResponse }) => {
        // Extract content from Page objects
        const drafts = draftResponse.content || [];
        
        // Filter the second call to exclude drafts (in case the API includes them by default)
        const activeList = (activeResponse.content || []).filter((p: any) => p.status?.toUpperCase() !== 'DRAFT');
        
        // Save drafts immediately (limit to 4 just in case)
        this.draftPrograms = drafts.slice(0, 4);

        if (activeList.length === 0) {
          return of({ activeList: [], budgets: [], analytics: {} });
        }

        const ids = activeList.map((p: any) => Number(p.programID));

        // 2. Fetch parallel data for the active programs only
        return forkJoin({
          activeList: of(activeList),
          budgets: this.dataService.getAllBudgets(),
          analytics: this.dataService.getBulkAnalytics(ids)
        });
      })
    ).subscribe({
      next: (result: any) => {
        const { activeList, budgets, analytics } = result;

        // 3. Map Active Programs for the Card Component
        this.activePrograms = activeList.slice(0, 4).map((prog: any) => {
          const budgetData = budgets.find((b: any) => b.programId == prog.programID);
          return {
            prog: prog,
            budget: {
              spentAmount: budgetData?.spentAmount || 0,
              totalAmount: budgetData?.allocatedAmount || 0
            },
            analytics: analytics[prog.programID] || { totalApplications: 0, acceptanceRate: 0 }
          };
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.isLoading = false;
      }
    });
  }
}