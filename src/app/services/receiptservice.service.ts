import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptserviceService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getPendingProducts(challanId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/GetVendorChallanPending/${challanId}`
    );
  }

  createReceipt(challanId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/CreateVendorChallanReceipt/${challanId}`,
      data
    );
  }

  getReceiptHistory(challanId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/GetVendorChallanReceipt/${challanId}`
    );
  }

  getAllVendorChallans(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/GetVendorChallanReceipts`
    );
  }
}
