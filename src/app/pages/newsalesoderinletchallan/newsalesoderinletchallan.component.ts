import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-newsalesoderinletchallan',
  templateUrl: './newsalesoderinletchallan.component.html',
  styleUrls: ['./newsalesoderinletchallan.component.css']
})
export class NewsalesoderinletchallanComponent {

  AllSalesOrders: any[] = [];
  InletChallanForm!: FormGroup;
  SelectedSalesOrder: any = null;
  loading = false;
  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute, private fb: FormBuilder, private router: Router) { }
  ngOnInit(): void { this.CreateInletChallanForm(); this.GetAllSalesOrders(); }

  CreateInletChallanForm(): void {
    this.InletChallanForm = this.fb.group({
      Sales_Order_Number: [''],
      Customer_Name: [''],
      Company_Name: [''],
      Company_Address: [''],
      GST_No: [''],
      Delivery_Address: [''],
      Discount_Amount: [''],
      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: ['', Validators.minLength(10)],
      Remark: [''],
      Work_Status: ['In Queue'],
      Delivery_Status: ['Not Delivered'],
      Challan_Status: ['Open'],
      items: this.fb.array([])
    });
  }
  get items(): FormArray {
    return this.InletChallanForm.get(
      'items'
    ) as FormArray;
  }

  GetAllSalesOrders(): void {
    this.loading = true;
    this._rest.AllSalesOrders()
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.success) {
            this.AllSalesOrders = res.data || [];
          } else { }
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
  }
  // CONFIRM SALES ORDER
  ConfirmSalesOrder(SalesOrder_id: number): void {
    if (!confirm('Are you sure you want to confirm this Sales Order?')
    ) {
      return;
    }
    this._rest.ConfirmSalesOrder(SalesOrder_id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.GetAllSalesOrders();
        } else { }
      },
      error: (err) => { console.error(err); }
    });
  }
  // =====================================================
  // CREATE INLET CHALLAN BUTTON
  // =====================================================

  // CreateInletChallan(SalesOrder_id: number): void {
  //   console.log('Create Inlet Challan SalesOrder_id:', SalesOrder_id);
  //   this._rest.SalesOrderbyId(SalesOrder_id).subscribe({
  //     next: (res: any) => {
  //       console.log('Sales Order Response:', res);
  //       if (!res || !res.success) {
  //         console.error('Sales Order API failed:', res);
  //         return;
  //       }
  //       // API is returning data as ARRAY
  //       if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
  //         console.error('Sales Order not found. API returned:', res.data);
  //         alert('Sales Order details not found.');
  //         return;
  //       }
  //       // Get first Sales Order object
  //       const order = res.data[0];
  //       console.log('Selected Sales Order:', order);
  //       // IMPORTANT
  //       this.SelectedSalesOrder = order;
  //       console.log('Sales Order Status:', order.Sales_Order_Status);
  //       // Check status
  //       if (
  //         order.Sales_Order_Status !== 'Confirm' &&
  //         order.Sales_Order_Status !== 'Confirmed'
  //       ) {
  //         console.error(
  //           'Invalid status:',
  //           order.Sales_Order_Status
  //         );
  //         alert('Inlet Challan can be created only after Sales Order is confirmed.');
  //         return;
  //       }
  //       // Fill Form
  //       this.FillInletChallanForm(order);
  //       // Open Bootstrap Modal
  //       const modalElement =
  //         document.getElementById('createInletChallanModal');
  //       if (!modalElement) {
  //         console.error(
  //           'createInletChallanModal element not found.'
  //         );
  //         return;
  //       }
  //       const bootstrap = (window as any).bootstrap;
  //       if (!bootstrap) {
  //         console.error(
  //           'Bootstrap JavaScript is not loaded.'
  //         ); return;
  //       }
  //       const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  //       modal.show();
  //     },
  //     error: (err: any) => {
  //       console.error('Sales Order API Error:', err);
  //       alert('Unable to load Sales Order details.');
  //     }
  //   });
  // }

  
CreateInletChallan(SalesOrder_id: number): void {
  console.log('Requested Sales Order ID:', SalesOrder_id);

  if (!SalesOrder_id) {
    alert('Sales Order ID is missing. Check the ID field in your Sales Order table.');
    return;
  }

  this._rest.SalesOrderbyId(SalesOrder_id).subscribe({
    next: (res: any) => {
      console.log('Sales Order API Response:', res);

      if (!res || !res.success) {
        alert(res?.message || 'Unable to retrieve Sales Order.');
        return;
      }

      // Support either object or array response
      const data = res.data;
      const order = Array.isArray(data) ? data[0] : data;

      if (!order) {
        console.error('Sales Order data is empty:', res);
        alert('Sales Order not found. Check the Sales Order API and database ID.');
        return;
      }

      // Your database/backend uses SalesOrder_id.
      // Some of your Angular code uses Sales_Order_id.
      const id = order.SalesOrder_id ?? order.Sales_Order_id;

      if (!id) {
        console.error('Sales Order ID field is missing:', order);
        alert('Sales Order ID is missing from the API response.');
        return;
      }

      // Store a consistent ID for later submission.
      this.SelectedSalesOrder = {
        ...order,
        SalesOrder_id: id
      };

      console.log('Selected Sales Order ID:', id);
      console.log('Selected Sales Order Status:', order.Sales_Order_Status);

      if (
        order.Sales_Order_Status !== 'Confirm' &&
        order.Sales_Order_Status !== 'Confirmed'
      ) {
        alert('Inlet Challan can be created only after the Sales Order is confirmed.');
        return;
      }

      this.FillInletChallanForm(order);

      const modalElement = document.getElementById(
        'createInletChallanModal'
      );

      const bootstrap = (window as any).bootstrap;

      if (!modalElement || !bootstrap) {
        console.error('Modal element or Bootstrap JavaScript is missing.');
        return;
      }

      bootstrap.Modal.getOrCreateInstance(modalElement).show();
    },
    error: (err: any) => {
      console.error('Sales Order API Error:', err);
      alert(
        err.error?.message ||
        'Unable to load Sales Order details. Check the API endpoint and server logs.'
      );
    }
  });
}


  // =====================================================
  // FILL INLET CHALLAN FORM

  // FillInletChallanForm(order: any): void {
  //   this.items.clear();
  //   this.InletChallanForm.patchValue({
  //     Sales_Order_Number: order.Sales_Order_Number,
  //     Customer_Name: order.Customer_Name,
  //     Company_Name: order.Company_Name,
  //     Company_Address: order.Company_Address,
  //     GST_No: order.GST_No,
  //     Delivery_Address: order.Delivery_Address,
  //     Discount_Amount: order.Discount_Amount,
  //     Mode_of_Transport: '',
  //     Transporter_Name: '',
  //     Vehicle_Number: '',
  //     Remark: '',
  //     Work_Status: 'In Queue',
  //     Delivery_Status: 'Not Delivered',
  //     Challan_Status: 'Open',
  //   });
  //   // ADD SALES ORDER PRODUCTS
  //   if (
  //     order.items && order.items.length
  //   ) {
  //     order.items.forEach((item: any) => {
  //       this.items.push(
  //         this.fb.group({
  //           SalesOrderItem_id: [item.SalesOrderItem_id],
  //           Product_Name: [item.Product_Name],
  //           HSN_Code: [item.HSN_Code],
  //           Product_Quantity: [item.Ordered_Quantity, [Validators.required, Validators.min(1)]],

  //           Ordered_Quantity: [
  //             item.Ordered_Quantity,
  //             [Validators.required, Validators.min(0)]
  //           ],

  //           Produced_Quantity: [0, [Validators.min(0)]],
  //           Damaged_Quantity: [0, [Validators.min(0)]],
  //           Faulty_Quantity: [0, [Validators.min(0)]],

  //           Good_Quantity: [0],
  //           Extra_Quantity: [0],

  //           Rate: [item.Rate, [Validators.required, Validators.min(0)]]
  //         }));
  //     });
  //   }
  // }
  FillInletChallanForm(order: any): void {
    this.items.clear();

    this.InletChallanForm.patchValue({
      Sales_Order_Number: order.Sales_Order_Number,
      Customer_Name: order.Customer_Name,
      Company_Name: order.Company_Name,
      Company_Address: order.Company_Address,
      GST_No: order.GST_No,
      Delivery_Address: order.Delivery_Address,
      Mode_of_Transport: '',
      Transporter_Name: '',
      Vehicle_Number: '',
      Remark: '',
      Work_Status: 'In Queue',
      Delivery_Status: 'Not Delivered',
      Challan_Status: 'Open',
      Discount_Amount: 0
    });

    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const orderedQty = Number(item.Ordered_Quantity) || 0;

        this.items.push(
          this.fb.group({
            SalesOrderItem_id: [item.SalesOrderItem_id],

            Product_Name: [item.Product_Name],
            HSN_Code: [item.HSN_Code],

            // Existing challan quantity
            Product_Quantity: [
              orderedQty,
              [Validators.required, Validators.min(0)]
            ],

            // Production tracking
            Ordered_Quantity: [
              { value: orderedQty, disabled: true }
            ],

            Produced_Quantity: [
              0,
              [Validators.required, Validators.min(0)]
            ],

            Damaged_Quantity: [
              0,
              [Validators.required, Validators.min(0)]
            ],

            Faulty_Quantity: [
              0,
              [Validators.required, Validators.min(0)]
            ],

            Good_Quantity: [{ value: 0, disabled: true }],
            Extra_Quantity: [{ value: 0, disabled: true }],

            Rate: [
              Number(item.Rate) || 0,
              [Validators.required, Validators.min(0)]
            ]
          })
        );
      });
    }
  }

  // =====================================================
  // CALCULATE ITEM TOTAL
  // =====================================================

  GetItemTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = Number(item.get('Product_Quantity')?.value) || 0;
    const rate = Number(item.get('Rate')?.value) || 0;
    return quantity * rate;
  }

  // SUB TOTAL
  GetSubTotal(): number {
    let total = 0;
    this.items.controls.forEach((item) => {
      const quantity = Number(item.get('Product_Quantity')?.value) || 0;
      const rate = Number(item.get('Rate')?.value) || 0;
      total += quantity * rate;
    });
    return total;
  }

  // TOTAL AFTER DISCOUNT
  GetTotalAmount(): number {
    const subtotal = this.GetSubTotal();
    const discount = Number(this.InletChallanForm.get('Discount_Amount')?.value) || 0;
    return Math.max(subtotal - discount, 0);
  }

  // CGST
  GetCGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  // SGST
  GetSGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  // GRAND TOTAL
  GetGrandTotal(): number {
    return (
      this.GetTotalAmount() +
      this.GetCGST() +
      this.GetSGST()
    );
  }

  // SUBMIT
  // SubmitInletChallan(): void {
  //   if (this.InletChallanForm.invalid) { this.InletChallanForm.markAllAsTouched(); return; }
  //   const formValue = this.InletChallanForm.value;
  //   const payload = {
  //     Sales_Order_Number: formValue.Sales_Order_Number,
  //     Customer_Name: formValue.Customer_Name,
  //     Company_Name: formValue.Company_Name,
  //     Company_Address: formValue.Company_Address,
  //     GST_No: formValue.GST_No,
  //     Delivery_Address: formValue.Delivery_Address,
  //     Discount_Amount: formValue.Discount_Amount,
  //     Mode_of_Transport: formValue.Mode_of_Transport,
  //     Transporter_Name: formValue.Transporter_Name,
  //     Vehicle_Number: formValue.Vehicle_Number,
  //     Remark: formValue.Remark,
  //     Work_Status: formValue.Work_Status,
  //     Delivery_Status: formValue.Delivery_Status,
  //     Challan_Status: formValue.Challan_Status,

  //     // Discount_Amount: Number(formValue.Discount_Amount) || 0,
  //     items: formValue.items.map((item: any) => ({
  //       SalesOrderItem_id: item.SalesOrderItem_id,

  //       Product_Name: item.Product_Name,
  //       HSN_Code: item.HSN_Code,

  //       Product_Quantity: Number(item.Product_Quantity) || 0,
  //       Ordered_Quantity: Number(item.Ordered_Quantity) || 0,
  //       Produced_Quantity: Number(item.Produced_Quantity) || 0,
  //       Damaged_Quantity: Number(item.Damaged_Quantity) || 0,
  //       Faulty_Quantity: Number(item.Faulty_Quantity) || 0,

  
  //       Rate: Number(item.Rate) || 0
  //     }))

  //     // items: formValue.items.map(
  //     //   (item: any) => ({
  //     //     SalesOrderItem_id: item.SalesOrderItem_id,
  //     //     Product_Name: item.Product_Name,
  //     //     HSN_Code: item.HSN_Code,
  //     //     Product_Quantity: Number(item.Product_Quantity),
  //     //     Rate: Number(item.Rate)
  //     //   }))
  //   };

  //   console.log('Create Inlet Challan:', payload);
  //   this._rest.CreateInletChallanFromSalesOrder(this.SelectedSalesOrder.SalesOrder_id,
  //     payload).subscribe({
  //       next: (res: any) => {
  //         if (res.success) { // Close modal
  //           const modalElement = document.getElementById('createInletChallanModal');
  //           if (modalElement) {
  //             const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
  //             if (modal) {
  //               modal.hide();
  //             }
  //           }
  //           this.GetAllSalesOrders();
  //         } else {
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error(err);

  //         const message =
  //           err.error?.message || 'Something went wrong. Please try again.';

  //         alert(message);
  //       }
  //       // error: (err: any) => {
  //       //   console.error(err);
  //       // }
  //     });
  // }


  SubmitInletChallan(): void {
    if (this.InletChallanForm.invalid) {
      this.InletChallanForm.markAllAsTouched();
      return;
    }

    // Includes disabled controls
    const formValue = this.InletChallanForm.getRawValue();

    const payload = {
      Sales_Order_Number: formValue.Sales_Order_Number,
      Customer_Name: formValue.Customer_Name,
      Company_Name: formValue.Company_Name,
      Company_Address: formValue.Company_Address,
      GST_No: formValue.GST_No,
      Delivery_Address: formValue.Delivery_Address,

      Mode_of_Transport: formValue.Mode_of_Transport,
      Transporter_Name: formValue.Transporter_Name,
      Vehicle_Number: formValue.Vehicle_Number,
      Remark: formValue.Remark,

      Work_Status: formValue.Work_Status,
      Delivery_Status: formValue.Delivery_Status,
      Challan_Status: formValue.Challan_Status,

      Discount_Amount: Number(formValue.Discount_Amount) || 0,

      items: formValue.items.map((item: any) => ({
        SalesOrderItem_id: item.SalesOrderItem_id,
        Product_Name: item.Product_Name,
        HSN_Code: item.HSN_Code,

        Product_Quantity: Number(item.Product_Quantity) || 0,
        Ordered_Quantity: Number(item.Ordered_Quantity) || 0,
        Produced_Quantity: Number(item.Produced_Quantity) || 0,
        Damaged_Quantity: Number(item.Damaged_Quantity) || 0,
        Faulty_Quantity: Number(item.Faulty_Quantity) || 0,

        Rate: Number(item.Rate) || 0
      }))
    };

    console.log('Inlet Challan Payload:', payload);

    this._rest.CreateInletChallanFromSalesOrder(
      this.SelectedSalesOrder.Sales_Order_id,
      payload
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Inlet Challan created successfully!');

          const modalElement =
            document.getElementById('createInletChallanModal');

          if (modalElement) {
            (window as any).bootstrap.Modal
              .getInstance(modalElement)?.hide();
          }

          this.GetAllSalesOrders();
        } else {
          alert(res.message || 'Unable to create Inlet Challan.');
        }
      },
      error: (err: any) => {
        console.error('Create Inlet Challan Error:', err);
        alert(
          err.error?.message ||
          'An error occurred while creating the Inlet Challan.'
        );
      }
    });
  }

  // VIEW CHALLAN

  // ViewInletChallan(Sales_Order_Number: string): void {
  //   this.router.navigate( ['/InletchallanDataSaleOrder', Sales_Order_Number]  );
  // }

  ViewInletChallan(Sales_Order_Number: string): void {
    if (!Sales_Order_Number) {
      console.error('Sales Order Number is missing');
      return;
    }
    const encodedNumber = encodeURIComponent(Sales_Order_Number);
    console.log('Navigating to:', '/Home/InletchallanDataSaleOrder/' + encodedNumber);
    this.router.navigate(['/Home/InletchallanDataSaleOrder', encodedNumber]);
  }

  // ViewInletChallan(Sales_Order_Number: string): void {

  //   console.log(
  //     'Sales Order Number being sent:',
  //     Sales_Order_Number
  //   );

  //   this._rest.InletchallanbySaleorderNumber(
  //     Sales_Order_Number
  //   ).subscribe({

  //     next: (res: any) => {

  //       console.log(
  //         'Inlet Challan Response:',
  //         res
  //       );

  //     },

  //     error: (err) => {

  //       console.error(
  //         'Inlet Challan Error:',
  //         err
  //       );

  //     }

  //   });
  // }

  CalculateProduction(index: number): void {
    const item = this.items.at(index);

    const ordered = Number(
      item.get('Ordered_Quantity')?.value
    ) || 0;

    const produced = Number(
      item.get('Produced_Quantity')?.value
    ) || 0;

    const damaged = Number(
      item.get('Damaged_Quantity')?.value
    ) || 0;

    const faulty = Number(
      item.get('Faulty_Quantity')?.value
    ) || 0;

    // Prevent invalid production calculations
    if (
      produced < 0 ||
      damaged < 0 ||
      faulty < 0 ||
      damaged + faulty > produced
    ) {
      item.patchValue({
        Good_Quantity: 0,
        Extra_Quantity: 0
      }, { emitEvent: false });

      return;
    }

    const good = produced - damaged - faulty;
    const extra = Math.max(good - ordered, 0);

    item.patchValue({
      Good_Quantity: good,
      Extra_Quantity: extra
    }, { emitEvent: false });
  }

}
