import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponseDto } from '../../features/Auth/model/login.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authUrl = `${environment.BASE_URL}/auth-service/auth/login`; 

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(this.authUrl, credentials);
  }
}

