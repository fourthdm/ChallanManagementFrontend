import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallaninletComponent } from './challaninlet.component';

describe('ChallaninletComponent', () => {
  let component: ChallaninletComponent;
  let fixture: ComponentFixture<ChallaninletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallaninletComponent]
    });
    fixture = TestBed.createComponent(ChallaninletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
