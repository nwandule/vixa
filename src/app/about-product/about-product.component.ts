import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.services';
import { Product } from '../models/product.model';


@Component({
  selector: 'app-about-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-product.component.html',
  styleUrl: './about-product.component.scss'
})
export class AboutProductComponent {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

async ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id'); // or however you get id
  if (id) {
    //this.product = await this.productService.getProductById(id) || {} as Product;
  }
}

}
