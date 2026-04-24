import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../../../core/services/jwtService/jwt-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
   readonly userId: Number | null;
   readonly baseUrl: string;
  constructor(private Http :HttpClient, private JwtService: JwtService){
    this.userId = this.JwtService.getUserId();
    this.baseUrl = `${environment.BASE_URL}/application-service/GrantApplication/FetchGrantApplication/${this.userId}`;
  }
  getApplications(){
    return this.Http.get(`${this.baseUrl}`);
    
  }
  searchApplications(searchTerm: string) {
  let params = new HttpParams();

  // Logic: If the input is only numbers, search by ID. Otherwise, search by Title.
  if (/^\d+$/.test(searchTerm)) {
    params = params.set('id', searchTerm);
  } else {
    params = params.set('title', searchTerm);
  }

  return this.Http.get(`${environment.BASE_URL}/application-service/GrantApplication/search`, { params });
}
    
  
}
