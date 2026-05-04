import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { ManagerDisbursementService } from '../service/manager-disbursement.service';
import { BudgetDto, ManagerApplicationDto } from '../model/manager-disbursement.model';
import { ProgramService } from '../../program/service/program.service';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { Footer } from '../../../shared/components/footer/footer';
import { ManagerAppCard } from '../manager-app-card/manager-app-card';

@Component({
  selector: 'app-manager-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagerHeaderComponent, Footer, ManagerAppCard],
  templateUrl: './manager-disbursement.component.html',
  styleUrl: './manager-disbursement.component.css'
})
export class ManagerDisbursementComponent implements OnInit {
  programs: any[] = [];
  selectedProgram: any = null;
  applications: ManagerApplicationDto[] = [];
  budget: BudgetDto | null = null;

  showInitModal = false;
  showProcModal = false;
  targetApp: ManagerApplicationDto | null = null;
  initiateAmount: number | null = null;
  paymentMethod = 'BANK';
  isSubmitting = false;

  constructor(
    private service: ManagerDisbursementService,
    private programService: ProgramService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.programService.getAllPrograms().subscribe({
      next: (data: any[]) => {
        this.programs = data.filter(p => p.status === 'ACTIVE' || p.status === 'FORECASTED');
        this.cdr.detectChanges();
      }
    });
  }

  openProgram(program: any): void {
    this.selectedProgram = program;
    this.loadProgramData(program.programID);
  }

  loadProgramData(programId: number): void {
    this.service.getApplicationsByProgram(programId).pipe(
      switchMap((apps) => {
        const approved = apps.filter(a => a.status === 'APPROVED');
        if (approved.length === 0) return of({ approved: [], disbResults: [] });

        const requests = approved.map(app =>
          this.service.getDisbursementsByApplication(app.applicationID).pipe(
            catchError(() => of([]))
          )
        );
        return forkJoin(requests).pipe(
          map(disbResults => ({ approved, disbResults }))
        );
      })
    ).subscribe({
      next: ({ approved, disbResults }: any) => {
        this.applications = approved.map((app: any, i: number) => {
          const disbs = disbResults[i] || [];
          const active = disbs.find((d: any) => {
            const s = d.status?.toUpperCase();
            return s === 'PROCESSING' || s === 'INITIATED';
          });
          const completed = disbs.filter((d: any) => d.status?.toUpperCase() === 'COMPLETED');
          const hasOnlyCompleted = !active && completed.length > 0;
          return {
            ...app,
            disbursementID: active?.disbursementID ?? (hasOnlyCompleted ? completed[completed.length - 1].disbursementID : undefined),
            disbursementAmount: active?.amount ?? undefined,
            disbursementStatus: active ? 'PROCESSING' : (hasOnlyCompleted ? 'COMPLETED' : undefined),
            payment: active?.payment ?? null,
            completedDisbursements: completed
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error loading program data:', err);
        this.cdr.detectChanges(); 
      }
    });

    this.service.getBudgetByProgram(programId).subscribe({
      next: (b) => { 
        this.budget = b; 
        this.cdr.detectChanges(); 
      },
      error: (err) => { 
        console.error('Error loading budget:', err);
        this.budget = null;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.selectedProgram = null;
    this.applications = [];
    this.budget = null;
  }

  openInitModal(app: ManagerApplicationDto): void {
    this.targetApp = app;
    this.initiateAmount = null;
    this.showInitModal = true;
  }

  confirmInitiate(): void {
    if (!this.initiateAmount || !this.targetApp) return;
    this.isSubmitting = true;
    const programId = this.selectedProgram.programID;
    const appId = Number(this.targetApp.applicationID);
    const amount = this.initiateAmount;
    this.service.initiateDisbursement({
      applicationID: appId,
      programID: programId,
      amount: amount
    }).subscribe({
      next: () => {
        // Reload data and close modal after refresh completes
        this.loadProgramDataAndCloseModal(programId, 'init');
      },
      error: (err) => { 
        console.error('Error initiating disbursement:', err);
        this.isSubmitting = false;
      }
    });
  }

  openProcModal(app: ManagerApplicationDto): void {
    this.targetApp = app;
    this.paymentMethod = 'BANK';
    this.showProcModal = true;
  }

  confirmPayment(): void {
    if (!this.targetApp?.disbursementID) return;
    this.isSubmitting = true;
    const programId = this.selectedProgram.programID;
    const disbId = this.targetApp.disbursementID;
    this.service.processPayment({
      disbursementID: disbId!,
      method: this.paymentMethod
    }).subscribe({
      next: () => {
        // Reload data and close modal after refresh completes
        this.loadProgramDataAndCloseModal(programId, 'proc');
      },
      error: (err) => { 
        console.error('Error processing payment:', err);
        this.isSubmitting = false;
      }
    });
  }

  private loadProgramDataAndCloseModal(programId: number, modalType: 'init' | 'proc'): void {
    // Close modal immediately to provide user feedback
    if (modalType === 'init') {
      this.showInitModal = false;
    } else {
      this.showProcModal = false;
    }
    
    // Reload program data to refresh the UI
    this.service.getApplicationsByProgram(programId).pipe(
      switchMap((apps) => {
        const approved = apps.filter(a => a.status === 'APPROVED');
        if (approved.length === 0) return of({ approved: [], disbResults: [] });

        const requests = approved.map(app =>
          this.service.getDisbursementsByApplication(app.applicationID).pipe(
            catchError(() => of([]))
          )
        );
        return forkJoin(requests).pipe(
          map(disbResults => ({ approved, disbResults }))
        );
      })
    ).subscribe({
      next: ({ approved, disbResults }: any) => {
        this.applications = approved.map((app: any, i: number) => {
          const disbs = disbResults[i] || [];
          const active = disbs.find((d: any) => {
            const s = d.status?.toUpperCase();
            return s === 'PROCESSING' || s === 'INITIATED';
          });
          const completed = disbs.filter((d: any) => d.status?.toUpperCase() === 'COMPLETED');
          const hasOnlyCompleted = !active && completed.length > 0;
          return {
            ...app,
            disbursementID: active?.disbursementID ?? (hasOnlyCompleted ? completed[completed.length - 1].disbursementID : undefined),
            disbursementAmount: active?.amount ?? undefined,
            disbursementStatus: active ? 'PROCESSING' : (hasOnlyCompleted ? 'COMPLETED' : undefined),
            payment: active?.payment ?? null,
            completedDisbursements: completed
          };
        });
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Error reloading program data:', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });

    this.service.getBudgetByProgram(programId).subscribe({
      next: (b) => { 
        this.budget = b; 
        this.cdr.detectChanges(); 
      },
      error: (err) => { 
        console.error('Error reloading budget:', err);
        this.budget = null;
        this.cdr.detectChanges();
      }
    });
  }

  get pendingCount(): number {
    return this.applications.filter(a => a.disbursementStatus !== 'COMPLETED').length;
  }

  deleteEntry(app: ManagerApplicationDto): void {
    if (!app.disbursementID) return;
    if (!confirm('Are you sure you want to delete this disbursement?')) return;
    const programId = this.selectedProgram.programID;
    this.service.deleteDisbursement(app.disbursementID).subscribe({
      next: () => this.loadProgramData(programId),
      error: (err) => console.error('Delete failed', String(err?.status ?? err?.message ?? 'Unknown error'))
    });
  }
}
