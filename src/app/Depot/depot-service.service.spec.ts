import { TestBed } from '@angular/core/testing';

import { DepotServiceService } from './depot-service.service';

describe('DepotServiceService', () => {
  let service: DepotServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
