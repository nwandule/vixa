import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

import { ProductCardComponent } from '../product-card/product-card.component';
import { AdminProductCardComponent } from '../admin-product-card/admin-product-card.component';
import { AddProductModalComponent } from '../product-modal/product-modal.component';
import { ContactCardComponent } from "../contact-card/contact-card.component";
import { InfoCardComponent } from "../info-card/info-card.component";
import { LoginComponent } from '../admin-login/admin-login.component';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.services';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    AdminProductCardComponent,
    AddProductModalComponent,
    ContactCardComponent,
    InfoCardComponent,
    LoginComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  showQuotesOnly = false;
  searchQuery = '';
  currentModalMode: 'quote' | 'order' | 'admin' = 'quote';
  selectedProduct: Product = {} as Product;
  isAdmin = false;
  @ViewChild('loginModal') loginModalRef!: ElementRef;
  loginModal!: Modal; 

  constructor(private productService: ProductService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    await this.loadProducts();
  }

  ngAfterViewInit() {
    if (this.loginModalRef) {
      // Use imported Modal class directly
      this.loginModal = new Modal(this.loginModalRef.nativeElement);
    }
  }

  async loadProducts() {
    this.products = await this.productService.getProducts();
    this.filterProducts();
  }

  filterProducts() {
    let tempProducts = this.products.slice();
    if (this.showQuotesOnly) tempProducts = tempProducts.filter(p => p.isQuotes);
    else tempProducts = tempProducts.filter(p => p.isOrdered || p.isProduct);

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(p =>
        (p.name || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query)
      );
    }

    this.filteredProducts = tempProducts;
  }

  toggleQuotes(showQuotes: boolean) {
    this.showQuotesOnly = showQuotes;
    this.filterProducts();
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.filterProducts();
  }

  async addProduct(payload: { product: Product; table: 'products' | 'orders' }) {
    const { product, table } = payload;
    try {
      if (product.id) await this.productService.updateProduct(product, table);
      else if (table === 'orders') await this.productService.addOrder(product);
      else await this.productService.addProduct(product);

      await this.loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please try again.');
    }
  }

  openModal(mode: 'quote' | 'order' | 'admin', product?: Product) {
    this.currentModalMode = mode;
    this.selectedProduct = product ? { ...product } : {
      id: '', name: '', category: '', price: 0, image: '',
      firstName: '', description: '', phoneNumber: '',
      quantity: 1, color: '', isProduct: true
    } as Product;

    const modalEl = document.getElementById('addProductModal');
    if (!modalEl) return;
    const modalInstance = Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
  }

  async deleteProduct(index: number) {
    const product = this.filteredProducts[index];
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const table = product.isOrdered ? 'orders' : 'products';
      await this.productService.deleteProduct(product.id, table);
      await this.loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }

  goToMyOrders() {
    this.router.navigate(['/my-orders']);
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.isAdmin = false;
  }


  openLoginModal() {
    if (this.loginModal) this.loginModal.show();
  }

  onLoginSuccess() {
    this.isAdmin = true;
    localStorage.setItem('isAdmin', 'true');
    if (this.loginModal) this.loginModal.hide();
  }
 

}
