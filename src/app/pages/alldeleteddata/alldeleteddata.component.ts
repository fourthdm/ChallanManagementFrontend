import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-alldeleteddata',
  templateUrl: './alldeleteddata.component.html',
  styleUrls: ['./alldeleteddata.component.css']
})
export class AlldeleteddataComponent {
  constructor(private _rest: RestService) { }
  AllDeletionHistory: any[] = [];
  AllInletDeletionHistory: any[] = [];
  AllVendorDeletionHistory: any[] = [];
  AllCustomerDeletionHistory: any[] = [];
  AllAdminDeletionHistory: any[] = [];

  ngOnInit(): void {
    this.GetDeletionHistory();
    this.GetInletDeletionHistory();
    this.GetVendorDeletionHistory();
    this.GetCustomerDeletionhistory();
    this.GetAdminDeletionhistory();
  }

  GetDeletionHistory() {
    this._rest.VendorChallanDeletionHistory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllDeletionHistory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  GetInletDeletionHistory() {
    this._rest.InletChallanDeletionHistory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllInletDeletionHistory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  GetVendorDeletionHistory() {
    this._rest.VendorDeletionHistory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllVendorDeletionHistory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  GetCustomerDeletionhistory() {
    this._rest.CustomerDeletionHistory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllCustomerDeletionHistory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  GetAdminDeletionhistory() {
    this._rest.AdminDeletionHistory().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllAdminDeletionHistory = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
