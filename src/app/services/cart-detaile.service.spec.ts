import { TestBed } from '@angular/core/testing';

import { CartDetaileService } from './cart-detaile.service';

describe('CartDetaileService', () => {
  let service: CartDetaileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartDetaileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
