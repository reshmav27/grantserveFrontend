import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() showSubHeader: boolean = true;
  @Input() isDashboard: boolean = false;
  @Input() title: string = 'All Programs';
  pageTitle: string = 'Program Manager';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}