import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  liked: boolean = false;
  Loginform: FormGroup;

  constructor(private _rest: RestService, private _router: Router, private _state: StateService) {
    this.Loginform = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // Initialization logic here
  }

  Show() {
    this.liked = !this.liked;
  }
  
  login() {      
    this._rest.Login(this.Loginform.value).subscribe((data: any) => {
      console.log(data);
      localStorage.setItem('token', data.data);
      this._state.token = (data.data);
      this._state.decodedToken();
      this._router.navigate(['/Home']);
    }, (err: any) => {
      console.log(err);
    })
  }

}
