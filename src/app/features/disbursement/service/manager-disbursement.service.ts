import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BudgetDto, InitiateRequest, ManagerApplicationDto,
  ManagerDisbursementDto, ProcessPaymentRequest
} from '../model/manager-disbursement.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ManagerDisbursementService {
  private readonly base = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  getApplicationsByProgram(programId: number): Observable<ManagerApplicationDto[]> {
    return this.http.get<ManagerApplicationDto[]>(
      `${this.base}/application-service/GrantApplication/ProgramGrantApplications/${programId}`
    );
  }

  getDisbursementsByApplication(applicationId: number): Observable<ManagerDisbursementDto[]> {
    return this.http.get<ManagerDisbursementDto[]>(
      `${this.base}/disbursement-service/disbursements/application/${applicationId}`
    );
  }

  getBudgetByProgram(programId: number): Observable<BudgetDto> {
    return this.http.get<BudgetDto>(
      `${this.base}/budget-service/api/v1/budgets/program/${programId}`
    );
  }

  initiateDisbursement(payload: InitiateRequest): Observable<any> {
    return this.http.post(`${this.base}/disbursement-service/disbursements/initiate`, payload);
  }

  processPayment(payload: ProcessPaymentRequest): Observable<any> {
    return this.http.post(`${this.base}/disbursement-service/payments/process`, payload);
  }

  deleteDisbursement(disbursementId: number): Observable<any> {
    return this.http.delete(`${this.base}/disbursement-service/disbursements/delete/${disbursementId}`);
  }
}
