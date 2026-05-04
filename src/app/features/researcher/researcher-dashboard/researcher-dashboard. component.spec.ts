import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearcherDashboardComponent } from './researcher-dashboard.component';

describe('ResearcherDashboardComponent', () => {
  let component: ResearcherDashboardComponent;
  let fixture: ComponentFixture<ResearcherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearcherDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResearcherDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});