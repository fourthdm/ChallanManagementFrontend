import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-challan',
  templateUrl: './challan.component.html',
  styleUrls: ['./challan.component.css']
})
export class ChallanComponent {

  AllChallan: any[] = [];
  AllVendorchallan: any[] = [];

  AllSaleorders: any[] = [];

  AllCustomerData: any[] = [];
  AllVendordata: any[] = [];

  Addinletchallanform: FormGroup;
  AddVendorChallanform: FormGroup;

  submitted = false;

  constructor(private _rest: RestService, private fb: FormBuilder, private _router: Router) {
    this.Addinletchallanform = this.fb.group({
      Sales_Order_Number: ['', [Validators.required]],
      Customer_Name: ['', [Validators.required]],
      Company_Name: ['', [Validators.required]],
      Company_Address: ['', [Validators.required]],
      GST_No: ['', [Validators.required]],
      Sub_Total: [''],
      Total_Amount: [''],
      Discount_Amount: [''],
      Delivery_Address: [''],
      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: ['', Validators.minLength(10)],
      Remark: [''],
      Work_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],
      items: this.fb.array([
        this.createProduct()
      ])  // 🔥 REQUIRED
    });

    this.AddVendorChallanform = this.fb.group({
      Vendor_Name: ['', [Validators.required]],
      Vendor_CompanyName: ['', [Validators.required]],
      Vendor_CompanyAddress: ['', [Validators.required]],
      VendorGST_No: ['', [Validators.required]],
      Vendor_Phoneno: ['', [Validators.required]],
      Vendor_Email: ['', [Validators.required]],
      Sub_Total: [''],
      Total_Amount: [''],
      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: [''],
      Remark: [''],
      Product_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],

      vendoritems: this.fb.array([
        this.VendorcreateProduct()
      ])
    });
  }



  ngOnInit(): void {
    this.initializeForm();

    this.Addinletchallanform
      .get('Sales_Order_Number')!
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((salesOrderNumber: string) => {
        this.autoFillBySalesOrder(salesOrderNumber);
      });

    // Recalculate whenever quantity, rate, or discount changes.
    this.items.valueChanges.subscribe(() => this.calculateGrandTotal());

    this.Addinletchallanform
      .get('Discount_Amount')!
      .valueChanges.subscribe(() => this.calculateGrandTotal());

    // Keep your existing API method that loads AllSaleorders.

    this.GetAllSalesOrders();


    this.AddVendorChallanform.get('Vendor_Name')!
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(VendorName => {
        this.autoFillbyVendor(VendorName);
        this.calculateVendorGrandTotal();
      });

    this.AllchallanDetails();
    this.AllVendorchallanDetails();
    this.GetAllCustomer();
    this.GetAllVendors();
  }

  AllchallanDetails() {
    this._rest.AllInletChallan().subscribe((data: any) => {
      console.log(data);
      this.AllChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  AllVendorchallanDetails() {
    this._rest.ALlvendorChallandata().subscribe((data: any) => {
      console.log(data);
      this.AllVendorchallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  GetAllCustomer() {
    this._rest.AllCustomer().subscribe((data: any) => {
      console.log(data);
      this.AllCustomerData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  GetAllVendors() {
    this._rest.AllVendor().subscribe((data: any) => {
      console.log(data);
      this.AllVendordata = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  GetAllSalesOrders(): void {
    this._rest.AllSalesOrders()
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.AllSaleorders = res.data || [];
          } else { }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }


  initializeForm(): void {
    this.Addinletchallanform = this.fb.group({
      Sales_Order_Number: ['', Validators.required],
      Customer_Name: ['', Validators.required],
      Company_Name: ['', Validators.required],
      Company_Address: ['', Validators.required],
      GST_No: ['', Validators.required],

      Delivery_Address: [''],
      Sub_Total: [{ value: 0, disabled: true }],
      Total_Amount: [{ value: 0, disabled: true }],
      Discount_Amount: [0, [Validators.min(0)]],

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

  createProduct(item?: any): FormGroup {
    return this.fb.group({
      SalesOrderItem_id: [item?.SalesOrderItem_id ?? null],
      Product_Name: [item?.Product_Name ?? '', Validators.required],
      HSN_Code: [item?.HSN_Code ?? ''],
      Product_Quantity: [
        item?.Ordered_Quantity ?? item?.Product_Quantity ?? 1,
        [Validators.required, Validators.min(1)]
      ],
      Rate: [
        item?.Rate ?? 0,
        [Validators.required, Validators.min(0)]
      ]
    });
  }

  get items(): FormArray {
    return this.Addinletchallanform.get('items') as FormArray;
  }

  addProduct(): void {
    this.items.push(this.createProduct());
  }

  removeProduct(index: number): void {
    this.items.removeAt(index);
    this.calculateGrandTotal();
  }

  autoFillBySalesOrder(salesOrderNumber: string): void {

    // Step 1: Always clear previously loaded products
    this.items.clear();

    if (!salesOrderNumber) {
      this.Addinletchallanform.patchValue({
        Customer_Name: '',
        Company_Name: '',
        Company_Address: '',
        GST_No: '',
        Delivery_Address: '',
        Discount_Amount: 0
      });

      this.calculateGrandTotal();
      return;
    }

    // Step 2: Find the selected sales order
    const order = this.AllSaleorders.find(
      (item: any) =>
        String(item.Sales_Order_Number) === String(salesOrderNumber)
    );

    if (!order) {
      console.error('Sales order not found:', salesOrderNumber);
      return;
    }

    // Step 3: Fill customer details
    this.Addinletchallanform.patchValue({
      Customer_Name: order.Customer_Name ?? '',
      Company_Name: order.Company_Name ?? '',
      Company_Address: order.Company_Address ?? '',
      GST_No: order.GST_No ?? '',
      Delivery_Address: order.Delivery_Address ?? '',
      Discount_Amount: Number(order.Discount_Amount) || 0
    });

    // Step 4: Add products only once
    const products = Array.isArray(order.items) ? order.items : [];

    products.forEach((product: any) => {
      this.items.push(this.createProduct(product));
    });

    // Step 5: Recalculate totals
    this.calculateGrandTotal();

    console.log('Loaded products:', this.items.value);
  }
  GetItemTotal(index: number): number {
    const item = this.items.at(index);

    const quantity = Number(item.get('Product_Quantity')?.value) || 0;
    const rate = Number(item.get('Rate')?.value) || 0;

    return quantity * rate;
  }

  GetSubTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const quantity = Number(control.get('Product_Quantity')?.value) || 0;
      const rate = Number(control.get('Rate')?.value) || 0;

      return total + quantity * rate;
    }, 0);
  }

  GetTotalAmount(): number {
    const subtotal = this.GetSubTotal();
    const discount =
      Number(this.Addinletchallanform.get('Discount_Amount')?.value) || 0;

    return Math.max(subtotal - discount, 0);
  }

  GetCGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  GetSGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  GetGrandTotal(): number {
    return this.GetTotalAmount() + this.GetCGST() + this.GetSGST();
  }

  calculateGrandTotal(): void {
    if (!this.Addinletchallanform) {
      return;
    }

    this.Addinletchallanform.patchValue({
      Sub_Total: this.GetSubTotal(),
      Total_Amount: this.GetTotalAmount()
    }, { emitEvent: false });
  }

  SubmitInletChallan(): void {
    this.submitted = true;

    if (this.Addinletchallanform.invalid) {
      this.Addinletchallanform.markAllAsTouched();

      console.log('Invalid form:', this.Addinletchallanform.getRawValue());
      console.log('Form errors:', this.Addinletchallanform.errors);

      alert('Please fill all required fields and check the product quantities and rates.');
      return;
    }

    if (this.items.length === 0) {
      alert('Please select a sales order containing products.');
      return;
    }

    this.calculateGrandTotal();

    const formData = this.Addinletchallanform.getRawValue();

    const payload = {
      ...formData,
      Sub_Total: this.GetSubTotal(),
      Total_Amount: this.GetTotalAmount(),
      Discount_Amount: Number(formData.Discount_Amount) || 0,
      CGST_amount: this.GetCGST(),
      SGST_amount: this.GetSGST(),
      Grand_Total: this.GetGrandTotal(),

      items: formData.items.map((item: any) => ({
        SalesOrderItem_id: item.SalesOrderItem_id,
        Product_Name: item.Product_Name,
        HSN_Code: item.HSN_Code,
        Product_Quantity: Number(item.Product_Quantity),
        Rate: Number(item.Rate)
      }))
    };

    console.log('Submitting Challan:', payload);

    this._rest.AddInletchallan(payload).subscribe({
      next: (res: any) => {
        alert(res.message || 'Inlet Challan created successfully.');

        this.submitted = false;
        this.items.clear();

        this.Addinletchallanform.reset({
          Sales_Order_Number: '',
          Customer_Name: '',
          Company_Name: '',
          Company_Address: '',
          GST_No: '',
          Delivery_Address: '',
          Sub_Total: 0,
          Total_Amount: 0,
          Discount_Amount: 0,
          Mode_of_Transport: '',
          Transporter_Name: '',
          Vehicle_Number: '',
          Remark: '',
          Work_Status: 'In Queue',
          Delivery_Status: 'Not Delivered',
          Challan_Status: 'Open',
          items: []
        });
      },
      error: (err: any) => {
        console.error('Create Challan Error:', err);
        alert(err.error?.message || 'Unable to create challan.');
      }
    });
  }


  //Vendor Added Code

  onOperationChange(event: any, index: number) {
    const selectedOptions = Array.from(event.target.selectedOptions)
      .map((option: any) => option.value);
    this.vendoritems.at(index).patchValue({
      Operation_Perform: selectedOptions
    });
  }

  VendorcreateProduct(): FormGroup {
    return this.fb.group({
      Product_Name: ['', Validators.required],
      HSN_Code: ['', Validators.required],
      Product_Quantity: [1],
      Rate: [0],
      SubTotal: [0],
      operations: this.fb.array([
        this.createOperation()
      ])
    });
  }

  createOperation(): FormGroup {
    return this.fb.group({
      Operation_Name: ['', Validators.required],
      Rate: [0, Validators.required]
    });
  }



  autoFillbyVendor(VendorName: string) {
    const req = this.AllVendordata.find(
      (r: any) => r.Vendor_Name === VendorName
    );

    if (!req) return;

    this.AddVendorChallanform.patchValue({
      Vendor_Name: req.Vendor_Name,
      Vendor_CompanyName: req.Vendor_CompanyName,
      VendorGST_No: req.VendorGST_No,
      Vendor_Phoneno: req.Vendor_Phoneno,
      Vendor_Email: req.Vendor_Email,
      Vendor_CompanyAddress: req.Vendor_CompanyAddress,
    }, { emitEvent: false });
  }

  get vendoritems(): FormArray {
    return this.AddVendorChallanform.get('vendoritems') as FormArray;
  }

  getOperations(productIndex: number): FormArray {
    return this.vendoritems
      .at(productIndex)
      .get('operations') as FormArray;
  }

  addOperation(productIndex: number) {
    this.getOperations(productIndex)
      .push(this.createOperation());
  }

  removeOperation(productIndex: number, operationIndex: number) {
    this.getOperations(productIndex)
      .removeAt(operationIndex);
    this.calculateProduct(productIndex);
  }

  calculateProduct(productIndex: number) {
    const product = this.vendoritems.at(productIndex);
    const operations = this.getOperations(productIndex);
    let totalRate = 0;
    operations.controls.forEach((op: any) => {
      totalRate += Number(op.get('Rate')?.value || 0);
    });

    // Set total rate of product
    product.get('Rate')?.setValue(totalRate, { emitEvent: false });
    const qty = Number(product.get('Product_Quantity')?.value || 0);
    const subtotal = qty * totalRate;
    product.get('SubTotal')?.setValue(subtotal, { emitEvent: false });
    this.calculateVendorGrandTotal();
  }
  calculateVendorGrandTotal() {
    let subtotal = 0;
    this.vendoritems.controls.forEach((p: any) => {
      subtotal += Number(p.value.SubTotal);
    });
    const total = subtotal;
    const cgst = total * 0.09;
    const sgst = total * 0.09;
    const grand = total + cgst + sgst;
    this.AddVendorChallanform.patchValue({
      Total_Amount: total,
      CGST_amount: cgst,
      SGST_amount: sgst,
      Grand_Total: grand
    });

  }

  VendorAddProduct() {
    this.vendoritems.push(
      this.VendorcreateProduct()
    );
  }

  removeVendorproduct(index: number) {
    this.vendoritems.removeAt(index);
  }

  saveVendorChallan() {
    this.submitted = true;
    if (this.AddVendorChallanform.invalid) {
      alert('Fill all required fields');
      return;
    }

    const formData = new FormData();
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    // HEADER DATA
    formData.append('Vendor_Name', this.AddVendorChallanform.value.Vendor_Name);
    formData.append('Vendor_CompanyName', this.AddVendorChallanform.value.Vendor_CompanyName);
    formData.append('VendorGST_No', this.AddVendorChallanform.value.VendorGST_No);
    formData.append('Vendor_Phoneno', this.AddVendorChallanform.value.Vendor_Phoneno);
    formData.append('Vendor_Email', this.AddVendorChallanform.value.Vendor_Email);
    formData.append('Vendor_CompanyAddress', this.AddVendorChallanform.value.Vendor_CompanyAddress);

    console.log(this.AddVendorChallanform.value);
    this._rest.NEWAddoutwardVendorchallan(
      this.AddVendorChallanform.value
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        console.log(res);
        this.AddVendorChallanform.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  CalculateVendorItems(index: number) {
    const Vendoritem = this.vendoritems.at(index);

    const Rate = +Vendoritem.get('Rate')!.value || 0;
    const Qty = +Vendoritem.get('Product_Quantity')!.value || 0;
    const SubTotal = Rate * Qty;

    Vendoritem.patchValue({
      SubTotal: SubTotal
    }, { emitEvent: false });
  }

}