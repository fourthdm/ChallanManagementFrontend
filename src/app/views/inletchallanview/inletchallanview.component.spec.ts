import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InletchallanviewComponent } from './inletchallanview.component';

describe('InletchallanviewComponent', () => {
  let component: InletchallanviewComponent;
  let fixture: ComponentFixture<InletchallanviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InletchallanviewComponent]
    });
    fixture = TestBed.createComponent(InletchallanviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
