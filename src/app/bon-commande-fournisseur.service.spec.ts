import { TestBed } from '@angular/core/testing';

import { BonCommandeFournisseurService } from './bon-commande-fournisseur.service';

describe('BonCommandeFournisseurService', () => {
  let service: BonCommandeFournisseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonCommandeFournisseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
