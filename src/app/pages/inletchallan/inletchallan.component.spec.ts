import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InletchallanComponent } from './inletchallan.component';

describe('InletchallanComponent', () => {
  let component: InletchallanComponent;
  let fixture: ComponentFixture<InletchallanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InletchallanComponent]
    });
    fixture = TestBed.createComponent(InletchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
