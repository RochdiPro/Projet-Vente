import { TestBed } from '@angular/core/testing';

import { BonEntreeImportationService } from './bon-entree-importation.service';

describe('BonEntreeImportationService', () => {
  let service: BonEntreeImportationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonEntreeImportationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
