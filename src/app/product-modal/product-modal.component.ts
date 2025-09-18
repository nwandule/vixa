import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../models/product.model';
import { Modal } from 'bootstrap';
import { CommonModule, formatDate } from '@angular/common';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-modal.component.html',
})
export class AddProductModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  product: Product = {} as Product;
  selectedFile?: File;
  isSuccess = false;
  isLoading = false;
  db: any;
  originalProductId: string = '';

  @Output() productSaved = new EventEmitter<{ product: Product; table: 'products' | 'orders' }>();
  @Input() mode: 'quote' | 'order' | 'admin' = 'admin';
  @Input() selectedProduct: Product = {} as Product;

  ngOnInit(): void {
    const firebaseConfig = {
      apiKey: "AIzaSyC47T3jaAMUmUQ_728b5t4ZR6-vq0H_1hc",
      authDomain: "online-store-596d8.firebaseapp.com",
      databaseURL: "https://online-store-596d8-default-rtdb.firebaseio.com",
      projectId: "online-store-596d8",
      storageBucket: "online-store-596d8.firebasestorage.app",
      messagingSenderId: "858581524479",
      appId: "1:858581524479:web:efa653b7fb45a4d4f6d1ca",
      measurementId: "G-2KNPY1PWMH"
    };
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    getAnalytics(app);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProduct'] && this.selectedProduct) {
      if (this.mode === 'order' ) {
        this.product.firstName = '';
        this.product.phoneNumber = '';
        this.product.color = '';
        this.product.quantity = 0;
        this.product.name = this.selectedProduct.name || '';
        this.product.description = this.selectedProduct.description || '';
        this.product.image = this.selectedProduct.image || '';
        this.product.price = this.selectedProduct.price;
        this.originalProductId = this.selectedProduct.id || '';
        this.product.orderDate = new Date().toISOString();
        this.product.isOrdered = true;
        this.product.isQuotes = false;
        this.product.isProduct = false;
        console.log('date',this.product.orderDate)
      } else if (this.mode === 'quote' || this.mode=== 'admin') {
        this.product = { ...this.selectedProduct };
        this.originalProductId = this.selectedProduct.id || '';
        if(this.selectedProduct.price>0){
        this.product.isQuotes = false;
        this.product.isOrdered = false;
        this.product.isProduct = true;
        }else{
          this.product.isQuotes = true;
        this.product.isOrdered = false;
        this.product.isProduct = false;
        }
      }
    }
  }
onPriceChange(value: number) {
  if (value > 0) {
    this.product.isProduct = true;
    this.product.isQuotes = false;
  } else {
    this.product.isProduct = false;
  }
}
  private async addToDb(product: Product, table: 'products' | 'orders') {
    const dbRef = ref(this.db, table);
    const newRef = push(dbRef);
    const newId = newRef.key || '';
    product.id = newId;
    await set(newRef, { ...product, id: newId });
    return newId;
  }

  private async updateInDb(product: Product, table: 'products' | 'orders') {
    if (!product.id) throw new Error('Missing product id for update');
    const productRef = ref(this.db, `${table}/${product.id}`);
    await set(productRef, { ...product, id: product.id });
  }

  private async uploadProductFile(file: File): Promise<string> {
    const storage = getStorage();
    const imgRef = storageRef(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(imgRef, file);
    return getDownloadURL(imgRef);
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.product.image = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    const modalEl = document.getElementById('addProductModal');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || Modal.getOrCreateInstance(modalEl);
      modalInstance.hide();
    }
    this.resetForm();
  }

  resetForm() {
    this.isSuccess = false;
    this.isLoading = false;
    this.product = {} as Product;
    this.selectedFile = undefined;
    this.originalProductId = '';
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.isLoading = true;
    this.isSuccess = false;

    try {
      const table: 'products' | 'orders' = this.mode === 'order' ? 'orders' : 'products';

      if (this.selectedFile) {
        this.product.image = await this.uploadProductFile(this.selectedFile);
      }

      if (this.product.id) {
        if (!this.product.id && this.originalProductId) this.product.id = this.originalProductId;
        await this.updateInDb(this.product, table);
        console.log(`✅ Updated product in /${table}`, this.product.id);
      } else {
        const createdId = await this.addToDb(this.product, table);
        this.product.id = createdId;
        console.log(`✅ Created product in /${table}`, createdId);
      }

      this.productSaved.emit({ product: { ...this.product }, table });
      this.isSuccess = true;
      this.isLoading = false;

      form.resetForm();
      this.product = {} as Product;
      this.selectedFile = undefined;
      if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
      setTimeout(() => this.closeModal(), 1200);

    } catch (err: any) {
      console.error('❌ product-modal error', err?.message ?? err);
      this.isLoading = false;
      alert('Error saving product. Please try again.');
    }
  }
}
