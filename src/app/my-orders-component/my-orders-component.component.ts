import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.services';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-orders-component.component.html',
  styleUrls: ['./my-orders-component.component.scss']
})
export class MyOrdersComponent {
  orders: Product[] = [];
  searchQuery = '';

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    this.orders = await this.productService.getOrders();
    this.filterOrders();
  }

  filterOrders() {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.orders = this.orders.filter(order =>
        (order.firstName || '').toLowerCase().includes(query) ||
        (order.phoneNumber || '').toLowerCase().includes(query) ||
        (order.name || '').toLowerCase().includes(query) ||
        (order.color || '').toLowerCase().includes(query)
      );
    }
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.filterOrders();
  }

  async deleteOrder(orderId: string) {
    if (!orderId) return;
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      await this.productService.deleteProduct(orderId, 'orders');
      await this.loadOrders(); // refresh orders after delete
    }
  }
}
