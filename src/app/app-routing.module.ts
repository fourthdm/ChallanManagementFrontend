import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { ChallanComponent } from './pages/challan/challan.component';
import { InletchallanComponent } from './pages/inletchallan/inletchallan.component';
import { InletchallanviewComponent } from './views/inletchallanview/inletchallanview.component';
import { OutwardchallanviewComponent } from './views/outwardchallanview/outwardchallanview.component';
import { OutwardchallanComponent } from './pages/outwardchallan/outwardchallan.component';
import { AlldeleteddataComponent } from './pages/alldeleteddata/alldeleteddata.component';

const routes: Routes = [
  { path: ' ', redirectTo: 'login', pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  {
    path: 'Home', component: HomeComponent, children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Admin', component: AdminComponent, title: 'Admin pages' },
      { path: 'Customer', component: CustomerComponent },
      { path: 'Vendor', component: VendorComponent },
      { path: 'Challan', component: ChallanComponent },
      { path: 'Inletchallan', component: InletchallanComponent },
      { path: 'InletchallanData/:Challan_id', component: InletchallanviewComponent },
      { path: 'OutwardChallan', component: OutwardchallanComponent },
      { path: 'OutwardChallanData/:VendorChallan_id', component: OutwardchallanviewComponent },
      { path: 'Deleteddata', component:AlldeleteddataComponent},
      { path: 'DeletedOutwardChallanHistory/:DeletionHistory_id', component: OutwardchallanviewComponent },
      { path: '**', redirectTo: 'Dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
