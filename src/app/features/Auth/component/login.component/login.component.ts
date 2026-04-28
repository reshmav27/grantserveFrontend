import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserResponseDto } from '../../model/login.model';
import { LoginService } from '../../../../core/services/login/login.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  loginData = { email: '', password: '' };
  isPasswordVisible: boolean = false;
  constructor(
    private LoginService: LoginService,
    private router: Router
  ) { }

  onLogin() {
    this.LoginService.login(this.loginData).subscribe({
      next: (response: UserResponseDto) => {
        if (response.statusCode === 200) {
          // 1. Store the token and role securely
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', response.role);
          console.log(response.message);
          // if (response.role === 'MANAGER') {
            // Redirect to manager dashboard
            // this.router.navigate(['/programs']);
          // }
          // this.router.navigate(['/home']);

          this.redirectBasedOnRole(response.role);

        }
      },
      error: (err) => {
        // Handle 401 or 500 errors from Spring Boot
        console.error('Login failed', err);
        alert('Login Failed: ' + (err.error?.message || 'Server Error'));
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'MANAGER':
        this.router.navigate(['/programs']);
        break;
      case 'RESEARCHER':
        this.router.navigate(['/home']); 
        break;
      case 'REVIEWER':
        this.router.navigate(['/applications/review-list']);
        break;
      case 'COMPLIANCE':
      case 'AUDITOR':
        this.router.navigate(['/reports']); // Analytics/Compliance view
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

}
