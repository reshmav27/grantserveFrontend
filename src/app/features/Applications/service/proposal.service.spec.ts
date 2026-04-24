import { TestBed } from '@angular/core/testing';

import { ProposaService } from './proposa.service';

describe('ProposaService', () => {
  let service: ProposaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
