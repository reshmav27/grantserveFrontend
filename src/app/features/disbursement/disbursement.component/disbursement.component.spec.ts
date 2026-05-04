import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementComponent } from './disbursement.component';

describe('DisbursementComponent', () => {
  let component: DisbursementComponent;
  let fixture: ComponentFixture<DisbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisbursementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisbursementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
