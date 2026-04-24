import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // Added for search input
import { ApplicationsService } from '../service/applications.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { ApplicationCard } from '../application-card/application-card';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [Sidebar, CommonModule, ApplicationCard, FormsModule], // Added FormsModule
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
  allApplications: any[] = [];   
  searchResults: any[] = [];   
  filteredApplications: any[] = []; 
  currentFilter: string = 'All';
  statusCounts = { All: 0, Submitted: 0, 'Under Review': 0, Accepted: 0, Rejected: 0 };
  
  // Search logic properties
  private searchSubject = new Subject<string>();
  searchTerm: string = '';

  constructor(
    private App: ApplicationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Initial Load of all data
    this.loadAllData();

    // 2. Setup Search Listener with Debounce
    this.searchSubject.pipe(
      debounceTime(200), // Wait 200ms after user stops typing
      distinctUntilChanged(), // Only if text changed
      switchMap(term => {
        if (!term.trim()) {
          // If search is empty, go back to local filtered list
          return of(this.allApplications); 
        }
        return this.App.searchApplications(term);
      })
    ).subscribe({
    next: (res: any) => {
    this.searchResults = res; // Save search results here
    this.applyFilters();      // Call the master filter
    this.cdr.detectChanges();
  },
      error: (err) => console.error('Search failed', err)
    });
  }
  isSearching: boolean = false;

clearSearch() {
  this.searchTerm = '';
  this.isSearching = false;
  this.searchResults = [];
  this.applyFilters(); // This will restore the full list for the current status
}

  loadAllData() {
    this.App.getApplications().subscribe({
      next: (res: any) => {
        this.allApplications = res;
        this.filteredApplications = res;
        this.calculateCounts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching applications', err)
    });
  }

onSearch(event: any) {
  const value = event.target ? event.target.value : event;
  this.searchTerm = value;
  this.isSearching = value.trim().length > 0;
  this.searchSubject.next(value);
}
filterBy(status: string) {
  this.currentFilter = status;
  this.applyFilters();
}
  private applyFilters() {
 
  let baseData = this.isSearching ? this.searchResults : this.allApplications;

  // Step 2: Apply the Status Filter on that data
  if (this.currentFilter === 'All') {
    this.filteredApplications = baseData;
  } else {
    const formattedStatus = this.currentFilter.toUpperCase().replace(' ', '_');
    this.filteredApplications = baseData.filter(app => 
      app.status === formattedStatus
    );
  }
}

  private calculateCounts() {
    this.statusCounts.All = this.allApplications.length;
    this.statusCounts.Submitted = this.allApplications.filter(a => a.status === 'SUBMITTED').length;
    this.statusCounts['Under Review'] = this.allApplications.filter(a => a.status === 'UNDER_REVIEW').length;
    this.statusCounts.Accepted = this.allApplications.filter(a => a.status === 'ACCEPTED').length;
    this.statusCounts.Rejected = this.allApplications.filter(a => a.status === 'REJECTED').length;
  }
}