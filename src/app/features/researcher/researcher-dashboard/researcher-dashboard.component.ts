import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Added for navigation
import { ResearcherService } from '../service/researcher.service';
import { ResearcherProfile, ResearcherDocument } from '../model/researcher.model';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.css']
})
export class ResearcherDashboardComponent implements OnInit {
  profile!: ResearcherProfile;
  documents: ResearcherDocument[] = [];
  applicationCount: number = 0;
  isEditing = false;
  userId = localStorage.getItem('userId');

  constructor(
    private researcherService: ResearcherService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.userId) {
      this.researcherService.getProfile(this.userId).subscribe({
        next: (data) => {
          this.profile = data;
          this.loadDocs(data.researcherID);

          console.log('Profile loaded:', this.profile);
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
          // Add a redirect or an error message so the user isn't stuck
          // alert("Researcher profile not found. Please contact support.");
          // this.router.navigate(['/login']);
        }
      });
    }
  }

  loadDocs(id: number) {
    this.researcherService.getDocumentsByResearcherId(id).subscribe(docs => {
      this.documents = docs;
      this.applicationCount = docs.length;

      this.cdr.detectChanges();
      console.log('Documents:', this.documents);
    });
  }

  // Logic to check if Apply button should be enabled
  canApply(): boolean {
    return this.profile?.status?.toUpperCase() === 'VERIFIED';
  }

  onSave() {
    if (this.userId && this.profile) {
      this.researcherService.updateProfile(this.userId, this.profile).subscribe({
        next: () => {
          alert("Profile details updated! Documents will be reviewed by the Compliance Officer.");
          this.isEditing = false;
          this.loadData(); // Refresh to see updated info
        },
        error: (err) => alert("Failed to update profile: " + err.message)
      });
    }
  }

  navigateToGrants() {
    if (this.canApply()) {
      this.router.navigate(['/home/programs']);
    }
  }
}