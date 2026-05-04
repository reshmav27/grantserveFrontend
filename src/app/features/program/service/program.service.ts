import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Program } from '../model/program.model';
import { JwtService } from '../../../core/services/jwtService/jwt-service';
import { environment } from '../../../../environments/environment';
import { PagedResponse } from '../model/paged-model';

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

  // Fetches active programs using @GetMapping("/active")
  getActivePrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.apiUrl}/active`);
  }

 getAllPrograms(): Observable<Program[]> {
  return this.http.get<Program[]>(`${this.apiUrl}`).pipe(
    tap((data) => {
      console.log('Programs received from API:', data);
    })
  );
}

  // Searches programs using @GetMapping("/manager/search")
  searchPrograms(
    title?: string,
    id?: number,
    status?: string,
    startDate?: string,
    endDate?: string,
    currentPage: number = 0,
    pageSize: number = 10,
    sortBy: string = 'programID',
    direction: string = 'desc'
  ): Observable<PagedResponse<any>> {

    // Build Pageable parameters
    let params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', pageSize.toString())
      .set('sort', `${sortBy},${direction}`); // Format: field,direction for Pageable

    // Apply optional filters
    if (title) {
      params = params.set('title', title);
    }

    if (id) {
      params = params.set('id', id.toString());
    }

    // Status handling
    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    // Date Filters
    if (startDate) {
      params = params.set('start', startDate);
    }

    if (endDate) {
      params = params.set('end', endDate);
    }

    return this.http.get<PagedResponse<any>>(`${this.apiUrl}/manager/search`, { params });
  }

  // Searches programs for researcher using @GetMapping("/search")
  searchProgramsForResearcher(
    title?: string,
    id?: number,
    status?: string,
    startDate?: string,
    endDate?: string,
    currentPage: number = 0,
    pageSize: number = 10,
    sortBy: string = 'programID',
    direction: string = 'desc'
  ): Observable<PagedResponse<any>> {
    let params = new HttpParams()
      .set('page', currentPage.toString())
      .set('size', pageSize.toString())
      .set('sort', `${sortBy},${direction}`);

    // Only add params if they have values
    if (title) params = params.set('title', title);
    if (status) params = params.set('status', status);
    if (startDate) params = params.set('start', startDate);
    if (endDate) params = params.set('end', endDate);

    return this.http.get<PagedResponse<any>>(`${this.apiUrl}/search`, { params });
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

  // Update program status to ACTIVE and set budget using @PatchMapping("/{id}/publish")
  publishProgram(id: number, budget: number): Observable<string> {
    return this.http.patch(`${this.apiUrl}/${id}/publish`, { budget }, {
      responseType: 'text'
    });
  }

  // Closes a program using @PatchMapping("/{id}/close")
  closeProgram(id: number): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/${id}/close`, {});
  }
}