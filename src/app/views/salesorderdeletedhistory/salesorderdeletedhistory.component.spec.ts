import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderdeletedhistoryComponent } from './salesorderdeletedhistory.component';

describe('SalesorderdeletedhistoryComponent', () => {
  let component: SalesorderdeletedhistoryComponent;
  let fixture: ComponentFixture<SalesorderdeletedhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesorderdeletedhistoryComponent]
    });
    fixture = TestBed.createComponent(SalesorderdeletedhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
