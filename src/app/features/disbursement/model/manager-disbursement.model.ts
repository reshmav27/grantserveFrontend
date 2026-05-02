export interface ManagerPaymentDto {
  paymentID: number;
  method: string;
  date: string | null;
  status: string;
}

export interface ManagerDisbursementDto {
  disbursementID: number;
  applicationID: number;
  amount: number;
  date: string | null;
  status: string;
  payment: ManagerPaymentDto | null;
}

export interface ManagerApplicationDto {
  applicationID: number;
  researcherId: number;
  programId: number;
  title: string;
  submittedDate: string;
  status: string;
  disbursementID?: number;
  disbursementAmount?: number;
  disbursementStatus?: string;
  payment?: ManagerPaymentDto | null;
  completedDisbursements?: ManagerDisbursementDto[];
}

export interface BudgetDto {
  budgetId: number;
  programId: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface InitiateRequest {
  applicationID: number;
  programID: number;
  amount: number;
}

export interface ProcessPaymentRequest {
  disbursementID: number;
  method: string;
}
