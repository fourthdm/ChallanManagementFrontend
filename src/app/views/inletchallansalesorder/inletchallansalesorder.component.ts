import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-inletchallansalesorder',
  templateUrl: './inletchallansalesorder.component.html',
  styleUrls: ['./inletchallansalesorder.component.css']
})
export class InletchallansalesorderComponent implements OnInit {
  Sales_Order_Number: string = '';

  AllChallans: any[] = [];

  constructor(private _activatedroute: ActivatedRoute, private _rest: RestService) { }

  ngOnInit() {

    this._activatedroute.paramMap.subscribe(params => {

      this.Sales_Order_Number =
        params.get('Sales_Order_Number') || '';

      console.log(
        'Route Sales Order Number:',
        this.Sales_Order_Number
      );

      if (this.Sales_Order_Number) {

        this.GetInletChallanBySalesOrderNumber(
          this.Sales_Order_Number
        );

      }

    });

    // this.ChallanBysaleordes();
  }

  GetInletChallanBySalesOrderNumber(
    Sales_Order_Number: string
  ): void {

    console.log(
      'Getting Inlet Challan for:',
      Sales_Order_Number
    );

    this._rest.InletchallanbySaleorderNumber(
      Sales_Order_Number
    ).subscribe({

      next: (res: any) => {

        this.AllChallans = res.data;
        console.log(
          'Inlet Challan Response:',
          res.data
        );

        if (res.success) {
          this.AllChallans = res.data;
          console.log(
            'Inlet Challan Data:',
            res.data
          );

        }

      },

      error: (err) => {

        console.error(
          'Inlet Challan API Error:',
          err
        );

      }

    });

  }
  // ChallanBysaleordes() {
  //   this._activatedroute.params.subscribe(params => {
  //     const Sales_Order_Number = params['Sales_Order_Number'];
  //     this._rest.InletchallanbySaleorderNumber(Sales_Order_Number).subscribe((data: any) => {
  //       console.log(data);
  //       this.AllChallans = Array.isArray(data.data)
  //         ? data.data : [data.data];
  //     })
  //   })
  // }
}
