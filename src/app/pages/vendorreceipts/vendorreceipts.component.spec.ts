import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorreceiptsComponent } from './vendorreceipts.component';

describe('VendorreceiptsComponent', () => {
  let component: VendorreceiptsComponent;
  let fixture: ComponentFixture<VendorreceiptsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorreceiptsComponent]
    });
    fixture = TestBed.createComponent(VendorreceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
