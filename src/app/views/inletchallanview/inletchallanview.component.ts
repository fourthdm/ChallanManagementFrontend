import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

declare var bootstrap: any;

@Component({
  selector: 'app-inletchallanview',
  templateUrl: './inletchallanview.component.html',
  styleUrls: ['./inletchallanview.component.css']
})
export class InletchallanviewComponent {

  AllChallan: any[] = [];

  Updateinletchallanfrom: FormGroup;

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
    this.ByChallanid();
    this.loadHistory();
  }

  liked: boolean = false;

  Show() {
    this.liked != this.liked;
  }

  History: any = [];
  HeaderHistory: any = [];
  ProductHistory: any = [];

  loadHistory() {

    this._activatedroute.params.subscribe(params => {

      const Challan_id = params['Challan_id'];

      this._rest.GetInletHistory(Challan_id).subscribe((res: any) => {

        this.History = res.data || res;
        // this.HeaderHistory = res.data || res;
        // this.ProductHistory = res.data || res;

        this.HeaderHistory = res.headerHistory;
        this.ProductHistory = res.productHistory;

        this.HeaderHistory = this.HeaderHistory.map((x: any) => ({

          ...x,

          old_header: JSON.parse(x.old_header),

          new_header: JSON.parse(x.new_header)

        }));

        this.ProductHistory = this.ProductHistory.map((x: any) => ({

          ...x,

          old_product: x.old_product ? JSON.parse(x.old_product) : null,

          new_product: x.new_product ? JSON.parse(x.new_product) : null

        }));

        // this.History = this.History.map((item: any) => {

        //   return {

        //     ...item,

        //     old_header: item.old_header
        //       ? JSON.parse(item.old_header)
        //       : {},

        //     new_header: item.new_header
        //       ? JSON.parse(item.new_header)
        //       : {},

        //     old_product: item.old_product
        //       ? JSON.parse(item.old_product)
        //       : {},

        //     new_product: item.new_product
        //       ? JSON.parse(item.new_product)
        //       : {},
        //   };

        // });
        console.log(this.History);
      });

    });

    //  this._activatedroute.params.subscribe(params => {
    //   const Challan_id = params['Challan_id'];
    //   this._rest.GetInletHistory(Challan_id).subscribe((data: any) => {
    //     console.log(data);
    //   this.History = Array.isArray(data) ? data : [];
    //     // this.History = Array.isArray(data.data)
    //     //   ? data.data : [data.data];
    //   })
    // })

  }

  ByChallanid() {
    this._activatedroute.params.subscribe(params => {
      const Challan_id = params['Challan_id'];
      this._rest.InletchallanbyId(Challan_id).subscribe((data: any) => {
        console.log(data);
        this.AllChallan = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }
  printPdf(Challan_id: any) {
    this._rest.GetChallanPDF(Challan_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank');
    });
  }

  // printPdf(Challan_id: any) {
  //   this._rest.GetChallanPDF(Challan_id)
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


  addProduct() {
    this.items.push(
      this.createProduct()
    );
  }

  createProduct(): FormGroup {

    return this.fb.group({
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

        if (res.success) {
          // Close modal
          const modalElement = document.getElementById('exampleModal');

          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);

            if (modal) {
              modal.hide();
            }
          }

          // Optional: reload challan list
          this.ByChallanid();

          console.log('Challan updated successfully');
        }

      },
      error: (error) => {
        console.error('Update failed:', error);
      }
    });
  }

  selectedchallanId = 0;
  adminPassword = '';

  openDeleteModal(id: number) {
    this.selectedchallanId = id;
  }

  DeleteChallan() {
    this._rest.DeleteChallan(
      this.selectedchallanId,
      this.adminPassword
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          this.ByChallanid();
          this.adminPassword = '';
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }



}
