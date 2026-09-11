import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {

  AllSaleorders: any[] = [];
  AllCustomerData: any[] = [];
  AddSalesaOrderform: FormGroup;
  submitted = false;

  pro:any;

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
        // this.createProduct()
      ])  // 🔥 REQUIRED
    })
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

}
