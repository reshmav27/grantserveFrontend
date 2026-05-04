import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResearcherProfile, ResearcherDocument } from '../model/researcher.model';

@Injectable({ providedIn: 'root' })
export class ResearcherService {
  // URLs based on your @RequestMapping annotations
  private profileUrl = `${environment.BASE_URL}/api/researcher`;
  private docUrl = `${environment.BASE_URL}/api/documents`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /** * 1. Fetch Researcher (GET /api/researcher/{id})
   * Matches your @GetMapping("/{id}") in ResearcherController
   */
  getProfile(id: string): Observable<ResearcherProfile> {
    return this.http.get<ResearcherProfile>(`${this.profileUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  /** * 2. Update Researcher (PUT /api/researcher/Update/{id})
   * Matches your @PutMapping("/Update/{id}") in ResearcherController
   */
  updateProfile(id: string, data: ResearcherProfile): Observable<string> {
    return this.http.put(`${this.profileUrl}/Update/${id}`, data, { 
      headers: this.getHeaders(),
      responseType: 'text' // Backend returns a plain String
    });
  }

  /** * 3. Get Document (GET /api/documents/{id})
   * Matches your @GetMapping("/{id}") in ResearcherDocumentController
   * Note: This fetches a SINGLE document by ID
   */
  getDocuments(id: number): Observable<ResearcherDocument[]> {
    // If your backend returns an Optional<ResearcherDocument>, 
    // wrap it in an array so your *ngFor doesn't crash
    return this.http.get<ResearcherDocument[]>(`${this.docUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  /** * 4. Upload Document (POST /api/documents/upload)
   * Matches your @PostMapping("/upload")
   */
  uploadDocument(doc: any): Observable<string> {
    return this.http.post(`${this.docUrl}/upload`, doc, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}