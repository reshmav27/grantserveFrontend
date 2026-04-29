import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerHeaderComponent } from '../../../shared/components/navigation/manager-header.component/manager-header.component';
import { ProgramService } from '../service/program.service';
import { Program } from '../model/program.model';

@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ManagerHeaderComponent],
  templateUrl: './add-budget.component.html'
})
export class AddBudgetComponent implements OnInit {
  budgetForm!: FormGroup;
  programId: string | null = null;
  isSubmitting: boolean = false;

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
    // Retrieve the program ID passed as a query parameter
    this.programId = this.route.snapshot.queryParamMap.get('id');
    if (!this.programId) {
      console.warn('No Program ID found for budget configuration.');
    }
  }

  private initForm(): void {
    this.budgetForm = this.fb.group({
      allocatedAmount: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required]
    });
  }

  handlePaymentSelection(method: string): void {
    const methods: { [key: string]: string } = {
      'bank': 'Direct Bank Transfer',
      'credit': 'Credit Card',
      'wire': 'International Wire',
      'internal': 'Internal Ledger'
    };
    if (method) {
      alert(`Note: The "${methods[method]}" integration is currently in a simulated state.`);
    }
  }

  cancel(): void {
    this.location.back();
  }

  handleSubmit(): void {
    // if (this.budgetForm.invalid) {
    //   alert('Please enter a valid amount and select a payment method.');
    //   return;
    // }

    // this.isSubmitting = true;

    // // 1. First, we need the existing program data to perform a full update
    // // because the update API usually expects the full object
    // this.programService.searchPrograms(undefined, Number(this.programId)).subscribe({
    //   next: (program) => {
    //     // const existingProg = programs.find((p: Program) => String(p.programID) === String(this.programId));
    //     const existingProg = program;
    //     console.log('Fetched program for update:', existingProg);

    //     if (!existingProg) {
    //       alert("Program not found. Cannot update budget.");
    //       this.isSubmitting = false;
    //       return;
    //     }

    //     // 2. Prepare the payload with the new budget and ACTIVE status
    //     const updatedPayload: Program = {
    //       ...existingProg,
    //       budget: this.budgetForm.value.allocatedAmount,
    //       status: 'ACTIVE'
    //     };

    //     // 3. Call the update service
    //     this.programService.updateProgram(updatedPayload).subscribe({
    //       next: (response) => {
    //         alert(`Success! Program "${existingProg.title}" has been published with a budget of ₹${updatedPayload.budget?.toLocaleString()}.`);
    //         this.router.navigate(['/programs']);
    //       },
    //       error: (err) => {
    //         // Handle the text-response parsing issue gracefully
    //         if (err.status === 200) {
    //           alert("Program published successfully!");
    //           this.router.navigate(['/programs']);
    //           this.isSubmitting = false;
    //         } else {
    //           console.error('Update failed:', err);
    //           alert('Failed to publish program. Please try again.');
    //           this.isSubmitting = false;
    //         }
    //       }
    //     });
    //   },
    //   error: (err) => {
    //     console.error('Fetch failed:', err);
    //     this.isSubmitting = false;
    //   }
    // });
  }
}