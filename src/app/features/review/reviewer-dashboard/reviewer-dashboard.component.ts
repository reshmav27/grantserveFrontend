import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../service/review.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './reviewer-dashboard.component.html',
  styleUrl: './reviewer-dashboard.component.css'
})
export class ReviewerDashboard implements OnInit {
  reviews: any[] = [];
  reviewerId: number | null = null; // Changed from hardcoded 9 to null

  constructor(
    private reviewService: ReviewService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Get the ID from localStorage (stored during login)
    const storedId = localStorage.getItem('userId');
    
    if (storedId) {
      this.reviewerId = Number(storedId);
      this.getReviews();
    } else {
      // If no ID is found, send them back to login
      console.error("No user ID found in storage");
      this.router.navigate(['/login']);
    }
  }

  getReviews() {
    // Only call the service if we have a valid reviewerId
    if (this.reviewerId) {
      this.reviewService.getReviewerDashboard(this.reviewerId).subscribe({
        next: (data) => {
          this.reviews = data;
          console.log("Data received for reviewer " + this.reviewerId, data);
        },
        error: (err) => {
          console.error("Error fetching reviews", err);
        }
      });
    }
  }

  logout() {
    localStorage.clear(); 
    this.router.navigate(['/']);
  }
}