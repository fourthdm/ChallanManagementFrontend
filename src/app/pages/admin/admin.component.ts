import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

import * as XLSX from 'xlsx';

declare var bootstrap: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  @Input() Added_Date: any;
  @Input() Status: any;

  AllAdmins: any[] = [];

  TotalAdmin: any[] = [];

  AddAdminForm: FormGroup;
  UpdateAdminForm: FormGroup;

  SelectedAdmin: any = null;
  pro: any;
  submitted = false;

  constructor(private _Rest: RestService, private _route: Router) {
    this.AddAdminForm = new FormGroup({
      Name: new FormControl('', [Validators.required]),
      PhoneNo: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required]),
      Username: new FormControl('', [Validators.required]),
      Role: new FormControl('', [Validators.required]),
      Address: new FormControl(''),
      Status: new FormControl('', [Validators.required])
    });

    this.UpdateAdminForm = new FormGroup({
      Admin_id: new FormControl(''),
      Name: new FormControl('', [Validators.required]),
      PhoneNo: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required]),
      Username: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Role: new FormControl('', [Validators.required]),
      Address: new FormControl('', [Validators.required]),
      Status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.AllAdmin();
    this.NumberofAdmin();
  }

  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  AddAdmin() {
    this.submitted = true;
    if (this.AddAdminForm.invalid) {
      return;
    }
    this._Rest.Addadmin(this.AddAdminForm.value).subscribe((res: any) => {
      alert(res.message);
      this.AllAdmin();
      this.AddAdminForm.reset();
      this.submitted = false;
    })
  }

  editAdmin(Admin_id: any) {
    const selectAdmin = this.AllAdmins.find(Admin => Admin.Admin_id === Admin_id)
    if (selectAdmin) {
      this.SelectedAdmin = 1;
      this.UpdateAdminForm.patchValue(selectAdmin);
    } else {
      console.log(`Admin with AdminId ${Admin_id} not found.`);
    }
  }

  // UpdateAdmin() {
  //   this._Rest.UpdateAdmin(this.UpdateAdminForm.value).subscribe((res: any) => {
  //     alert(res.message);
  //     this.AllAdmin();
  //     this.UpdateAdminForm.reset();
  //   }, (err: any) => {
  //     console.log(err);
  //   });
  // }

  UpdateAdmin() {

    if (this.UpdateAdminForm.invalid) {
      this.UpdateAdminForm.markAllAsTouched();
      return;
    }
    const body = this.UpdateAdminForm.getRawValue();
    this._Rest.UpdateAdmin(body).subscribe({
      next: (res: any) => {
        console.log('Update Response:', res);
        if (res.success) {
          alert(res.message);
          // Refresh admin list
          this.AllAdmin();
          // Close modal
          const modalElement = document.getElementById('exampleModal1');
          if (modalElement) {
            // const modal = bootstrap.Modal.getInstance(modalElement);
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.hide();
          }
        } else {
          alert(res.message || 'Admin update failed');
        }
      },

      error: (error) => {
        console.error('Update failed:', error);
        alert(error.error?.message || 'Something went wrong while updating admin');
      }
    });
  }
  // UpdateAdmin() {

  //   if (this.UpdateAdminForm.invalid) {
  //     this.UpdateAdminForm.markAllAsTouched();
  //     return;
  //   }
  //   const body = this.UpdateAdminForm.getRawValue();
  //   this._Rest.UpdateAdmin(body).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       this.AllAdmin();
  //       if (res.success) {
  //         alert(res.message);
  //         this.AllAdmin();

  //         const modalElement = document.getElementById('exampleModal1');

  //         if (modalElement) {
  //           const modal = bootstrap.Modal.getInstance(modalElement);

  //           if (modal) {
  //             modal.hide();
  //           }
  //         }
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Update failed:', error);
  //     }
  //   });
  // }

  AllAdmin() {
    this._Rest.AllAdminData().subscribe((res: any) => {
      this.AllAdmins = res.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  NumberofAdmin() {
    this._Rest.TotalNumberofAdmin().subscribe((res: any) => {
      this.TotalAdmin = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  selectedAdminId: number = 0;
  adminPassword = '';

  openDeleteModal(id: number) {
    this.selectedAdminId = id;
    const modal = new bootstrap.Modal(
      document.getElementById('deleteModal')!
    );
    modal.show();
  }

  DeleteAdmin() {
    this._Rest.DeleteAdmin(
      this.selectedAdminId,
      this.adminPassword
    ).subscribe((res: any) => {
      alert(res.message);
      if (res.success) {
        this.AllAdmin();
        this.adminPassword = '';
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('deleteModal')!
        );
        modal?.hide();
      }
    }, err => {
      console.log(err);
    });
  }

  DatabyDate() {
    this._Rest.AdminDatabyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllAdmins = data.data;
      } else {
        this.AllAdmins = []
      }
      this.Added_Date = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyStatus() {
    this._Rest.Admindatabystatus({ Status: this.Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllAdmins = data.data;
      } else {
        console.log(data);
        this.AllAdmins = []
      }
      this.Status = "";
    }, (err: any) => {
      console.log(err);
    });
  }


  exportexcel(): void {

    // STEP 4.1 – Create a new array for Excel
    const excelData = this.AllAdmins.map((w: any, index: number) => {
      return {
        'Sr No': index + 1,
        'Code': w.Code,
        'Name': w.Name,
        'PhoneNo': w.PhoneNo,
        'Email': w.Email,
        'Username': w.Username,
        'Password': w.Password,
        'Role': w.Role,
        'Address': w.Address,
        'Added_Date': w.Added_Date,
        'Updated_Date': w.Updated_Date,
        'Status': w.Status,
      };
    });

    // STEP 4.2 – Convert JSON data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // STEP 4.3 – Create workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // STEP 4.4 – Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllAdmins');

    // STEP 4.5 – Download Excel file
    XLSX.writeFile(workbook, 'AllAdmins.xlsx');

  }

}

