import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BasicUserProfileData } from '../model/UserProfileData';



@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<BasicUserProfileData> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('No User ID found in storage');
    }
    const authUrl = `${environment.BASE_URL}/researcher-service/api/researcher/${userId}`;
    return this.http.get<BasicUserProfileData>(authUrl);
  }
}
