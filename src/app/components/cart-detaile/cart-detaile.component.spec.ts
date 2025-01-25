import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDetaileComponent } from './cart-detaile.component';

describe('CartDetaileComponent', () => {
  let component: CartDetaileComponent;
  let fixture: ComponentFixture<CartDetaileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartDetaileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartDetaileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
