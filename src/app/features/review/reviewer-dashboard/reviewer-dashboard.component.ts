import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../service/review.service';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './reviewer-dashboard.component.html',
  styleUrl: './reviewer-dashboard.component.css'
})
export class ReviewerDashboard implements OnInit {
  reviews: any[] = [];
  reviewerId: number = 2; // Hardcoded to 2 to match your 'reviewdb' for now

  constructor(
    private reviewService: ReviewService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews() {
    this.reviewService.getReviewerDashboard(this.reviewerId).subscribe({
      next: (data) => {
        this.reviews = data;
        console.log("Data received from backend:", data);
      },
      error: (err) => {
        console.error("Error fetching reviews", err);
      }
    });
  }


  logout() {
    localStorage.clear(); 
    this.router.navigate(['/']);
  }
}