import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InletchallandeletedhistoryComponent } from './inletchallandeletedhistory.component';

describe('InletchallandeletedhistoryComponent', () => {
  let component: InletchallandeletedhistoryComponent;
  let fixture: ComponentFixture<InletchallandeletedhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InletchallandeletedhistoryComponent]
    });
    fixture = TestBed.createComponent(InletchallandeletedhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
