import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { AboutProductComponent } from './about-product/about-product.component';
import { MyOrdersComponent } from './my-orders-component/my-orders-component.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'product/:id',
    component: AboutProductComponent
  },
  { path: 'my-orders', 
    component: MyOrdersComponent 
  }
];

