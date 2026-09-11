import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  Inletchallans: any[] = [];
  VendorChallandata: any[] = [];

  TotalAdmin: any[] = [];
  TotalCustomer: any[] = [];
  TotalVendor: any[] = [];
  TotalInletChallan: any[] = [];
  TotalVendorChallan: any[] = [];
  TotalSalesorder: any[] = [];

  Deliveredchallan: any[] = [];

  constructor(private _Rest: RestService) { }

  ngOnInit(): void {
    this.NumberofAdmin();
    this.TotalNumberfCustomer();
    this.TotalNumberfVendor();
    this.TotalNumberofchallan();
    this.TotalNumberofOutwardChallan();
    this.TotalNumberofSalesorder();
    this.Delivered();
    this.Allinletchallan();
    this.AllvendorChallan();
  }

  NumberofAdmin() {
    this._Rest.TotalNumberofAdmin().subscribe((res: any) => {
      this.TotalAdmin = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberfCustomer() {
    this._Rest.TotalNumberofcustomer().subscribe((data: any) => {
      this.TotalCustomer = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberfVendor() {
    this._Rest.TotalNumberofVendor().subscribe((data: any) => {
      this.TotalVendor = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberofchallan() {
    this._Rest.TotalNumberofinletchallan().subscribe((data: any) => {
      this.TotalInletChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberofOutwardChallan() {
    this._Rest.TotalNumberofVendorchallan().subscribe((data: any) => {
      this.TotalVendorChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberofSalesorder() {
    this._Rest.TotalNumberofSalesOrder().subscribe((data: any) => {
      this.TotalSalesorder = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  Delivered() {
    this._Rest.ChallanStatus().subscribe((data: any) => {
      this.Deliveredchallan = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  Allinletchallan() {
    this._Rest.DashboardInletchallan().subscribe((data: any) => {
      this.Inletchallans = data.data;
      console.log(data);
    }, (err: any) => {
      console.log(err);
    });
  }

  AllvendorChallan() {
    this._Rest.Dashboardvendorchallan().subscribe((data: any) => {
      this.VendorChallandata = data.data;
      console.log(data);
    }, (err: any) => {
      console.log(err)
    })
  }

}
