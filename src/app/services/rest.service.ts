import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  // ApiUrl = 'http://localhost:3000';
  ApiUrl = 'https://ysurveillance.com/ChallanServer'; 

  constructor(private _State: StateService, private _http: HttpClient) { }

  Login(data: any) {
    return this._http.post(this.ApiUrl + '/Adminlogin', data);
  }

  Addadmin(data: any) {
    return this._http.post(this.ApiUrl + '/AddAdmin', data);
  }

  UpdateAdmin(data: any) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.put(this.ApiUrl + '/UpdateAdmin/' + data.Admin_id, data, { headers });
  }

  AllAdminData() {
    return this._http.get(this.ApiUrl + '/AllAdminData');
  }

  DeleteAdmin(Admin_id: number, Password: string) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.post(this.ApiUrl + "/DeleteAdmin/" + Admin_id, { Password }, { headers });
  }

  TotalNumberofAdmin() {
    return this._http.get(this.ApiUrl + '/NumberofAdmin');
  }

  AdminDatabyDate(data: any) {
    return this._http.post(this.ApiUrl + '/AdminDatabydate', data);
  }

  Admindatabystatus(data: any) {
    return this._http.post(this.ApiUrl + '/AdmindatabyStatus', data);
  }

  //Customer Details
  AddCustomer(data: any) {
    return this._http.post(this.ApiUrl + '/AddCustomer', data);
  }

  AllCustomer() {
    return this._http.get(this.ApiUrl + '/AllCustomerData');
  }

  TotalNumberofcustomer() {
    return this._http.get(this.ApiUrl + '/Totalnumberofcustomer');
  }

  UpdateCustomer(data: any) {
    return this._http.put(this.ApiUrl + '/UpdateCustomer/' + data.Customer_id, data);
  }

  DeleteCustomer(Customer_id: number, Password: string) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.post(this.ApiUrl + "/Deletecustomer/" + Customer_id, { Password }, { headers });
  }

  SearchCustomername(data: any) {
    return this._http.post(this.ApiUrl + '/SearchbyCustomerName', data);
  }

  SearchbyCompanyName(data: any) {
    return this._http.post(this.ApiUrl + '/SerchCustomerbyCompanyname', data);
  }

  SearchbyDate(data: any) {
    return this._http.post(this.ApiUrl + '/Searchbydate', data);
  }

  SearchbyStatus(data: any) {
    return this._http.post(this.ApiUrl + '/SearchbyStatus', data);
  }

  DatabetweenDate(data: any) {
    return this._http.post(this.ApiUrl + '/DatabetweenDate', data);
  }

  //Vendor API

  AddVendor(data: any) {
    return this._http.post(this.ApiUrl + '/AddVendor', data);
  }

  AllVendor() {
    return this._http.get(this.ApiUrl + '/Allvendorsdata');
  }

  TotalNumberofVendor() {
    return this._http.get(this.ApiUrl + '/Totalnumberofvendor');
  }

  UpdateVendor(data: any) {
    return this._http.put(this.ApiUrl + '/UpdateVendor/' + data.Vendor_id, data);
  }

  DeleteVendor(Vendor_id: number, Password: string) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.post(this.ApiUrl + "/Deletevendor/" + Vendor_id, { Password }, { headers });
  }

  SearchVendorname(data: any) {
    return this._http.post(this.ApiUrl + '/SearchbyvendorName', data);
  }

  SearchbyVendorCompanyName(data: any) {
    return this._http.post(this.ApiUrl + '/SerchvendorbyCompanyname', data);
  }

  SearchVendorbyDate(data: any) {
    return this._http.post(this.ApiUrl + '/SearchVendorbydate', data);
  }

  SearchVendorbyStatus(data: any) {
    return this._http.post(this.ApiUrl + '/SearchVendorbyStatus', data);
  }

  VendorDatabetweenDate(data: any) {
    return this._http.post(this.ApiUrl + '/VendorDatabetweenDate', data);
  }

  //InletChallan API
  AddInletchallan(data: any) {
    return this._http.post(this.ApiUrl + '/AddInletchallan', data);
  }

  AllInletChallan() {
    return this._http.get(this.ApiUrl + '/AllChallan');
  }

  TotalNumberofinletchallan() {
    return this._http.get(this.ApiUrl + '/TotalNumberofChallan');
  }

  ChallanStatus() {
    return this._http.get(this.ApiUrl + '/ChallanByDeliverystatus');
  }

  InletchallanbyId(Challan_id: any) {
    return this._http.get(this.ApiUrl + '/ChallanbyChallanid/' + Challan_id);
  }

  GetChallanPDF(Challan_id: any) {
    return this._http.get(this.ApiUrl + '/PrintInletchallan/' + Challan_id, { responseType: 'blob' });
  }

  UpdateChallan(Challan_id: number, data: any) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.put(this.ApiUrl + "/UpdateaChallan/" + Challan_id, data, { headers });
  }

  DeleteChallan(Challan_id: number, Password: string) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.post(this.ApiUrl + "/DeleteChallan/" + Challan_id, { Password }, { headers });
  }

  DatabyCompanyName(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyCompanyName', data);
  }

  DatabyCustomerName(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyCustomername', data);
  }

  challanDatabyDate(data: any) {
    return this._http.post(this.ApiUrl + '/AllChallanbyDate', data);
  }

  DatabyWorkStatus(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyWorkStatus', data);
  }

  DatabyChallanStatus(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyChallanStatus', data);
  }

  DatabyDeliveryStatus(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyDeliveryStatus', data);
  }

  GetInletHistory(Challan_id: any) {
    return this._http.get<any>(this.ApiUrl + "/GetInletHistory/" + Challan_id);
  }

  DashboardInletchallan() {
    return this._http.get(this.ApiUrl + '/LimitedChallan');
  }

  //Outwards VendorsChallan
  AddoutwardVendorchallan(data: any) {
    return this._http.post(this.ApiUrl + '/Addvendorchallan', data);
  }

  NEWAddoutwardVendorchallan(data: any) {
    return this._http.post(this.ApiUrl + '/NEWAddvendorchallan', data);
  }

  ALlvendorChallandata() {
    return this._http.get(this.ApiUrl + '/AllVendorChallan');
  }

  TotalNumberofVendorchallan() {
    return this._http.get(this.ApiUrl + '/TotalNumberofVendorChallan');
  }

  VendorchallanbyId(VendorChallan_id: any) {
    return this._http.get(this.ApiUrl + '/VendorchallanbyChallanid/' + VendorChallan_id);
  }

  GetVendorChallanPDF(VendorChallan_id: any) {
    return this._http.get(this.ApiUrl + '/PrintVendorchallan/' + VendorChallan_id, { responseType: 'blob' });
  }

  UpdateVendorChallan(VendorChallan_id: number, data: any) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.put(this.ApiUrl + "/UpdateVendorChallan/" + VendorChallan_id, data, { headers });
  }

  DeleteVendorChallan(VendorChallan_id: number, Password: string) {
    this._State.CheckToken();
    const headers = new HttpHeaders({ 'x-access-token': this._State.token });
    return this._http.post(this.ApiUrl + "/DeleteVendorChallan/" + VendorChallan_id, { Password }, { headers });
  }

  VendorChallanDatabyCompanyName(data: any) {
    return this._http.post(this.ApiUrl + '/VendorChallanbyCompanyName', data);
  }

  VendorChallanDatabyVendorName(data: any) {
    return this._http.post(this.ApiUrl + '/ChallanbyVendorname', data);
  }

  VendorChallanbyDate(data: any) {
    return this._http.post(this.ApiUrl + '/VendorChallanbyDate', data);
  }

  VendorChallanProductStatus(data: any) {
    return this._http.post(this.ApiUrl + '/VendorChallanbyProductStatus', data);
  }

  VendorchallanDatabyChallanStatus(data: any) {
    return this._http.post(this.ApiUrl + '/VEndorchallanbyChallanStatus', data);
  }

  VendorchallanDatabyDeliveryStatus(data: any) {
    return this._http.post(this.ApiUrl + '/VendorChallanbyDeliveryStatus', data);
  }

  GetVendorHistory(VendorChallan_id: any) {
    return this._http.get<any>(this.ApiUrl + "/GetVendorChallanHistory/" + VendorChallan_id);
  }

  Dashboardvendorchallan() {
    return this._http.get(this.ApiUrl + '/LimitedVendorChallan');
  }

}
