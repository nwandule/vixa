import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-admin-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product-card.component.html',
  styleUrls: ['./admin-product-card.component.scss']
})
export class AdminProductCardComponent {
  @Input() product!: Product;
  @Input() index!: number;
  @Output() editEvent = new EventEmitter<Product>();
  @Output() deleteEvent = new EventEmitter<number>();
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
  editProduct() {
    this.editEvent.emit(this.product);
  }

  deleteProduct() {
    this.deleteEvent.emit(this.index);
  }

  getDiscountedPrice(price: number, specialOffer?: number): number {
    if (specialOffer) {
      return price - (price * specialOffer / 100);
    }
    return price;
  }
}