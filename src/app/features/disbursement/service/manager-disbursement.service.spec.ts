import { TestBed } from '@angular/core/testing';
import { ManagerDisbursementService } from './manager-disbursement.service';

describe('ManagerDisbursementService', () => {
  let service: ManagerDisbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerDisbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
