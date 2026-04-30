export interface Program {
  programID: string;
  budgetID: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'FORECASTED' | 'DRAFT' | 'CLOSED';
  budget: number;
}

export interface ProgramBudget {
  programID: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
}

export interface ProgramAnalytics {
  programID: string;
  totalApplications: number;
  approvedApplications: number;
  acceptanceRate: number;
  monthlyStats: {
    labels: string[];
    accepted: number[];
    rejected: number[];
    pending: number[];
  };
}

export type ProgramViewStatus = 'ACTIVE' | 'FORECASTED';