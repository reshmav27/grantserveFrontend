import { Component, Input } from '@angular/core';
import { ApplicationCardDto } from '../model/applicationCardDto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-card',
  imports: [CommonModule],
  templateUrl: './application-card.html',
  styleUrl: './application-card.css',
})
export class ApplicationCard {
  constructor(private router: Router) {}
  @Input() data!: ApplicationCardDto
  get formattedId(): string {
    return `APP-${this.data.applicationID.toString().padStart(3, '0')}`;
  }
  onViewDetails() {
  this.router.navigate(['/proposals', this.data.applicationID]);
}
}
