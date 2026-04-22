import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from '../../../features/Auth/model/register.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) { }
  registerUser(userData: any) : Observable<String>{
    const registerUrl = `${environment.BASE_URL}/auth-service/auth/register`;
    return this.http.post<String>(registerUrl, userData);
  }
}
