import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserResponseDto } from '../../model/login.model';
import { LoginService } from '../../services/login.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  loginData = { email: '', password: '' };

  isPasswordVisible: boolean = false;

  constructor(
    private LoginService: LoginService, 
  ) {}


 onLogin() {
    this.LoginService.login(this.loginData).subscribe({
    next: (response: UserResponseDto) => {
      if (response.statusCode === 200) {
        // 1. Store the token and role securely
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.role);
        console.log(response.message);
        // 2. Navigate based on role
        // if (response.role === 'MANAGER') {
        //   this.router.navigate(['/manager-dashboard']);
        // } else {
        //   this.router.navigate(['/home']);
        // }
      }
    },
    error: (err) => {
      // Handle 401 or 500 errors from Spring Boot
      console.error('Login failed', err);
      alert('Login Failed: ' + (err.error?.message || 'Server Error'));
    }
  });
}
}
