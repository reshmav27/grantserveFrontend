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
    if (this.programId) {
      this.router.navigate(['/programs/edit', this.programId]);
    } else {
      this.router.navigate(['/programs']);
    }
  }

  handleSubmit(): void {
  if (this.budgetForm.invalid) {
    this.budgetForm.markAllAsTouched();
    alert('Please enter a valid amount and select a payment method.');
    return;
  }

  this.isSubmitting = true;

  const budgetAmount = this.budgetForm.value.allocatedAmount;

  // Use the new publishProgram endpoint which only requires ID and budget
  this.programService.publishProgram(Number(this.programId), budgetAmount).subscribe({
    next: (response) => {
      // Logic for successful publication
      alert(`Success! The program has been published with a budget of ₹${budgetAmount.toLocaleString()}.`);
      this.isSubmitting = false;
      this.router.navigate(['/programs']);
    },
    error: (err) => {
      this.isSubmitting = false;
      
      // Handle the text-response parsing quirk (status 200 treated as error)
      if (err.status === 200) {
        alert("Program published successfully!");
        this.router.navigate(['/programs']);
      } else {
        console.error('Publication failed:', err);
        alert('Failed to publish program. Please check your inputs or server status.');
      }
    }
  });
}
}