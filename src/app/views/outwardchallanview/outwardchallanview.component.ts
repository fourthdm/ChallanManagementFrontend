import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

declare var bootstrap :any

@Component({
  selector: 'app-outwardchallanview',
  templateUrl: './outwardchallanview.component.html',
  styleUrls: ['./outwardchallanview.component.css']
})
export class OutwardchallanviewComponent{

  AllVendorData: any[] = [];
  AllVendorChallan: any[] = [];

  UpdateVendorchallanform: FormGroup;

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
      Discount_Amount: [''],
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

  ngOnInit(): void {
    // this.AllchallanDetails();/
    // this.GetAllVendor();
    this.ByChallanid();
    this.LoadHistory();
  }

  History: any[] = [];
  HeaderHistory: any = [];
  ProductHistory: any = [];
  OperationHistory: any = [];

  LoadHistory() {
    this._activatedroute.params.subscribe(params => {
      const VendorChallan_id = params['VendorChallan_id'];

      this._rest.GetVendorHistory(VendorChallan_id).subscribe((res: any) => {
        this.HeaderHistory = res.headerHistory || [];
        this.ProductHistory = res.productHistory || [];
        this.OperationHistory = res.operationHistory || [];

        this.HeaderHistory = this.HeaderHistory.map((x: any) => ({
          ...x,
          old_vendorchallan: JSON.parse(x.old_vendorchallan),
          new_vendorchallan: JSON.parse(x.new_vendorchallan)
        }));

        this.ProductHistory = this.ProductHistory.map((x: any) => ({
          ...x,
          old_product: x.old_product ? JSON.parse(x.old_product) : null,
          new_product: x.new_product ? JSON.parse(x.new_product) : null
        }));

        this.OperationHistory = this.OperationHistory.map((x: any) => ({
          ...x,
          old_operation: x.old_operation ? JSON.parse(x.old_operation) : null,
          new_operation: x.new_operation ? JSON.parse(x.new_operation) : null
        }));
      });
    });
  }

  liked: boolean = false;
  
  Show(){
    this.liked = !this.liked;
  }

  // LoadHistory() {
  //   this._activatedroute.params.subscribe(params => {
  //     const VendorChallan_id = params['VendorChallan_id'];

  //     this._rest.GetVendorHistory(VendorChallan_id).subscribe((res: any) => {

  //       this.HeaderHistory = res.headerHistory;
  //       this.ProductHistory = res.productHistory;
  //       this.OperationHistory = res.OperationHistory;

  //       this.HeaderHistory = this.HeaderHistory.map((x: any) => ({

  //         ...x,

  //         old_vendorchallan: JSON.parse(x.old_vendorchallan),

  //         new_vendorchallan: JSON.parse(x.new_vendorchallan)

  //       }));

  //       this.ProductHistory = this.ProductHistory.map((x: any) => ({
  //         ...x,
  //         old_product: x.old_product ? JSON.parse(x.old_product) : null,
  //         new_product: x.new_product ? JSON.parse(x.new_product) : null
  //       }));


  //       // this.History = res.data || res; 
  //       // this.History = this.History.map((item: any) => {
  //       //   return {
  //       //     ...item,
  //       //     old_vendorchallan: item.old_vendorchallan
  //       //       ? JSON.parse(item.old_vendorchallan)
  //       //       : {},
  //       //     new_vendorchallan: item.new_vendorchallan
  //       //       ? JSON.parse(item.new_vendorchallan)
  //       //       : {},
  //       //   };
  //       // });

  //       console.log(this.History);
  //     });
  //   })
  // }


  ByChallanid() {
    this._activatedroute.params.subscribe(params => {
      const VendorChallan_id = params['VendorChallan_id'];
      this._rest.VendorchallanbyId(VendorChallan_id).subscribe((data: any) => {
        console.log(data);
        this.AllVendorChallan = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
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
      console.log(data);
      this.AllVendorChallan = data.data;
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

  // addProduct() {
  //   this.vendoritems.push(
  //     this.createProduct()
  //   );
  // }


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

  // get vendoritems(): FormArray {
  //   return this.UpdateVendorchallanform.get('vendoritems') as FormArray;
  // }

  // calculateSubtotal(index: number) {
  //   const product = this.vendoritems.at(index);

  //   const qty =
  //     Number(product.get('Product_Quantity')?.value) || 0;

  //   const rate =
  //     Number(product.get('Rate')?.value) || 0;
  //   const subtotal = qty * rate;
  //   product.get('SubTotal')?.setValue(subtotal);
  // }

  get vendoritems(): FormArray {
    return this.UpdateVendorchallanform.get('vendoritems') as FormArray;
  }

  // Selectedchallan: any = null;

  // editRequirement(VendorChallan_id: any) {

  //   const data = this.AllVendorChallan.find(r => r.VendorChallan_id === VendorChallan_id);

  //   if (!data) return;

  //   this.Selectedchallan = 1;

  //   this.UpdateVendorchallanform.patchValue({
  //     VendorChallan_id: data.VendorChallan_id,
  //     Vendor_Name: data.Vendor_Name,
  //     Vendor_CompanyName: data.Vendor_CompanyName,
  //     Vendor_CompanyAddress: data.Vendor_CompanyAddress,
  //     VendorGST_No: data.VendorGST_No,
  //     Vendor_Phoneno: data.Vendor_Phoneno,
  //     Vendor_Email: data.Vendor_Email,
  //     Mode_of_Transport: data.Mode_of_Transport,
  //     Transporter_Name: data.Transporter_Name,
  //     Vehicle_Number: data.Vehicle_Number,
  //     Remark: data.Remark,
  //     Product_Status: data.Product_Status,
  //     Delivery_Status: data.Delivery_Status,
  //     Challan_Status: data.Challan_Status
  //   });

  //   // ✅ CLEAR OLD ITEMS
  //   this.vendoritems.clear();
  //   data.vendoritems.forEach((p: any) => {
  //     this.vendoritems.push(
  //       this.fb.group({
  //         Product_Name: [p.Product_Name],
  //         HSN_Code: [p.HSN_Code],
  //         Operation_Perform: [p.Operation_Perform],
  //         Product_Quantity: [p.Product_Quantity],
  //         Rate: [p.Rate],
  //         SubTotal: [{
  //           value: p.Product_Quantity * p.Rate,
  //           disabled: true
  //         }]
  //       })
  //     );
  //   });
  // }

  // removeProduct(index: number) {
  //   this.vendoritems.removeAt(index);
  // }

  // Update() {
  //   const VendorChallan_id = this.UpdateVendorchallanform.value.VendorChallan_id;
  //   this._rest.UpdateVendorChallan(VendorChallan_id, this.UpdateVendorchallanform.value).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

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
        this.ByChallanid();
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


  // Update() {
  //   if (this.UpdateVendorchallanform.invalid) {
  //     alert('Please fill required fields');
  //     return;
  //   }
  //   const VendorChallan_id =
  //     this.UpdateVendorchallanform.value.VendorChallan_id;

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
  
  // selectedchallanId = 0;
  // adminPassword = '';

  // openDeleteModal(id: number) {
  //   console.log("Selected VendorChallan_id:", id);
  //   this.selectedchallanId = id;
  // }

  // DeleteChallan() {
  //   console.log("Deleting ID:", this.selectedchallanId);
  //   console.log("Password:", this.adminPassword);

  //   this._rest.DeleteVendorChallan(
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

  // selectedchallanId = 0;
  // adminPassword = '';

  // openDeleteModal(id: number) {
  //   this.selectedchallanId = id;
  // }

  // DeleteChallan() {
  //   this._rest.DeleteVendorChallan(
  //     this.selectedchallanId,
  //     { Password: this.adminPassword }
  //   ).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);

  //       if (res.success) {
  //         this.ByChallanid();
  //         this.adminPassword = '';
  //       }
  //     },
  //     error: err => {
  //       alert(err.error?.message || 'Delete failed');
  //     }
  //   });
  // }

}