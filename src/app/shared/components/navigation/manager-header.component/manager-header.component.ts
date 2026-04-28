import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.css',
})
export class ManagerHeaderComponent {
  @Input() showSubHeader: boolean = true;
  @Input() isDashboard: boolean = false;
  @Input() title: string = 'All Programs';
  pageTitle: string = 'Program Manager';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}