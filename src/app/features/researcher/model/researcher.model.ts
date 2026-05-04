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
  researcherID: number;
  docType: string;       // Changed from documentType
  fileURI: string;       // Changed from fileName or fileURL
  uploadedDate: string;  // Added to match your JSON
  verificationStatus: string;
}