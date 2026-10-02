import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InletchallansalesorderComponent } from './inletchallansalesorder.component';

describe('InletchallansalesorderComponent', () => {
  let component: InletchallansalesorderComponent;
  let fixture: ComponentFixture<InletchallansalesorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InletchallansalesorderComponent]
    });
    fixture = TestBed.createComponent(InletchallansalesorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
