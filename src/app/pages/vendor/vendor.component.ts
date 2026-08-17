import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent  {

  @Input() Vendor_Status: any;
  @Input() Vendor_CompanyName: any;
  @Input() Vendor_Name: any;
  @Input() Added_Date: any;

  AllVendor: any[] = [];
  TotalVendor: any[] = [];

  AddVendorForm: FormGroup;
  UpdateVendorForm: FormGroup;

  SelectedVendor: any = null;
  pro: any;

  liked: boolean = false;
  Show() {
    this.liked = !this.liked;
  }

  constructor(private _Rest: RestService,) {
    this.AddVendorForm = new FormGroup({
      Vendor_Name: new FormControl('', [Validators.required]),
      Vendor_CompanyName: new FormControl('', [Validators.required]),
      VendorGST_No: new FormControl('', [Validators.required]),
      Vendor_Phoneno: new FormControl('', [Validators.required]),
      Vendor_Email: new FormControl('', [Validators.required]),
      Vendor_CompanyAddress: new FormControl('', [Validators.required]),
      Vendor_Status: new FormControl('', [Validators.required])
    });

    this.UpdateVendorForm = new FormGroup({
      Vendor_id: new FormControl(''),
      Vendor_Name: new FormControl('', [Validators.required]),
      Vendor_CompanyName: new FormControl('', [Validators.required]),
      VendorGST_No: new FormControl('', [Validators.required]),
      Vendor_Phoneno: new FormControl('', [Validators.required]),
      Vendor_Email: new FormControl('', [Validators.required]),
      Vendor_CompanyAddress: new FormControl('', [Validators.required]),
      Vendor_Status: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.Vendors();
  }

  submitted = false;

  AddVendor() {
    this.submitted = true;
    if (this.AddVendorForm.invalid) {
      alert('Fill all required fields');
      return
    }

    this._Rest.AddVendor(this.AddVendorForm.value).subscribe((res: any) => {
      alert(res.message);
      this.AllVendor;
      this.Vendors();
      this.AddVendorForm.reset();
      this.submitted = false;
    });
  }

  Vendors() {
    this._Rest.AllVendor().subscribe((res: any) => {
      this.AllVendor = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  selectedVendorId = 0;
  adminPassword = '';

  openDeleteModal(id: number) {
    this.selectedVendorId = id;
  }

  DeleteVendor() {
    this._Rest.DeleteVendor(
      this.selectedVendorId,
      this.adminPassword
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          this.Vendors();
          this.adminPassword = '';
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  editVendor(Vendor_id: any) {
    const selectVendor = this.AllVendor.find(vendor => vendor.Vendor_id === Vendor_id)
    if (selectVendor) {
      this.SelectedVendor = 1;
      this.UpdateVendorForm.patchValue(selectVendor);
    } else {
      console.log(`Vendor with VendorId ${Vendor_id} not found.`);
    }
  }

  UpdateVendor() {
    this._Rest.UpdateVendor(this.UpdateVendorForm.value).subscribe((res: any) => {
      alert(res.message);
      this.Vendors();
      this.UpdateVendorForm.reset();
    }, (err: any) => {
      console.log(err);
    });
  }

  SearchdatabyvendorName() {
    this._Rest.SearchVendorname({ Vendor_Name: this.Vendor_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendor = data.data;
      } else {
        this.AllVendor = [];
      }
      this.Vendor_Name = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  searchbycomapnyname() {
    this._Rest.SearchbyVendorCompanyName({ Vendor_CompanyName: this.Vendor_CompanyName }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendor = data.data;
      } else {
       this.AllVendor = [];
      }
      this.Vendor_CompanyName = "";
    }, (err: any) => {
      console.log(err);
    })
  }

  Searchbystatus() {
    this._Rest.SearchVendorbyStatus({ Vendor_Status: this.Vendor_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendor = data.data;
      } else {
           this.AllVendor = [];
      }
      this.Vendor_Status = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  Searchbydate() {
    this._Rest.SearchVendorbyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendor = data.data;
      } else {
           this.AllVendor = [];
      }
      this.Added_Date = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  exportexcel(): void {

    // STEP 4.1 – Create a new array for Excel
    const excelData = this.AllVendor.map((w: any, index: number) => {
      return {
        'Sr No': index + 1,
        'Vendor_Code': w.Vendor_Code,
        'Vendor_Name': w.Vendor_Name,
        'Vendor_CompanyName': w.Vendor_CompanyName,
        'VendorGST_No': w.VendorGST_No,
        'Vendor_Phoneno': w.Vendor_Phoneno,
        'Vendor_Email': w.Vendor_Email,
        'Vendor_CompanyAddress': w.Vendor_CompanyAddress,
        'Added_Date': w.Added_Date,
        'Updated_Date': w.Updated_Date,
        'Vendor_Status': w.Vendor_Status
      };
    });

    // STEP 4.2 – Convert JSON data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // STEP 4.3 – Create workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // STEP 4.4 – Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllVendor');

    // STEP 4.5 – Download Excel file
    XLSX.writeFile(workbook, 'AllVendor.xlsx');

  }

}
