import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementCard } from './disbursement-card';

describe('DisbursementCard', () => {
  let component: DisbursementCard;
  let fixture: ComponentFixture<DisbursementCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisbursementCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DisbursementCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
