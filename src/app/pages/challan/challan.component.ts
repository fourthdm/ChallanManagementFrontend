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

  AllCustomerData: any[] = [];
  AllVendordata: any[] = [];

  Addinletchallanform: FormGroup;
  AddVendorChallanform: FormGroup;

  submitted = false;

  constructor(private _rest: RestService, private fb: FormBuilder, private _router: Router) {
    this.Addinletchallanform = this.fb.group({
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
      Vehicle_Number: [''],
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

  onOperationChange(event: any, index: number) {
    const selectedOptions = Array.from(event.target.selectedOptions)
      .map((option: any) => option.value);
    this.vendoritems.at(index).patchValue({
      Operation_Perform: selectedOptions
    });
  }

  // VendorcreateProduct(): FormGroup {
  //   return this.fb.group({
  //     Product_Name: ['', Validators.required],
  //     HSN_Code: ['', Validators.required],
  //     Product_Quantity: [1, Validators.required],
  //     Rate: [0],
  //     SubTotal: [0],
  //     operations: this.fb.array([
  //       this.createOperation()
  //     ])
  //   });
  // }
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

  // VendorcreateProduct(): FormGroup {
  //   return this.fb.group({
  //     Product_Name: ['', Validators.required],
  //     HSN_Code: ['', Validators.required],

  //     Operation_Perform: [[], Validators.required], // Array

  //     Product_Quantity: ['', Validators.required],
  //     Rate: ['', Validators.required],
  //     SubTotal: []
  //   });
  // }

  ngOnInit(): void {

    this.Addinletchallanform.get('Customer_Name')!
      .valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(customerName => {
        this.autoFillByRequirement(customerName);
        this.calculateGrandTotal();
      });

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

  // calculateProduct(productIndex: number) {
  //   const product = this.vendoritems.at(productIndex);
  //   const qty = Number(product.get('Product_Quantity')?.value);
  //   const operations = this.getOperations(productIndex).value;

  //   let rate = 0;
  //   operations.forEach((x: any) => {
  //     rate += Number(x.Rate);
  //   });
  //   product.patchValue({
  //     Rate: rate,
  //     SubTotal: rate * qty
  //   }, { emitEvent: false });

  //   this.calculateGrandTotal();
  // }

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

  createProduct(): FormGroup {
    return this.fb.group({
      Product_Name: ['', Validators.required],
      HSN_Code: ['', Validators.required],
      Product_Quantity: ['', Validators.required],
      Rate: ['', Validators.required],
      SubTotal: []
    });
  }

  autoFillByRequirement(customerName: string) {
    const req = this.AllCustomerData.find(
      (r: any) => r.Customer_Name === customerName
    );

    if (!req) return;

    this.Addinletchallanform.patchValue({
      Company_Name: req.Company_Name,
      Company_Address: req.Company_Address,
      GST_No: req.GST_No,
      Delivery_Address: req.Delivery_Address,
    }, { emitEvent: false }); // ✅ STOP LOOP
  }

  get items(): FormArray {
    return this.Addinletchallanform.get('items') as FormArray;
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
    if (this.Addinletchallanform.invalid) {
      alert('Fill all required fields');
      return;
    }

    const formData = new FormData();
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    // HEADER DATA
    formData.append('Customer_Name', this.Addinletchallanform.value.Customer_Name);
    formData.append('Company_Name	', this.Addinletchallanform.value.Company_Name);
    formData.append('Company_Address', this.Addinletchallanform.value.Company_Address);
    formData.append('GST_No', this.Addinletchallanform.value.GST_No);
    formData.append('Delivery_Address', this.Addinletchallanform.value.Delivery_Address);

    console.log(this.Addinletchallanform.value);
    this._rest.AddInletchallan(
      this.Addinletchallanform.value
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        console.log(res);
        this.Addinletchallanform.reset();
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
    const Quantity = +item.get('Product_Quantity')!.value || 0;

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
      Number(this.Addinletchallanform.get('Discount_Amount')?.value) || 0;

    const totalAmount = subTotal - discount;

    this.Addinletchallanform.patchValue({

      Sub_Total: subTotal,
      Total_Amount: totalAmount

    }, { emitEvent: false });

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

}
