import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramService } from '../service/program.service';
import { Observable } from 'rxjs';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { Program } from '../model/program.model';

@Component({
  selector: 'app-program-form.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ManagerHeaderComponent],
  templateUrl: './program-form.component.html',
  styleUrl: './program-form.component.css',
})
export class ProgramFormComponent implements OnInit {
  programForm!: FormGroup;
  isEditMode = false;
  programId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private programService: ProgramService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.programId = this.route.snapshot.paramMap.get('id');
    if (this.programId) {
      this.isEditMode = true;
      this.loadProgramData(this.programId);
    }
  }

  private initForm(): void {
    this.programForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: FormGroup): any {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && new Date(start) > new Date(end) ? { invalidDate: true } : null;
  }

  private loadProgramData(id: string): void {
  // 1. Ensure the observable is typed as a Page/any or array based on your latest service
  this.programService.searchPrograms(undefined, Number(id)).subscribe((response: any) => {
    
    // 2. Access the content array (since your backend now returns a Page object)
    const programs: Program[] = response.content || [];

    // 3. Explicitly type 'p' as Program to resolve the error
    const prog = programs.find((p: Program) => String(p.programID) === String(id));
    
    if (prog) {
      this.programForm.patchValue({
        title: prog.title,
        description: prog.description,
        startDate: prog.startDate,
        endDate: prog.endDate
      });
    } else {
      console.warn(`No program found with ID: ${id}`);
    }
  });
}

  cancel(): void {
    if (!this.isSubmitting) {
      this.location.back();
    }
  }

  /**
   * Handles saving the program to the database.
   * @param status The status to persist ('DRAFT' or 'ACTIVE')
   */
  handleSave(status: 'DRAFT' | 'ACTIVE'): void {
    if (this.programForm.invalid) {
      alert("Please fill in all required fields.");
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.programForm.value,
      status: 'DRAFT',
      programID: this.programId || undefined,
      budget: 0
    };

    const request: Observable<any> = this.isEditMode 
      ? this.programService.updateProgram(payload) 
      : this.programService.createProgram(payload);

    request.subscribe({
      next: (response) => {
        alert(`${status} saved successfully!`);
        
        if (status === 'ACTIVE') {
          // Redirect to budget page with the program ID
          const idToPass = this.isEditMode ? this.programId : (response as any).programID;
          this.router.navigate(['/add-budget'], { queryParams: { id: idToPass } });
          this.isSubmitting = false;
        } else {
          // Go back to the dashboard
          this.router.navigate(['/programs']);
        }
      },
      error: (err: any) => {
        console.error('Save failed:', err);
        alert('An error occurred while saving.');
        this.isSubmitting = false;
      }
    });
  }
}