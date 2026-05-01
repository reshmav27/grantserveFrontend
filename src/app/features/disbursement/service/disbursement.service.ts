import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DisbursementDto } from '../model/disbursement.model';
import { environment } from '../../../../environments/environment';
import { JwtService } from '../../../core/services/jwtService/jwt-service';

@Injectable({ providedIn: 'root' })
export class DisbursementService {
  private readonly userId: number | null;

  constructor(private http: HttpClient, private jwtService: JwtService) {
    this.userId = this.jwtService.getUserId();
  }

  getDisbursements(): Observable<DisbursementDto[]> {
    return this.http.get<DisbursementDto[]>(
      `${environment.BASE_URL}/disbursement-service/disbursements/researcher/${this.userId}`
    );
  }
}
