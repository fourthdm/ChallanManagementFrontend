import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedvendorchallanhistoryComponent } from './deletedvendorchallanhistory.component';

describe('DeletedvendorchallanhistoryComponent', () => {
  let component: DeletedvendorchallanhistoryComponent;
  let fixture: ComponentFixture<DeletedvendorchallanhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedvendorchallanhistoryComponent]
    });
    fixture = TestBed.createComponent(DeletedvendorchallanhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
