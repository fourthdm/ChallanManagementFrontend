import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanComponent } from './challan.component';

describe('ChallanComponent', () => {
  let component: ChallanComponent;
  let fixture: ComponentFixture<ChallanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallanComponent]
    });
    fixture = TestBed.createComponent(ChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
