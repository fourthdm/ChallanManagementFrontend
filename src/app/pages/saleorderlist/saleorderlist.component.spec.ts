import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleorderlistComponent } from './saleorderlist.component';

describe('SaleorderlistComponent', () => {
  let component: SaleorderlistComponent;
  let fixture: ComponentFixture<SaleorderlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleorderlistComponent]
    });
    fixture = TestBed.createComponent(SaleorderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
