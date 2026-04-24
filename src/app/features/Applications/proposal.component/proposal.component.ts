import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProposaService } from '../service/proposal.service';
import { Subject, takeUntil } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule, RouterModule, PdfViewerModule], // Add PdfViewerModule here
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  proposals: any[] = [];
  selectedProposal: any | null = null;
  
  // ng2-pdf-viewer accepts string URLs or Uint8Array
  pdfSrc: string | Uint8Array | null = null;
  zoom: number = 1.0; // Added zoom control logic
  
  // PDF navigation properties
  currentPage: number = 1;
  totalPages: number = 0;

  isLoading: boolean = false;
  isError: boolean = false;

  constructor(
    public route: ActivatedRoute,
    private proposalService: ProposaService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadData(id);
        }
      });
  }

  loadData(id: string): void {
    this.isLoading = true;
    this.isError = false;

    this.proposalService.getProposalByAppId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.proposals = Array.isArray(data) ? data : (data ? [data] : []);
          // Sort proposals by ID ascending (lowest ID = most recent)
          this.proposals.sort((a, b) => a.proposalID - b.proposalID);
          if (this.proposals.length > 0) {
            this.selectProposal(this.proposals[0]); // First item is now the most recent (lowest ID)
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isError = true;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectProposal(prop: any): void {
    // Clean up previous blob URL to prevent memory leaks
    if (this.pdfSrc && typeof this.pdfSrc === 'string' && this.pdfSrc.startsWith('blob:')) {
      URL.revokeObjectURL(this.pdfSrc);
    }

    this.selectedProposal = prop;
    this.isLoading = true;
    this.isError = false;
    
    // Reset page navigation
    this.currentPage = 1;
    this.totalPages = 0;

    if (prop?.fileURI) {
      // Fetch PDF as blob to avoid CORS issues
      this.http.get(prop.fileURI, {
        responseType: 'blob',
        headers: new HttpHeaders({
          // Add any necessary auth headers here if needed
          // 'Authorization': 'Bearer ' + this.authToken
        })
      }).subscribe({
        next: (blob) => {
          console.log('PDF blob received, size:', blob.size, 'type:', blob.type);

          // Convert blob to Uint8Array for better compatibility with ng2-pdf-viewer
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            this.pdfSrc = new Uint8Array(arrayBuffer);
            console.log('Converted to Uint8Array, length:', this.pdfSrc.length);
            this.isLoading = false;
            this.cdr.detectChanges();
          };
          fileReader.onerror = (error) => {
            console.error('FileReader error:', error);
            this.isError = true;
            this.isLoading = false;
            this.cdr.detectChanges();
          };
          fileReader.readAsArrayBuffer(blob);
        },
        error: (err) => {
          console.error('Failed to load PDF:', err);
          this.isError = true;
          this.isLoading = false;
          this.pdfSrc = null;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.pdfSrc = null;
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // PDF viewer event handlers
  onPdfError(error: any): void {
    console.error('PDF Viewer Error:', error);
    this.isError = true;
    this.isLoading = false;
  }

  onPdfProgress(progress: any): void {
    console.log('PDF Loading Progress:', progress);
  }

  onPdfLoadComplete(pdf: any): void {
    console.log('PDF Load Complete:', pdf);
    if (pdf && pdf.numPages) {
      this.totalPages = pdf.numPages;
      console.log('Total pages:', this.totalPages);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // Page navigation methods
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }

  // Helper methods for the viewer
  incrementZoom(amount: number): void {
    this.zoom = Math.max(0.1, Math.min(3.0, this.zoom + amount)); // Clamp between 0.1 and 3.0
  }

  reloadData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadData(id);
  }

  // Retry loading the currently selected proposal
  retryCurrentProposal(): void {
    if (this.selectedProposal) {
      this.selectProposal(this.selectedProposal);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up blob URLs to prevent memory leaks
    if (this.pdfSrc && typeof this.pdfSrc === 'string' && this.pdfSrc.startsWith('blob:')) {
      URL.revokeObjectURL(this.pdfSrc);
    }
  }
}