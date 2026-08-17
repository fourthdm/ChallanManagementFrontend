import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import * as XLSX from 'xlsx';
declare var bootstrap:any

@Component({
  selector: 'app-outwardchallan',
  templateUrl: './outwardchallan.component.html',
  styleUrls: ['./outwardchallan.component.css']
})
export class OutwardchallanComponent {

  @Input() Vendor_Name: any;
  @Input() Vendor_CompanyName: any;
  @Input() Product_Status: any;
  @Input() Delivery_Status: any;
  @Input() Challan_Status: any;
  @Input() Added_Date: any;

  AllVendorData: any[] = [];
  AllVendorChallan: any[] = [];

  UpdateVendorchallanform: FormGroup;
  pro: any;
  
  constructor(private _rest: RestService, private fb: FormBuilder, private _activatedroute: ActivatedRoute) {
    this.UpdateVendorchallanform = this.fb.group({
      VendorChallan_id: [''],
      Vendor_Name: [''],
      Vendor_CompanyName: [''],
      Vendor_CompanyAddress: [''],
      VendorGST_No: [''],
      Vendor_Phoneno: [''],
      Vendor_Email: [''],

      SubTotal: [''],
      Total_Amount: [''],
      CGST_amount: [''],
      SGST_amount: [''],
      Grand_Total: [''],

      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: [''],
      Remark: [''],

      Product_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],

      vendoritems: this.fb.array([
        this.createProduct()
      ])
    })
  }

  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  ngOnInit(): void {
    this.AllchallanDetails();
    this.GetAllVendor();
  }

  GetAllVendor() {
    this._rest.AllVendor().subscribe((data: any) => {
      console.log(data);
      this.AllVendorData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  AllchallanDetails() {
    this._rest.ALlvendorChallandata().subscribe((data: any) => {
      // console.log(data);

      this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
        return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
      })
      console.log(this.AllVendorChallan);

      // this.AllVendorChallan = (data.data || []).sort((a:any, b:any) =>{
      //   return new Date(b.Added_Date).getTime() - new Date(a.Added_Date).getTime();  
      // }))
      // this.AllVendorChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  calculateProductRate(productIndex: number) {
    const product = this.vendoritems.at(productIndex);
    const operations = this.getOperations(productIndex);

    let totalOperationRate = 0;

    operations.controls.forEach((op: any) => {
      totalOperationRate += Number(op.get('Rate')?.value || 0);
    });

    product.get('Rate')?.setValue(totalOperationRate, { emitEvent: false });

    const qty = Number(product.get('Product_Quantity')?.value || 0);
    const subtotal = qty * totalOperationRate;

    product.get('SubTotal')?.setValue(subtotal, { emitEvent: false });
  }

  calculateSubtotal(index: number) {
    const product = this.vendoritems.at(index);

    const qty =
      Number(product.get('Product_Quantity')?.value) || 0;

    const rate =
      Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  Selectedchallan: any = null;

  createProduct(product?: any): FormGroup {
    return this.fb.group({
      VendorProduct_id: [product?.VendorProduct_id || 0],
      Product_Name: [product?.Product_Name || '', Validators.required],
      HSN_Code: [product?.HSN_Code || '', Validators.required],
      Product_Quantity: [product?.Product_Quantity || 1],
      Rate: [product?.Rate || 0],
      SubTotal: [product?.SubTotal || 0],
      operations: this.fb.array(
        product?.operations?.length
          ? product.operations.map((op: any) => this.createOperationGroup(op))
          : [this.createOperationGroup()]
      )
    });
  }

  get vendoritems(): FormArray {
    return this.UpdateVendorchallanform.get('vendoritems') as FormArray;
  }

  editRequirement(VendorChallan_id: any) {
    this._rest.VendorchallanbyId(VendorChallan_id).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.UpdateVendorchallanform.patchValue({
          VendorChallan_id: data.VendorChallan_id,
          Vendor_Name: data.Vendor_Name,
          Vendor_CompanyName: data.Vendor_CompanyName,
          Vendor_CompanyAddress: data.Vendor_CompanyAddress,
          VendorGST_No: data.VendorGST_No,
          Vendor_Phoneno: data.Vendor_Phoneno,
          Vendor_Email: data.Vendor_Email,
          Mode_of_Transport: data.Mode_of_Transport,
          Transporter_Name: data.Transporter_Name,
          Vehicle_Number: data.Vehicle_Number,
          Remark: data.Remark,
          Product_Status: data.Product_Status,
          Delivery_Status: data.Delivery_Status,
          Challan_Status: data.Challan_Status
        });
        this.vendoritems.clear();

        data.vendoritems.forEach((product: any) => {
          this.vendoritems.push(this.createProduct(product));
        });

      },
      error: err => {
        console.log(err);
      }
    });
  }

  // Update() {
  //   if (this.UpdateVendorchallanform.invalid) {
  //     alert('Please fill required fields');
  //     return;
  //   }
  //   const VendorChallan_id = this.UpdateVendorchallanform.value.VendorChallan_id;
  //   const body = this.UpdateVendorchallanform.getRawValue();
  //   this._rest.UpdateVendorChallan(VendorChallan_id, body).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       this.AllchallanDetails();
  //     },
  //     error: err => {
  //       console.log(err);
  //       alert(err.error?.message || 'Update failed');
  //     }
  //   });
  // }

  Update() {
    if (this.UpdateVendorchallanform.invalid) {
      this.UpdateVendorchallanform.markAllAsTouched();
      return;
    }
    const VendorChallan_id = this.UpdateVendorchallanform.value.VendorChallan_id;
    // const formData = this.UpdateVendorchallanform.value;
    const body = this.UpdateVendorchallanform.getRawValue();
    this._rest.UpdateVendorChallan(VendorChallan_id, body).subscribe({
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
          console.log('Vendor Challan updated successfully');
        }
      },
      error: (error) => {
        console.error('Update failed:', error);
      }
    });
  }

  getOperations(index: number): FormArray {
    return this.vendoritems.at(index).get('operations') as FormArray;
  }

  createOperationGroup(op?: any): FormGroup {
    return this.fb.group({
      Operation_id: [op?.Operation_id || 0],
      Operation_Name: [op?.Operation_Name || ''],
      Rate: [op?.Rate || 0]
    });
  }

  addProduct() {
    this.vendoritems.push(this.createProduct());
  }

  removeProduct(index: number) {
    this.vendoritems.removeAt(index);
  }

  addOperation(productIndex: number) {
    this.getOperations(productIndex).push(this.createOperationGroup());
  }

  removeOperation(productIndex: number, operationIndex: number) {
    this.getOperations(productIndex).removeAt(operationIndex);
  }

  selectedchallanId = 0;
  adminPassword = '';

  openDeleteModal(id: number) {
    this.selectedchallanId = id;
  }

  DeleteChallan() {
    this._rest.DeleteVendorChallan(
      this.selectedchallanId,
      this.adminPassword
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          this.AllchallanDetails();
          this.adminPassword = '';
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  DatabyDate() {
    this._rest.VendorChallanbyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Added_Date = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyChallanStatus() {
    this._rest.VendorchallanDatabyChallanStatus({ Challan_Status: this.Challan_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Challan_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyDeliveryStatus() {
    this._rest.VendorchallanDatabyDeliveryStatus({ Delivery_Status: this.Delivery_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Delivery_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyWorkStatus() {
    this._rest.VendorChallanProductStatus({ Product_Status: this.Product_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Product_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyCustomername() {
    this._rest.VendorChallanDatabyVendorName({ Vendor_Name: this.Vendor_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Vendor_Name = '';
    }, (err: any) => {
      console.log(err);
    })
  }

  DatabyCompanyname() {
    this._rest.VendorChallanDatabyCompanyName({ Vendor_CompanyName: this.Vendor_CompanyName }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Vendor_CompanyName = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  printPdf(VendorChallan_id: any) {
    this._rest.GetVendorChallanPDF(VendorChallan_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank');
    });
  }

  // printPdf(VendorChallan_id: any) {
  //   this._rest.GetVendorChallanPDF(VendorChallan_id)
  //     .subscribe((file: Blob) => {
  //       const url = window.URL.createObjectURL(file);
  //       const win = window.open('', '_blank');

  //       if (win) {
  //         win.document.write(
  //           `<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`
  //         );

  //         setTimeout(() => {
  //           win.print();
  //         }, 800);

  //         URL.revokeObjectURL(url);
  //       }
  //     });
  // }

  // exportexcel(): void {

  //   const data: any[][] = [];
  //   // Header
  //   data.push([
  //     'Sr No',
  //     'Vendor Challan Code',
  //     'Vendor_Name',
  //     'Company_Name',
  //     'Company_Address',
  //     'GST_No',
  //     'Vendor_Phoneno',
  //     'Vendor_Email',
  //     'Sub_Total',
  //     'Total_Amount',
  //     'CGST_amount',
  //     'SGST_amount',
  //     'Grand_Total',
  //     'Mode_of_Transport',
  //     'Transporter_Name',
  //     'Vehicle_Number',
  //     'Remark',
  //     'Work_Status',
  //     'Delivery_Status',
  //     'Challan_Status',
  //     'Added_Date',
  //     'Updated_Date',

  //     'Product',
  //     'HSN_Code',
  //     'Qty',
  //     'Rate',
  //     'Subtotal',

  //   ]);

  //   const merges: XLSX.Range[] = [];

  //   let row = 1;

  //   this.AllVendorChallan.forEach((challan: any, index: number) => {

  //     const startRow = row;

  //     (challan.items || []).forEach((item: any, i: number) => {

  //       data.push([
  //         i === 0 ? index + 1 : '',
  //         i === 0 ? challan.VendorChallan_Code : '',
  //         i === 0 ? challan.Vendor_Name : '',
  //         i === 0 ? challan.Vendor_CompanyName : '',
  //         i === 0 ? challan.Vendor_CompanyAddress : '',
  //         i === 0 ? challan.VendorGST_No : '',
  //         i === 0 ? challan.Vendor_Phoneno : '',
  //         i === 0 ? challan.Vendor_Email : '',
  //         i === 0 ? challan.Sub_Total : '',
  //         i === 0 ? challan.Total_Amount : '',
  //         i === 0 ? challan.CGST_amount : '',
  //         i === 0 ? challan.SGST_amount : '',
  //         i === 0 ? challan.Grand_Total : '',
  //         i === 0 ? challan.Mode_of_Transport : '',
  //         i === 0 ? challan.Transporter_Name : '',
  //         i === 0 ? challan.Vehicle_Number : '',
  //         i === 0 ? challan.Remark : '',
  //         i === 0 ? challan.Product_Status : '',
  //         i === 0 ? challan.Delivery_Status : '',
  //         i === 0 ? challan.Challan_Status : '',
  //         i === 0 ? challan.Added_Date : '',
  //         i === 0 ? challan.Updated_Date : '',

  //         item.Product_Name,
  //         item.HSN_Code,
  //         item.Product_Quantity,
  //         item.Rate,
  //         item.SubTotal,
  //         item.Operation_Name,
  //         item.OperationRate
  //       ]);

  //       row++;
  //     });

  //     // challan.items.forEach((item: any, i: number) => {
  //     //   challan.items.forEach((operations: any, i: number) => {
  //     //     data.push([
  //     //       i === 0 ? index + 1 : '',
  //     //       i === 0 ? challan.VendorChallan_Code : '',
  //     //       i === 0 ? challan.Vendor_Name : '',
  //     //       i === 0 ? challan.Vendor_CompanyName : '',
  //     //       i === 0 ? challan.Vendor_CompanyAddress : '',
  //     //       i === 0 ? challan.VendorGST_No : '',
  //     //       i === 0 ? challan.Vendor_Phoneno : '',
  //     //       i === 0 ? challan.Vendor_Email : '',
  //     //       i === 0 ? challan.Sub_Total : '',
  //     //       i === 0 ? challan.Total_Amount : '',
  //     //       i === 0 ? challan.Discount_Amount : '',
  //     //       i === 0 ? challan.CGST_amount : '',
  //     //       i === 0 ? challan.SGST_amount : '',
  //     //       i === 0 ? challan.Grand_Total : '',
  //     //       i === 0 ? challan.Mode_of_Transport : '',
  //     //       i === 0 ? challan.Transporter_Name : '',
  //     //       i === 0 ? challan.Vehicle_Number : '',
  //     //       i === 0 ? challan.Remark : '',
  //     //       i === 0 ? challan.Product_Status : '',
  //     //       i === 0 ? challan.Delivery_Status : '',
  //     //       i === 0 ? challan.Challan_Status : '',
  //     //       i === 0 ? challan.Added_Date : '',
  //     //       i === 0 ? challan.Updated_Date : '',

  //     //       item.Product_Name,
  //     //       item.HSN_Code,
  //     //       // item.Operation_Perform,
  //     //       item.Product_Quantity,
  //     //       item.Rate,
  //     //       item.SubTotal,

  //     //       operations.Operation_Name,
  //     //       operations.Rate
  //     //     ]);
  //     //     row++;
  //     //   });
  //     // });

  //     const endRow = row - 21;

  //     if (endRow > startRow) {

  //       for (let c = 0; c <= 22; c++) {
  //         merges.push({
  //           s: { r: startRow, c },
  //           e: { r: endRow, c }
  //         });
  //       }

  //     }
  //     // if (endRow > startRow) {
  //     //   merges.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });
  //     //   merges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });
  //     //   merges.push({ s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } });
  //     // }

  //   });

  //   const worksheet = XLSX.utils.aoa_to_sheet(data);

  //   worksheet['!merges'] = merges;

  //   const workbook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'All Vendor Challan');

  //   XLSX.writeFile(workbook, 'AllVendorChallan.xlsx');

  // }

  exportexcel(): void {

    const data: any[][] = [];

    // Header
    data.push([
      'Sr No',
      'Vendor Challan Code',
      'Vendor Name',
      'Company Name',
      'Company Address',
      'GST No',
      'Phone',
      'Email',

      'Sub Total',
      'CGST',
      'SGST',
      'Grand Total',

      'Transport Mode',
      'Transporter',
      'Vehicle No',

      'Remark',
      'Product Status',
      'Delivery Status',
      'Challan Status',

      'Added Date',
      'Updated Date',

      'Product Name',
      'HSN Code',
      'Quantity',
      'Product Rate',
      'Product Total',

      'Operation',
      'Operation Rate'
    ]);

    const merges: XLSX.Range[] = [];

    let row = 1;

    this.AllVendorChallan.forEach((challan: any, index: number) => {

      const startRow = row;

      (challan.vendoritems || []).forEach((product: any) => {

        const productStartRow = row;
        // If no operations exist
        if (!product.operations || product.operations.length === 0) {

          data.push([
            row === startRow ? index + 1 : '',
            row === startRow ? challan.VendorChallan_Code : '',
            row === startRow ? challan.Vendor_Name : '',
            row === startRow ? challan.Vendor_CompanyName : '',
            row === startRow ? challan.Vendor_CompanyAddress : '',
            row === startRow ? challan.VendorGST_No : '',
            row === startRow ? challan.Vendor_Phoneno : '',
            row === startRow ? challan.Vendor_Email : '',

            row === startRow ? challan.Sub_Total : '',
            row === startRow ? challan.CGST_amount : '',
            row === startRow ? challan.SGST_amount : '',
            row === startRow ? challan.Grand_Total : '',

            row === startRow ? challan.Mode_of_Transport : '',
            row === startRow ? challan.Transporter_Name : '',
            row === startRow ? challan.Vehicle_Number : '',

            row === startRow ? challan.Remark : '',
            row === startRow ? challan.Product_Status : '',
            row === startRow ? challan.Delivery_Status : '',
            row === startRow ? challan.Challan_Status : '',

            row === startRow ? challan.Added_Date : '',
            row === startRow ? challan.Updated_Date : '',

            product.Product_Name,
            product.HSN_Code,
            product.Product_Quantity,
            product.Rate,
            product.SubTotal,
            '',
            ''
          ]);

          row++;

        } else {
          product.operations.forEach((operation: any) => {

            data.push([
              row === startRow ? index + 1 : '',
              row === startRow ? challan.VendorChallan_Code : '',
              row === startRow ? challan.Vendor_Name : '',
              row === startRow ? challan.Vendor_CompanyName : '',
              row === startRow ? challan.Vendor_CompanyAddress : '',
              row === startRow ? challan.VendorGST_No : '',
              row === startRow ? challan.Vendor_Phoneno : '',
              row === startRow ? challan.Vendor_Email : '',

              row === startRow ? challan.Sub_Total : '',
              row === startRow ? challan.CGST_amount : '',
              row === startRow ? challan.SGST_amount : '',
              row === startRow ? challan.Grand_Total : '',

              row === startRow ? challan.Mode_of_Transport : '',
              row === startRow ? challan.Transporter_Name : '',
              row === startRow ? challan.Vehicle_Number : '',

              row === startRow ? challan.Remark : '',
              row === startRow ? challan.Product_Status : '',
              row === startRow ? challan.Delivery_Status : '',
              row === startRow ? challan.Challan_Status : '',

              row === startRow ? challan.Added_Date : '',
              row === startRow ? challan.Updated_Date : '',

              row === productStartRow ? product.Product_Name : '',
              row === productStartRow ? product.HSN_Code : '',
              row === productStartRow ? product.Product_Quantity : '',
              row === productStartRow ? product.Rate : '',
              row === productStartRow ? product.SubTotal : '',

              operation.Operation_Name,
              operation.Rate
            ]);
            row++;

            const productEndRow = row - 1;

            if (productEndRow > productStartRow) {
              // Merge Product columns
              for (let c = 21; c <= 25; c++) {
                merges.push({
                  s: { r: productStartRow, c },
                  e: { r: productEndRow, c }
                });
              }
            }
          });
        }
        // product.operations.forEach(operation => {
        //   data.push([
        //      operation.Operation_Name,
        //       operation.Rate
        //    ]);
        //   row++;
        // });
      });

      const endRow = row - 1;
      // const endRow = row - 1;
      if (endRow > startRow) {
        // Merge Vendor Details
        for (let c = 0; c <= 20; c++) {
          merges.push({
            s: { r: startRow, c },
            e: { r: endRow, c }
          });
        }
      }
      // if (endRow > startRow) {

      //   // for (let c = 0; c <= 20; c++) {

      //   //   merges.push({
      //   //     s: { r: startRow, c: c },
      //   //     e: { r: endRow, c: c }
      //   //   });

      //   // }

      //   for (let c = 21; c <= 25; c++) {

      //     merges.push({
      //       s: { r: productStartRow, c },
      //       e: { r: productEndRow, c }
      //     });

      //   }

      // }

    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!merges'] = merges;

    // worksheet['!cols'] = [
    //   { wch: 8 },
    //   { wch: 20 },
    //   { wch: 20 },
    //   { wch: 25 },
    //   { wch: 30 },
    //   { wch: 18 },
    //   { wch: 15 },
    //   { wch: 25 },
    //   { wch: 12 },
    //   { wch: 12 },
    //   { wch: 12 },
    //   { wch: 15 },
    //   { wch: 18 },
    //   { wch: 20 },
    //   { wch: 18 },
    //   { wch: 25 },
    //   { wch: 18 },
    //   { wch: 18 },
    //   { wch: 18 },
    //   { wch: 18 },
    //   { wch: 18 },
    //   { wch: 22 },
    //   { wch: 15 },
    //   { wch: 12 },
    //   { wch: 12 },
    //   { wch: 15 },
    //   { wch: 20 },
    //   { wch: 15 }
    // ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor Challan');

    XLSX.writeFile(workbook, 'Vendor_Challan_Report.xlsx');

  }

}


