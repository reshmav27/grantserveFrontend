import { TestBed } from '@angular/core/testing';

import { ProgramDataService } from './program-data.service';

describe('ProgramDataService', () => {
  let service: ProgramDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
