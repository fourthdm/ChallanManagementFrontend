import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsalesoderinletchallanComponent } from './newsalesoderinletchallan.component';

describe('NewsalesoderinletchallanComponent', () => {
  let component: NewsalesoderinletchallanComponent;
  let fixture: ComponentFixture<NewsalesoderinletchallanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsalesoderinletchallanComponent]
    });
    fixture = TestBed.createComponent(NewsalesoderinletchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
