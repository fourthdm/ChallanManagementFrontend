import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-salesorderview',
  templateUrl: './salesorderview.component.html',
  styleUrls: ['./salesorderview.component.css']
})
export class SalesorderviewComponent implements OnInit {

  AllSalesorders: any[] = [];

  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.BySalesorderId();
  }

  BySalesorderId() {
    this._activatedroute.params.subscribe(params => {
      const SalesOrder_id = params['SalesOrder_id'];
      this._rest.SalesOrderbyId(SalesOrder_id).subscribe((data: any) => {
        console.log(data);
        this.AllSalesorders = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }

}
