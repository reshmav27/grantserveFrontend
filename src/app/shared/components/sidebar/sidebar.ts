import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
  

export class Sidebar {
 
    constructor(private router: Router) {}

    logout() {
    localStorage.removeItem('token'); // Clears the "drawer"
    this.router.navigate(['/']); // Sends them away
  }
}
