import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Add this
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProposaService {
  constructor(private http: HttpClient) {} // lowercase 'http' is standard

  getProposalByAppId(id: number | string): Observable<any> {
  return this.http.get<any>(
    `${environment.BASE_URL}/application-service/proposal/getProposal/${id}`
  );
}
}