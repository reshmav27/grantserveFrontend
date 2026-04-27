import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Program } from '../model/program.model';
import { JwtService } from '../../../core/services/jwtService/jwt-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  readonly userId: Number | null;
  readonly apiUrl: string;

  constructor(private http: HttpClient, private JwtService: JwtService) {
    this.userId = this.JwtService.getUserId();
    this.apiUrl = `${environment.BASE_URL}/program-service/api/v1/programs`;
  }

  // Fetches all programs using @GetMapping
  // getPrograms(): Observable<Program[]> {
  //   return this.http.get<Program[]>(this.apiUrl);
  // }

  // Fetches active programs using @GetMapping("/active")
  getActivePrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.apiUrl}/active`);
  }

  // Searches programs using @GetMapping("/manager/search")
  searchPrograms(
    title?: string,
    id?: number,
    statuses?: string[], // Changed from status: string to statuses: string[]
    currentPage: number = 0,
    pageSize: number = 10,
    sortBy: string = 'programID',
    direction: string = 'desc'
  ): Observable<any> { // Note: returns 'any' or 'Page<Program>' because of pagination
    let params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', pageSize.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (title) {
      params = params.set('title', title);
    }

    if (id) {
      params = params.set('id', id.toString());
    }

    // Handle multiple statuses
    if (statuses && statuses.length > 0) {
      statuses.forEach(s => {
        // .append() adds multiple values for the same key 'statuses'
        params = params.append('statuses', s);
      });
    }

    return this.http.get<any>(`${this.apiUrl}/manager/search`, { params });
  }

  // Creates a new program using @PostMapping("/createProgram")
  createProgram(program: Program): Observable<Program> {
    return this.http.post<Program>(`${this.apiUrl}/createProgram`, program);
  }

  // Updates a program using @PutMapping("/update")
  updateProgram(program: Program): Observable<string> {
    return this.http.put(`${this.apiUrl}/update`, program, {
      responseType: 'text'
    });
  }

  // Closes a program using @PatchMapping("/{id}/close")
  closeProgram(id: number): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/${id}/close`, {});
  }
}