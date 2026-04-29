import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  // This matches your Review Microservice URL
  private baseUrl = 'http://localhost:9091/review'; 

  constructor(private http: HttpClient) { }

  assignReview(reviewData: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/assign`, reviewData, { responseType: 'text' });
  }

  
  getReviewerDashboard(reviewerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dashboard/${reviewerId}`);
  }

  
  updateReview(reviewId: number, updateData: any): Observable<string> {
    return this.http.put(`${this.baseUrl}/update/${reviewId}`, updateData, { responseType: 'text' });
  }
}