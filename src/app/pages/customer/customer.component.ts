import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import * as XLSX from 'xlsx';
declare var bootstrap: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {

  @Input() Customer_Status: any;
  @Input() Company_Name: any;
  @Input() Customer_Name: any;
  @Input() Added_Date: any;

  AllCustomers: any[] = [];
  TotalCustomer: any[] = [];

  AddCustomerForm: FormGroup;
  UpdateCustomerForm: FormGroup;

  SelectedCustomer: any = null;

  pro: any;

  constructor(private _Rest: RestService) {
    this.AddCustomerForm = new FormGroup({
      Customer_Name: new FormControl('', [Validators.required]),
      Company_Name: new FormControl('', [Validators.required]),
      Company_Address: new FormControl('', [Validators.required]),
      Delivery_Address: new FormControl(''),
      GST_No: new FormControl('', [Validators.required]),
      Customer_PhoneNo: new FormControl('', [Validators.required]),
      Customer_Email: new FormControl('', [Validators.required]),
      Customer_Status: new FormControl('', [Validators.required])
    });

    this.UpdateCustomerForm = new FormGroup({
      Customer_id: new FormControl(''),
      Customer_Name: new FormControl('', [Validators.required]),
      Company_Name: new FormControl('', [Validators.required]),
      Company_Address: new FormControl('', [Validators.required]),
      Delivery_Address: new FormControl(''),
      GST_No: new FormControl('', [Validators.required]),
      Customer_PhoneNo: new FormControl('', [Validators.required]),
      Customer_Email: new FormControl('', [Validators.required]),
      Customer_Status: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.Allcustomer();
    this.TotalNumberfCustomer();
  }

  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  submitted = false;

  AddCustomer() {
    this.submitted = true;
    if (this.AddCustomerForm.invalid) {
      alert('Fill all required fields');
      return;
    }
    this._Rest.AddCustomer(this.AddCustomerForm.value).subscribe((res: any) => {
      alert(res.message);
      this.Allcustomer();
      this.AddCustomerForm.reset();
      this.submitted = false;
    });
  }

  Allcustomer() {
    this._Rest.AllCustomer().subscribe((res: any) => {
      this.AllCustomers = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  TotalNumberfCustomer() {
    this._Rest.TotalNumberofcustomer().subscribe((data: any) => {
      this.TotalCustomer = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  selectedCutomerId: number = 0;

  adminPassword: string = '';

  deletionReason: string = '';


  openDeleteModal(id: number) {
    this.selectedCutomerId = id;
  }

  DeleteCustomer() {
    if (!this.adminPassword ||
      this.adminPassword.trim() === '') {
      alert('Please enter Admin Password');
      return;
    }
    if (!this.deletionReason ||
      this.deletionReason.trim() === '') {
      alert('Please enter deletion reason');
      return;
    }
    if (this.deletionReason.trim().length < 5) {
      alert('Please enter a valid deletion reason');
      return;
    }
    this._Rest.DeleteCustomer(
      this.selectedCutomerId,
      this.adminPassword,
      this.deletionReason.trim()
    )
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          if (res.success) {
            this.adminPassword = '';
            this.deletionReason = '';
            this.selectedCutomerId = 0;
            this.Allcustomer();
          }
        },
        error: (err) => {
          console.log(err);
          alert(
            err.error?.message ||
            'Something went wrong'
          );
        }
      });
  }

  // selectedCustomerId = 0;
  // adminPassword = '';

  // openDeleteModal(id: number) {
  //   this.selectedCustomerId = id;
  // }

  // DeleteCustomer() {
  //   this._Rest.DeleteCustomer(
  //     this.selectedCustomerId,
  //     this.adminPassword
  //   ).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       if (res.success) {
  //         this.Allcustomer();
  //         this.adminPassword = '';
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

  editCustomer(Customer_id: any) {
    const selectCustomer = this.AllCustomers.find(customer => customer.Customer_id === Customer_id)
    if (selectCustomer) {
      this.SelectedCustomer = 1;
      this.UpdateCustomerForm.patchValue(selectCustomer);
    } else {
      console.log(`Customer with CustomerId ${Customer_id} not found.`);
    }
  }

  UpdateCustomer() {
    this._Rest.UpdateCustomer(this.UpdateCustomerForm.value).subscribe((res: any) => {
      alert(res.message);
      this.Allcustomer();
      this.UpdateCustomerForm.reset();
    }, (err: any) => {
      console.log(err);
    });
  }

  SearchdatabyCustomerName() {
    this._Rest.SearchCustomername({ Customer_Name: this.Customer_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllCustomers = data.data;
      } else {
        this.AllCustomers = [];
      }
      this.Customer_Name = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  searchbycomapnyname() {
    this._Rest.SearchbyCompanyName({ Company_Name: this.Company_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllCustomers = data.data;
      } else {
        this.AllCustomers = [];
      }
      this.Company_Name = "";
    }, (err: any) => {
      console.log(err);
    })
  }

  Searchbystatus() {
    this._Rest.SearchbyStatus({ Customer_Status: this.Customer_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllCustomers = data.data;
      } else {
        this.AllCustomers = [];
      }
      this.Customer_Status = "";
    }, (err: any) => {
      console.log(err);
    });
  }

  Searchbydate() {
    this._Rest.SearchbyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllCustomers = data.data;
      } else {
        this.AllCustomers = [];
      }
      this.Added_Date = "";
    }, (err: any) => {
      console.log(err);
    });
  }


  exportexcel(): void {

    // STEP 4.1 – Create a new array for Excel
    const excelData = this.AllCustomers.map((w: any, index: number) => {
      return {
        'Sr No': index + 1,
        'Customer_id': w.Customer_id,
        'Customer_Code': w.Customer_Code,
        'Customer_Name': w.Customer_Name,
        'Company_Name': w.Company_Name,
        'Company_Address': w.Company_Address,
        'Delivery_Address': w.Delivery_Address,
        'GST_No': w.GST_No,
        'Customer_PhoneNo': w.Customer_PhoneNo,
        'Customer_Email': w.Customer_Email,
        'Customer_Status': w.Customer_Status,
        'Added_Date': w.Added_Date,
        'Updated_Date': w.Updated_Date
      };
    });

    // STEP 4.2 – Convert JSON data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // STEP 4.3 – Create workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // STEP 4.4 – Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllCustomers');

    // STEP 4.5 – Download Excel file
    XLSX.writeFile(workbook, 'AllCustomers.xlsx');

  }

}