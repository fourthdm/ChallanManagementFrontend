import { TestBed } from '@angular/core/testing';

import { ReceiptserviceService } from './receiptservice.service';

describe('ReceiptserviceService', () => {
  let service: ReceiptserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
