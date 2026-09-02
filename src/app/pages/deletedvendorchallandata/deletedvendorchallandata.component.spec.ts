import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedvendorchallandataComponent } from './deletedvendorchallandata.component';

describe('DeletedvendorchallandataComponent', () => {
  let component: DeletedvendorchallandataComponent;
  let fixture: ComponentFixture<DeletedvendorchallandataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedvendorchallandataComponent]
    });
    fixture = TestBed.createComponent(DeletedvendorchallandataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
