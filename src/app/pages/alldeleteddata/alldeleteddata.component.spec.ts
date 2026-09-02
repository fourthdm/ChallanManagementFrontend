import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldeleteddataComponent } from './alldeleteddata.component';

describe('AlldeleteddataComponent', () => {
  let component: AlldeleteddataComponent;
  let fixture: ComponentFixture<AlldeleteddataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlldeleteddataComponent]
    });
    fixture = TestBed.createComponent(AlldeleteddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
