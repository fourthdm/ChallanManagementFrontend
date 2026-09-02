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

  ngOnInit(): void {

    this.GetDeletionHistory();

  }

  GetDeletionHistory() {

    this._rest.VendorChallanDeletionHistory()
      .subscribe({

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
}
