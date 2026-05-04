export interface PaymentDto {
  paymentID: number;
  paymentMethod: string;
  paymentDate: string | null;
  paymentStatus: string;
}

export interface DisbursementDto {
  applicationID: number;
  programID: number;
  title: string;
  submittedDate: string | null;
  applicationStatus: string;
  disbursementID: number;
  disbursementAmount: number;
  disbursementDate: string | null;
  disbursementStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  payment: PaymentDto | null;
}
