import { TestBed } from '@angular/core/testing';

import { ShiftchangeService } from './shiftchange.service';

describe('ShiftchangeService', () => {
  let service: ShiftchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
