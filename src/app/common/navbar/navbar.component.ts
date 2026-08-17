import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {

  Employeedata: any;

  constructor(private _Route:Router){}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.Employeedata = jwtDecode(token);
    }

  }

  Logout(){
    localStorage.removeItem('token');
    this._Route.navigate(['/login']);
  }

}
