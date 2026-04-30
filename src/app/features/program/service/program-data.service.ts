import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramBudget, ProgramAnalytics } from '../model/program.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramDataService {
  private readonly budgetUrl = `${environment.BASE_URL}/budget-service/api/v1/budgets`;
  private readonly appUrl = `${environment.BASE_URL}/application-service/GrantApplication`;

  constructor(private http: HttpClient) { }

  // Target: BudgetController -> getAllBudgets()
  getAllBudgets(): Observable<any[]> {
    return this.http.get<any[]>(this.budgetUrl);
  }

  // Target: BudgetController -> getAllBudgets()
  getBudgetByBudgetId(id: number): Observable<any> {
    return this.http.get<any>(this.budgetUrl, { params: { id: id } });
  }

  // Target: GrantApplicationController -> getBulkAnalytics()
  // Uses @RequestParam for the list of IDs
  getBulkAnalytics(programIds: number[]): Observable<Record<string, ProgramAnalytics>> {
    return this.http.get<Record<string, ProgramAnalytics>>(`${this.appUrl}/bulk-analytics`, { params: { programIds: programIds.join(',') } });
  }
}