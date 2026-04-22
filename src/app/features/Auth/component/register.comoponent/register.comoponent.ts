import { Component, inject } from '@angular/core';
import { RegisterService } from '../../../../core/services/register/register.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register.comoponent',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './register.comoponent.html',
  styleUrl: './register.comoponent.css',
})
export class RegisterComoponent {
  private fb = inject(FormBuilder);
  private authService = inject(RegisterService);
  private router = inject(Router);

  registerMessage: string = '';
  isError: boolean = false;

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onRegister() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.isError = false;
          this.registerMessage = res.message;
          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err: any) => {
          this.isError = true;
          this.registerMessage = err.error.message || 'Registration failed. Try again.';
        }
      });
    }
  }
}
