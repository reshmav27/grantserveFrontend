import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Added for navigation
import { ResearcherService } from '../service/researcher.service';
import { ResearcherProfile, ResearcherDocument } from '../model/researcher.model';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (this.userId) {
      this.researcherService.getProfile(this.userId).subscribe({
        next: (data) => {
          this.profile = data;
          this.loadDocs(data.researcherID);
          // Assuming count comes from a specific endpoint or derived from logic
          this.loadStats(data.researcherID);
        },
        error: (err) => console.error('Error fetching profile:', err)
      });
    }
  }

  loadDocs(id: number) {
    this.researcherService.getDocuments(id).subscribe(docs => {
      this.documents = docs;
    });
  }

  loadStats(id: number) {
    // Replace this with your actual application microservice call if available
    this.researcherService.getDocuments(id).subscribe(docs => {
        this.applicationCount = docs.length; 
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