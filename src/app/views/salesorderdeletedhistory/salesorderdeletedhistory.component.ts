import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-salesorderdeletedhistory',
  templateUrl: './salesorderdeletedhistory.component.html',
  styleUrls: ['./salesorderdeletedhistory.component.css']
})
export class SalesorderdeletedhistoryComponent {

  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];

  ngOnInit(): void {
    this.ViewDeletionHistory();
  }

  ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const SalesorderDeleted_id = params['SalesorderDeleted_id'];
      this._rest.ViewSalesOrderDeletionHistory(SalesorderDeleted_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }
}
