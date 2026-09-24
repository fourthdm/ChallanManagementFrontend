import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';

declare var bootstrap: any;

@Component({
  selector: 'app-saleorderlist',
  templateUrl: './saleorderlist.component.html',
  styleUrls: ['./saleorderlist.component.css']
})
export class SaleorderlistComponent implements OnInit {

  AllSaleorders: any[] = [];
  AllCustomerData: any[] = [];
  UpdateSalesOrderform: FormGroup;
  submitted = false;

  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder) {

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

      itemsupdate: this.fb.array([
       this.createUpdatedProduct()
      ])
    })
  }

  ngOnInit(): void {
    this.AllSalesOrderDetails();
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
  
      this._rest.DeleteSalesOrder(
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
  


}
