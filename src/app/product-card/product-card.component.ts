import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() index!: number;
  @Input() isAdmin: boolean = false;
  @Output() openModalEvent = new EventEmitter<{ mode: 'quote' | 'order', product: Product }>();

  openModal(mode: 'quote' | 'order') {
    this.openModalEvent.emit({ mode, product: this.product });
  }

  getDiscountedPrice(price: number, specialOffer?: number): number {
    if (specialOffer) {
      return price - (price * specialOffer / 100);
    }
    return price;
  }
}