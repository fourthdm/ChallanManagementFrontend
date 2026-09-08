import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-inletchallandeletedhistory',
  templateUrl: './inletchallandeletedhistory.component.html',
  styleUrls: ['./inletchallandeletedhistory.component.css']
})
export class InletchallandeletedhistoryComponent {

  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];

  ngOnInit(): void {
    this.ViewDeletionHistory();
  }

  ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const Deletionchallan_id = params['Deletionchallan_id'];
      this._rest.ViewInletChallanDeletionHistory(Deletionchallan_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }

}
