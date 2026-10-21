import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiptserviceService } from 'src/app/services/receiptservice.service';

@Component({
  selector: 'app-vendorreceipts',
  templateUrl: './vendorreceipts.component.html',
  styleUrls: ['./vendorreceipts.component.css']
})
export class VendorreceiptsComponent {
  VendorChallan_id = 0;

  products: any[] = [];
  receipts: any[] = [];

  loading = false;
  saving = false;

  formData: any = {
    Received_Date: new Date().toISOString().slice(0, 10),
    Mode_of_Transport: '',
    Transporter_Name: '',
    Vehicle_Number: '',
    Vendor_Note: '',
    Internal_Remark: ''
  };

  constructor(
    private route: ActivatedRoute,
    private receiptService: ReceiptserviceService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.VendorChallan_id = Number(
        params.get('VendorChallan_id')
      );

      if (this.VendorChallan_id > 0) {
        this.loadPendingProducts();
        this.loadReceiptHistory();
      }
    });
  }

  loadPendingProducts(): void {
    this.loading = true;

    this.receiptService
      .getPendingProducts(this.VendorChallan_id)
      .subscribe({
        next: (response: any) => {
          this.products = (response.products || []).map(
            (product: any) => ({
              ...product,
              Received_Quantity: 0,
              Short_Quantity: 0,
              Receipt_Remark: '',
              operations: []
            })
          );

          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          alert('Failed to load vendor products.');
          this.loading = false;
        }
      });
  }

  loadReceiptHistory(): void {
    this.receiptService
      .getReceiptHistory(this.VendorChallan_id)
      .subscribe({
        next: (response: any) => {
          this.receipts = response.receipts || [];
        },
        error: (err: any) => {
          console.error(err);
          alert('Failed to load receipt history.');
        }
      });
  }

  getRemaining(product: any): number {
    return Number(product.Pending_Quantity || 0);
  }

  getWillRemain(product: any): number {
    return Math.max(
      0,
      this.getRemaining(product)
      - Number(product.Received_Quantity || 0)
      - Number(product.Short_Quantity || 0)
    );
  }

  get totalSent(): number {
    return this.products.reduce(
      (sum, p) => sum + Number(p.Sent_Quantity || 0),
      0
    );
  }

  get totalReceived(): number {
    return this.products.reduce(
      (sum, p) => sum + Number(p.Total_Received_Quantity || 0),
      0
    );
  }

  get totalPending(): number {
    return this.products.reduce(
      (sum, p) => sum + Number(p.Pending_Quantity || 0),
      0
    );
  }

  saveReceipt(): void {
    if (this.saving) return;

    const items = this.products
      .filter(p =>
        Number(p.Received_Quantity) > 0 ||
        Number(p.Short_Quantity) > 0
      )
      .map(p => ({
        VendorProduct_id: p.VendorProduct_id,
        Received_Quantity: Number(p.Received_Quantity || 0),
        Short_Quantity: Number(p.Short_Quantity || 0),
        Receipt_Remark: p.Receipt_Remark || '',
        operations: p.operations || []
      }));

    if (!items.length) {
      alert('Enter a received quantity or a confirmed short quantity.');
      return;
    }

    for (const item of items) {
      const product = this.products.find(
        p => p.VendorProduct_id === item.VendorProduct_id
      );

      if (
        item.Received_Quantity < 0 ||
        item.Short_Quantity < 0 ||
        item.Received_Quantity + item.Short_Quantity >
        Number(product.Pending_Quantity)
      ) {
        alert(
          `Invalid quantity for ${product.Product_Name}.`
        );
        return;
      }
    }

    const payload = {
      ...this.formData,
      items
    };

    this.saving = true;

    this.receiptService
      .createReceipt(this.VendorChallan_id, payload)
      .subscribe({
        next: (response: any) => {
          this.saving = false;

          alert(
            `${response.message}\n` +
            `Receipt: ${response.Receipt_Number}\n` +
            `Pending quantity: ${response.Pending_Quantity}`
          );

          this.formData.Vendor_Note = '';
          this.formData.Internal_Remark = '';

          this.loadPendingProducts();
          this.loadReceiptHistory();
        },
        error: (err: any) => {
          this.saving = false;

          alert(
            err.error?.message ||
            'Failed to save vendor receipt.'
          );
        }
      });
  }
}
