export interface ResearcherProfile {
  researcherID: number;
  userid: number;
  name: string;
  email: string;
  institution: string;
  department: string;
  dob: string;
  gender: string;
  status: string; // 'PENDING_PROFILE', 'ACTIVE', 'VERIFIED'
}

export interface ResearcherDocument {
  documentID: number;
  documentType: string;
  fileName: string;
  verificationStatus: string; // 'Pending', 'Verified', 'Expired'
  uploadedDate: string;
}
