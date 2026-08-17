import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './common/navbar/navbar.component';
import { LoginComponent } from './common/login/login.component';
import { FooterComponent } from './common/footer/footer.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { ChallanComponent } from './pages/challan/challan.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { InletchallanComponent } from './pages/inletchallan/inletchallan.component';
import { OutwardchallanComponent } from './pages/outwardchallan/outwardchallan.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { InletchallanviewComponent } from './views/inletchallanview/inletchallanview.component';
import { OutwardchallanviewComponent } from './views/outwardchallanview/outwardchallanview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    FooterComponent,
    AdminComponent,
    CustomerComponent,
    ChallanComponent,
    DashboardComponent,
    HomeComponent,
    InletchallanComponent,
    OutwardchallanComponent,
    VendorComponent,
    InletchallanviewComponent,
    OutwardchallanviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
