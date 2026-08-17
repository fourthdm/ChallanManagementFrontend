import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardchallanviewComponent } from './outwardchallanview.component';

describe('OutwardchallanviewComponent', () => {
  let component: OutwardchallanviewComponent;
  let fixture: ComponentFixture<OutwardchallanviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutwardchallanviewComponent]
    });
    fixture = TestBed.createComponent(OutwardchallanviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
