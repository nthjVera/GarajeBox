import { TestBed } from '@angular/core/testing';

import { FacrturaService } from './facrtura.service';

describe('FacrturaService', () => {
  let service: FacrturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacrturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
