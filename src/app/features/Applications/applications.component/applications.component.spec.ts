import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsComponent } from './applications.component';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
