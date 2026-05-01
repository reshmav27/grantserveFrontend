import { TestBed } from '@angular/core/testing';

import { DisbursementService } from './disbursement.service';

describe('DisbursementService', () => {
  let service: DisbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
