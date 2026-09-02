import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-deletedvendorchallanhistory',
  templateUrl: './deletedvendorchallanhistory.component.html',
  styleUrls: ['./deletedvendorchallanhistory.component.css']
})
export class DeletedvendorchallanhistoryComponent implements OnInit {

  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];


 ngOnInit(): void {
    this.ViewDeletionHistory();
  }

    ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const DeletionHistory_id = params['DeletionHistory_id'];
      this._rest.ViewVendorChallanDeletionHistory(DeletionHistory_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }

 

}
