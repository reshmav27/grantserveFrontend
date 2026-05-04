import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerDisbursementComponent } from './manager-disbursement.component';

describe('ManagerDisbursementComponent', () => {
  let component: ManagerDisbursementComponent;
  let fixture: ComponentFixture<ManagerDisbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDisbursementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDisbursementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
