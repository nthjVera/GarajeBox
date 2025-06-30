import { TestBed } from '@angular/core/testing';

import { MecanicosCitasService } from './mecanicos-citas.service';

describe('MecanicosCitasService', () => {
  let service: MecanicosCitasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MecanicosCitasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
