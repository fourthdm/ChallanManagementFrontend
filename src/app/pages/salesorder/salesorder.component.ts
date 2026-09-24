import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { StateService } from 'src/app/services/state.service';
declare var bootstrap: any;

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {

  AllSaleorders: any[] = [];
  AllCustomerData: any[] = [];
  AddSalesaOrderform: FormGroup;
  UpdateSalesOrderform: FormGroup;
  submitted = false;

  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder) {
    this.AddSalesaOrderform = this.fb.group({
      Customer_Name: ['', [Validators.required]],
      Company_Name: ['', [Validators.required]],
      Company_Address: ['', [Validators.required]],
      GST_No: ['', [Validators.required]],
      Sub_Total: [''],
      Total_Amount: [''],
      Discount_Amount: [''],
      Delivery_Address: [''],
      Remark: [''],
      Sales_Order_Status: [''],

      items: this.fb.array([
        this.createProduct()
      ])  // 🔥 REQUIRED
    })

    this.UpdateSalesOrderform = this.fb.group({
      SalesOrder_id: [''],
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

      Remark: [''],
      Sales_Order_Status: [''],

      itemsupdate: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.AddSalesaOrderform.get('Customer_Name')!
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(customerName => {
        this.autoFillByRequirement(customerName);
        this.calculateGrandTotal();
      });

    this.GetAllCustomer();
    this.AllSalesOrderDetails();
  }

  createProduct(): FormGroup {
    return this.fb.group({
      Product_Name: ['', Validators.required],
      HSN_Code: ['', Validators.required],
      Ordered_Quantity: ['', Validators.required],
      Rate: ['', Validators.required],
      SubTotal: []
    });
  }

  autoFillByRequirement(customerName: string) {
    const req = this.AllCustomerData.find(
      (r: any) => r.Customer_Name === customerName
    );
    if (!req) return;
    this.AddSalesaOrderform.patchValue({
      Company_Name: req.Company_Name,
      Company_Address: req.Company_Address,
      GST_No: req.GST_No,
      Delivery_Address: req.Delivery_Address,
    }, { emitEvent: false }); // ✅ STOP LOOP
  }

  get items(): FormArray {
    return this.AddSalesaOrderform.get('items') as FormArray;
  }

  addProduct() {
    this.items.push(
      this.createProduct()
    );
  }

  removeProduct(index: number) {
    this.items.removeAt(index);
  }

  saveChallan() {
    this.submitted = true;
    if (this.AddSalesaOrderform.invalid) {
      alert('Fill all required fields');
      return;
    }

    const formData = new FormData();
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    // HEADER DATA
    formData.append('Customer_Name', this.AddSalesaOrderform.value.Customer_Name);
    formData.append('Company_Name', this.AddSalesaOrderform.value.Company_Name);
    formData.append('Company_Address', this.AddSalesaOrderform.value.Company_Address);
    formData.append('GST_No', this.AddSalesaOrderform.value.GST_No);
    formData.append('Delivery_Address', this.AddSalesaOrderform.value.Delivery_Address);

    console.log(this.AddSalesaOrderform.value);
    this._rest.AddSalesorder(
      this.AddSalesaOrderform.value
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        console.log(res);
        this.AddSalesaOrderform.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  calculateItem(index: number) {
    const item = this.items.at(index);
    const Rate = +item.get('Rate')!.value || 0;
    const Quantity = +item.get('Ordered_Quantity')!.value || 0;
    const SubTotal = Rate * Quantity;
    item.patchValue({
      SubTotal: SubTotal
    }, { emitEvent: false })
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    let subTotal = 0;
    this.items.controls.forEach((item: any) => {
      subTotal += Number(item.get('SubTotal')?.value) || 0;
    });
    const discount =
      Number(this.AddSalesaOrderform.get('Discount_Amount')?.value) || 0;
    const totalAmount = subTotal - discount;
    this.AddSalesaOrderform.patchValue({
      Sub_Total: subTotal,
      Total_Amount: totalAmount
    }, { emitEvent: false });

  }

  GetAllCustomer() {
    this._rest.AllCustomer().subscribe((data: any) => {
      console.log(data);
      this.AllCustomerData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  AllSalesOrderDetails() {
    this._rest.AllSalesOrders().subscribe((data: any) => {
      console.log(data);
      this.AllSaleorders = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }


  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  selectedSalesorderId = 0;
  adminPassword = '';
  deletionReason = '';
  isDeleting: boolean = false;

  openDeleteModal(id: number) {
    this.selectedSalesorderId = id;
  }

  DeleteSalesorder() {

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


    if (!this.selectedSalesorderId) {
      alert('Invalid SalesOrder');
      return;
    }

    this.isDeleting = true;

    this._rest.DeleteChallan(
      this.selectedSalesorderId,
      this.adminPassword,
      this.deletionReason.trim()
    )
      .subscribe({

        next: (res: any) => {

          this.isDeleting = false;

          alert(res.message);
          if (res.success) {

            // Refresh challan list
            this.AllSalesOrderDetails();

            // Clear values
            this.adminPassword = '';

            this.deletionReason = '';

            this.selectedSalesorderId = 0;

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
            alert('Something went wrong while deleting Salesorder');
          }
        }
      });
  }

  printPdf(SalesOrder_id: any) {
    this._rest.GetSalesOrderPdf(SalesOrder_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank')
    });
  }

  addUpdatedProduct() {
    this.itemsupdate.push(
      this.createUpdatedProduct()
    );
  }

  createUpdatedProduct(): FormGroup {
    return this.fb.group({
      SalesOrderItem_id: [],
      Product_Name: ['', Validators.required],
      HSN_Code: [''],
      Ordered_Quantity: [1, Validators.required],
      Rate: [0, Validators.required],
      SubTotal: [{ value: 0, disabled: true }]
    });
  }

  calculateSubtotal(index: number) {
    const product = this.itemsupdate.at(index);
    const qty = Number(product.get('Ordered_Quantity')?.value) || 0;
    const rate = Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  get itemsupdate(): FormArray {
    return this.UpdateSalesOrderform.get('itemsupdate') as FormArray;
  }

  SelectedSaleorder: any = null;

  // editRequirement(SalesOrder_id: any) {
  //   const data = this.AllSaleorders.find(r => r.SalesOrder_id === SalesOrder_id);
  //   if (!data) return;

  //   console.log('Selected Sales Order:', data);
  //   console.log('Items:', data.itemsupdate);

  //   this.SelectedSaleorder = 1;

  //   this.UpdateSalesOrderform.patchValue({
  //     SalesOrder_id: data.SalesOrder_id,
  //     Customer_Name: data.Customer_Name,
  //     Company_Name: data.Company_Name,
  //     Company_Address: data.Company_Address,
  //     Delivery_Address: data.Delivery_Address,
  //     GST_No: data.GST_No,
  //     Discount_Amount: data.Discount_Amount,
  //     Remark: data.Remark,
  //     Sales_Order_Status: data.Sales_Order_Status,
  //   });

  //   // ✅ CLEAR OLD ITEMS
  //   this.itemsupdate.clear();
  //   data.itemsupdate.forEach((s: any) => {
  //     this.itemsupdate.push(
  //       this.fb.group({
  //         SalesOrderItem_id: [s.SalesOrderItem_id],
  //         Product_Name: [s.Product_Name],
  //         HSN_Code: [s.HSN_Code],
  //         Ordered_Quantity: [s.Ordered_Quantity],
  //         Rate: [s.Rate],
  //         SubTotal: [{
  //           value: s.Ordered_Quantity * s.Rate,
  //           disabled: true
  //         }]
  //       })
  //     );
  //   });
  // }
  editRequirement(SalesOrder_id: any) {

    const data = this.AllSaleorders.find(
      r => Number(r.SalesOrder_id) === Number(SalesOrder_id)
    );

    if (!data) {
      console.error('Sales Order not found:', SalesOrder_id);
      return;
    }

    console.log('Selected Sales Order:', data);

    this.SelectedSaleorder = 1;

    // ------------------------------------
    // Patch Sales Order Main Details
    // ------------------------------------
    this.UpdateSalesOrderform.patchValue({
      SalesOrder_id: data.SalesOrder_id,
      Customer_Name: data.Customer_Name,
      Company_Name: data.Company_Name,
      Company_Address: data.Company_Address,
      Delivery_Address: data.Delivery_Address,
      GST_No: data.GST_No,

      SubTotal: data.SubTotal || 0,
      Total_Amount: data.Total_Amount || 0,
      Discount_Amount: data.Discount_Amount || 0,
      CGST_amount: data.CGST_amount || 0,
      SGST_amount: data.SGST_amount || 0,
      Grand_Total: data.Grand_Total || 0,

      Remark: data.Remark || '',
      Sales_Order_Status: data.Sales_Order_Status || ''
    });

    // ------------------------------------
    // Clear Existing FormArray
    // ------------------------------------
    this.itemsupdate.clear();

    // ------------------------------------
    // Get Products
    // ------------------------------------
    const products =
      data.itemsupdate ||
      data.items ||
      data.SalesOrderItems ||
      data.products ||
      [];

    console.log('Products to patch:', products);

    // ------------------------------------
    // Patch Products
    // ------------------------------------
    products.forEach((s: any) => {

      const qty = Number(s.Ordered_Quantity) || 0;
      const rate = Number(s.Rate) || 0;

      this.itemsupdate.push(
        this.fb.group({
          SalesOrderItem_id: [s.SalesOrderItem_id || null],

          Product_Name: [
            s.Product_Name || '',
            Validators.required
          ],

          HSN_Code: [
            s.HSN_Code || ''
          ],

          Ordered_Quantity: [
            qty,
            Validators.required
          ],

          Rate: [
            rate,
            Validators.required
          ],

          SubTotal: [
            {
              value: qty * rate,
              disabled: true
            }
          ]
        })
      );

    });

    console.log(
      'FormArray after patch:',
      this.itemsupdate.value
    );
  }

  removeUpdateProduct(index: number) {
    this.itemsupdate.removeAt(index);
  }

  Update() {
    if (this.UpdateSalesOrderform.invalid) {
      this.UpdateSalesOrderform.markAllAsTouched();
      return;
    }
    const SalesOrder_id = this.UpdateSalesOrderform.get('SalesOrder_id')?.value;
    const formData = this.UpdateSalesOrderform.getRawValue();
    console.log('Updating Sales Order:', formData);
    this._rest.UpdateaSaleOrder(
      SalesOrder_id,
      formData
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          this.AllSalesOrderDetails();
          const modalElement =
            document.getElementById('exampleModal');
          if (modalElement) {
            const modal =
              bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
          console.log(
            'Sales Order Updated Successfully'
          );
        }
      },
      error: (error) => {
        console.error(
          'Update Sales Order failed:',
          error
        );
      }
    });
  }

  // Update() {
  //   if (this.UpdateSalesOrderform.invalid) {
  //     this.UpdateSalesOrderform.markAllAsTouched();
  //     return;
  //   }
  //   const SalesOrder_id = this.UpdateSalesOrderform.value.SalesOrder_id;
  //   const formData = this.UpdateSalesOrderform.value;
  //   this._rest.UpdateaSaleOrder(SalesOrder_id, formData).subscribe({
  //     next: (res: any) => {
  //       alert(res.message);
  //       this.AllSalesOrderDetails();
  //       if (res.success) {
  //         // Close modal
  //         const modalElement = document.getElementById('exampleModal');
  //         if (modalElement) {
  //           const modal = bootstrap.Modal.getInstance(modalElement);
  //           if (modal) {
  //             modal.hide();
  //           }
  //         }
  //         console.log('SalesOrder Updated Successfully');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Update failed:', error);
  //     }
  //   });
  // }

}