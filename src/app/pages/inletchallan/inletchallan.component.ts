import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

import * as XLSX from 'xlsx';

declare var bootstrap: any;

@Component({
  selector: 'app-inletchallan',
  templateUrl: './inletchallan.component.html',
  styleUrls: ['./inletchallan.component.css']
})
export class InletchallanComponent {

  @Input() Customer_Name: any;
  @Input() Company_Name: any;
  @Input() Delivery_Status: any;
  @Input() Work_Status: any;
  @Input() Challan_Status: any;
  @Input() Added_Date: any;

  AllCustomerData: any[] = [];
  AllChallan: any[] = [];

  Updateinletchallanfrom: FormGroup;
  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder, private _activatedroute: ActivatedRoute) {
    this.Updateinletchallanfrom = this.fb.group({
      Challan_id: [''],
      Customer_Name: [''],
      Company_Name: [''],
      Company_Address: [''],
      GST_No: [''],
      Delivery_Address: [''],

      SubTotal: [''],
      Total_Amount: [''],
      Discount_Amount: [''],
      CGST_amount: [''],
      SGST_amount: [''],
      Grand_Total: [''],

      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: [''],
      Remark: [''],

      Work_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],

      items: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.AllchallanDetails();
    this.GetAllCustomer();
  }

  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  GetAllCustomer() {
    this._rest.AllCustomer().subscribe((data: any) => {
      console.log(data);
      this.AllCustomerData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  AllchallanDetails() {
    this._rest.AllInletChallan().subscribe((data: any) => {
      console.log(data);
      this.AllChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  printPdf(Challan_id: any) {
    this._rest.GetChallanPDF(Challan_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank')
    });
    // this._rest.GetChallanPDF(Challan_id)
    //   .subscribe((file: Blob) => {
    //     const url = window.URL.createObjectURL(file);
    //     const win = window.open('', '_blank');

    //     if (win) {
    //       win.document.write(
    //         `<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`
    //       );

    //       setTimeout(() => {
    //         win.print();
    //       }, 800);

    //       URL.revokeObjectURL(url);
    //     }
    //   });
  }

  addProduct() {
    this.items.push(
      this.createProduct()
    );
  }

  createProduct(): FormGroup {
    return this.fb.group({
      // InletProduct_id: [],
      Product_Name: ['', Validators.required],
      HSN_Code: [''],
      Product_Quantity: [1, Validators.required],
      Rate: [0, Validators.required],
      SubTotal: [{ value: 0, disabled: true }]
    });
  }

  calculateSubtotal(index: number) {
    const product = this.items.at(index);

    const qty =
      Number(product.get('Product_Quantity')?.value) || 0;

    const rate =
      Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  get items(): FormArray {
    return this.Updateinletchallanfrom.get('items') as FormArray;
  }

  Selectedchallan: any = null;

  editRequirement(Challan_id: any) {

    const data = this.AllChallan.find(r => r.Challan_id === Challan_id);

    if (!data) return;

    this.Selectedchallan = 1;

    this.Updateinletchallanfrom.patchValue({
      Challan_id: data.Challan_id,
      Customer_Name: data.Customer_Name,
      Company_Name: data.Company_Name,
      Company_Address: data.Company_Address,
      GST_No: data.GST_No,
      Discount_Amount: data.Discount_Amount,
      Delivery_Address: data.Delivery_Address,
      Mode_of_Transport: data.Mode_of_Transport,
      Transporter_Name: data.Transporter_Name,
      Vehicle_Number: data.Vehicle_Number,
      Remark: data.Remark,
      Work_Status: data.Work_Status,
      Delivery_Status: data.Delivery_Status,
      Challan_Status: data.Challan_Status
    });

    // ✅ CLEAR OLD ITEMS
    this.items.clear();
    data.items.forEach((p: any) => {
      this.items.push(
        this.fb.group({
          InletProduct_id: [p.InletProduct_id],
          Product_Name: [p.Product_Name],
          HSN_Code: [p.HSN_Code],
          Product_Quantity: [p.Product_Quantity],
          Rate: [p.Rate],
          SubTotal: [{
            value: p.Product_Quantity * p.Rate,
            disabled: true
          }]
        })
      );
    });
  }

  removeProduct(index: number) {
    this.items.removeAt(index);
  }


  Update() {

    if (this.Updateinletchallanfrom.invalid) {
      this.Updateinletchallanfrom.markAllAsTouched();
      return;
    }

    const Challan_id = this.Updateinletchallanfrom.value.Challan_id;
    const formData = this.Updateinletchallanfrom.value;

    this._rest.UpdateChallan(Challan_id, formData).subscribe({
      next: (res: any) => {
        alert(res.message);

        this.AllchallanDetails();
        if (res.success) {
          // Close modal
          const modalElement = document.getElementById('exampleModal');

          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);

            if (modal) {
              modal.hide();
            }
          }

          console.log('Challan updated successfully');
        }

      },
      error: (error) => {
        console.error('Update failed:', error);
      }
    });
  }

  // Update() {
  //   const Challan_id = this.Updateinletchallanfrom.value.Challan_id;
  //   this._rest.UpdateChallan(Challan_id, this.Updateinletchallanfrom.value).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }


  // selectedchallanId = 0;
  // adminPassword = '';

  selectedchallanId = 0;
  adminPassword = '';
  deletionReason = '';
  isDeleting: boolean = false;

  openDeleteModal(id: number) {
    this.selectedchallanId = id;
  }


  DeleteChallan() {

    if (!this.adminPassword || this.adminPassword.trim() === '') {

      alert('Please enter Admin Password');

      return;
    }


    if (!this.deletionReason || this.deletionReason.trim() === '') {

      alert('Please enter the reason for deletion');

      return;
    }


    if (this.deletionReason.trim().length < 5) {

      alert('Please enter a valid deletion reason');

      return;
    }


    if (!this.selectedchallanId) {

      alert('Invalid Challan');

      return;
    }


    this.isDeleting = true;


    this._rest.DeleteChallan(
      this.selectedchallanId,
      this.adminPassword,
      this.deletionReason.trim()
    )
      .subscribe({

        next: (res: any) => {

          this.isDeleting = false;

          alert(res.message);


          if (res.success) {

            // Refresh challan list
            this.AllchallanDetails();


            // Clear values
            this.adminPassword = '';

            this.deletionReason = '';

            this.selectedchallanId = 0;

            this.liked = false;


            // Close modal
            const modalElement =
              document.getElementById('deleteVendorModal');

            if (modalElement) {

              const modal =
                (window as any).bootstrap.Modal
                  .getInstance(modalElement);

              if (modal) {
                modal.hide();
              }
            }

          }

        },

        error: (err) => {

          this.isDeleting = false;

          console.log(err);

          if (err.error && err.error.message) {

            alert(err.error.message);

          } else {

            alert('Something went wrong while deleting challan');

          }

        }

      });

  }

  // DeleteChallan() {
  //   this._rest.DeleteChallan(
  //     this.selectedchallanId,
  //     this.adminPassword
  //   ).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       if (res.success) {
  //         this.AllchallanDetails();
  //         this.adminPassword = '';
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

  DatabyDate() {
    this._rest.challanDatabyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }

      this.Added_Date = '';

    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyChallanStatus() {
    this._rest.DatabyChallanStatus({ Challan_Status: this.Challan_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Challan_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyDeliveryStatus() {
    this._rest.DatabyDeliveryStatus({ Delivery_Status: this.Delivery_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Delivery_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyWorkStatus() {
    this._rest.DatabyWorkStatus({ Work_Status: this.Work_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Work_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyCustomername() {
    this._rest.DatabyCustomerName({ Customer_Name: this.Customer_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Customer_Name = '';
    }, (err: any) => {
      console.log(err);
    })
  }

  DatabyCompanyname() {
    this._rest.DatabyCompanyName({ Company_Name: this.Company_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Company_Name = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  exportexcel(): void {

    const data: any[][] = [];

    // Header
    data.push([
      'Sr No',
      'Challan Code',
      'Customer',
      'Company_Name',
      'Company_Address',
      'GST_No',
      'Delivery_Address',
      'Sub_Total',
      'Total_Amount',
      'Discount_Amount',
      'CGST_amount',
      'SGST_amount',
      'Grand_Total',
      'Mode_of_Transport',
      'Transporter_Name',
      'Vehicle_Number',
      'Remark',
      'Work_Status',
      'Delivery_Status',
      'Challan_Status',
      'Added_Date',
      'Updated_Date',

      'Product',
      'HSN_Code',
      'Qty',
      'Rate',
      'Subtotal'
    ]);

    const merges: XLSX.Range[] = [];

    let row = 1;

    this.AllChallan.forEach((challan: any, index: number) => {

      const startRow = row;

      challan.items.forEach((item: any, i: number) => {

        data.push([
          i === 0 ? index + 1 : '',
          i === 0 ? challan.Challan_Code : '',
          i === 0 ? challan.Customer_Name : '',
          i === 0 ? challan.Company_Name : '',
          i === 0 ? challan.Company_Address : '',
          i === 0 ? challan.GST_No : '',
          i === 0 ? challan.Delivery_Address : '',
          i === 0 ? challan.Sub_Total : '',
          i === 0 ? challan.Total_Amount : '',
          i === 0 ? challan.Discount_Amount : '',
          i === 0 ? challan.CGST_amount : '',
          i === 0 ? challan.SGST_amount : '',
          i === 0 ? challan.Grand_Total : '',
          i === 0 ? challan.Mode_of_Transport : '',
          i === 0 ? challan.Transporter_Name : '',
          i === 0 ? challan.Vehicle_Number : '',
          i === 0 ? challan.Remark : '',
          i === 0 ? challan.Work_Status : '',
          i === 0 ? challan.Delivery_Status : '',
          i === 0 ? challan.Challan_Status : '',
          i === 0 ? challan.Added_Date : '',
          i === 0 ? challan.Updated_Date : '',

          item.Product_Name,
          item.HSN_Code,
          item.Product_Quantity,
          item.Rate,
          item.SubTotal
        ]);

        row++;
      });

      const endRow = row - 21;

      if (endRow > startRow) {

        merges.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });

        merges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });

        merges.push({ s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } });

      }

    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!merges'] = merges;

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Challan');

    XLSX.writeFile(workbook, 'AllChallan.xlsx');

    //   const excelData = this.AllChallan.map((challan: any, index: number) => ({

    //     'Sr No': index + 1,
    //     'Challan_Code': challan.Challan_Code,
    //     'Customer_Name': challan.Customer_Name,
    //     'Company_Name': challan.Company_Name,
    //     'Company_Address': challan.Company_Address,
    //     'GST_No': challan.GST_No,
    //     'Delivery_Address': challan.Delivery_Address,

    //     'Products': challan.items.map((p: any) =>
    //       `Product : ${p.Product_Name}
    // HSN : ${p.HSN_Code}
    // Qty : ${p.Product_Quantity}
    // Rate : ${p.Rate}
    // Subtotal : ${p.SubTotal}`
    //     ).join('\n\n'),

    // 'Sub_Total': challan.Sub_Total,
    // 'Total_Amount': challan.Total_Amount,
    // 'Discount_Amount': challan.Discount_Amount,
    // 'CGST_amount': challan.CGST_amount,
    // 'SGST_amount': challan.SGST_amount,
    // 'Grand_Total': challan.Grand_Total,
    // 'Mode_of_Transport': challan.Mode_of_Transport,
    // 'Transporter_Name': challan.Transporter_Name,
    // 'Vehicle_Number': challan.Vehicle_Number,
    // 'Remark': challan.Remark,
    // 'Work_Status': challan.Work_Status,
    // 'Delivery_Status': challan.Delivery_Status,
    // 'Challan_Status': challan.Challan_Status,
    // 'Added_Date': challan.Added_Date,
    // 'Updated_Date': challan.Updated_Date

    //   }));

    //   const worksheet = XLSX.utils.json_to_sheet(excelData);

    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, 'AllChallan');

    //   XLSX.writeFile(workbook, 'AllChallan.xlsx');
  }

  // exportexcel(): void {
  //   const excelData: any[] = [];

  //   this.AllChallan.forEach((challan: any, index: number) => {

  //     challan.items.forEach((item: any, itemIndex: number) => {
  //       // STEP 4.1 – Create a new array for Excel
  //       // const excelData = this.AllChallan.map((w: any, index: number) => {
  //       excelData.push({
  //         'Sr No':  index + 1 ,
  //         'Challan_Code': challan.Challan_Code,
  //         'Customer_Name': challan.Customer_Name,
  //         'Company_Name': challan.Company_Name,
  //         'Company_Address': challan.Company_Address,
  //         'GST_No': challan.GST_No,
  //         'Delivery_Address': challan.Delivery_Address,

  //         'Products': challan.items
  //           .map((p: any) =>
  //             `${p.Product_Name} ${p.HSN_Code}  ${p.Product_Quantity} ${p.Rate} (${p.SubTotal})`
  //           )
  //           .join('\n'),

  //         // 'Product_Name': item.Product_Name,
  //         // 'HSN_Code': item.HSN_Code,
  //         // 'Product_Quantity': item.Product_Quantity,
  //         // 'Rate': item.Rate,
  //         // 'SubTotal': item.SubTotal,

  //         'Sub_Total': challan.Sub_Total,
  //         'Total_Amount': challan.Total_Amount,
  //         'Discount_Amount': challan.Discount_Amount,
  //         'CGST_amount': challan.CGST_amount,
  //         'SGST_amount': challan.SGST_amount,
  //         'Grand_Total': challan.Grand_Total,
  //         'Mode_of_Transport': challan.Mode_of_Transport,
  //         'Transporter_Name': challan.Transporter_Name,
  //         'Vehicle_Number': challan.Vehicle_Number,
  //         'Remark': challan.Remark,
  //         'Work_Status': challan.Work_Status,
  //         'Delivery_Status': challan.Delivery_Status,
  //         'Challan_Status': challan.Challan_Status,
  //         'Added_Date': challan.Added_Date,
  //         'Updated_Date': challan.Updated_Date
  //       });
  //     });
  //   });
  //   // STEP 4.2 – Convert JSON data to worksheet
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  //   // STEP 4.3 – Create workbook
  //   const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  //   // STEP 4.4 – Add worksheet to workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'AllChallan');

  //   // STEP 4.5 – Download Excel file
  //   XLSX.writeFile(workbook, 'AllChallan.xlsx');

  // }


}
