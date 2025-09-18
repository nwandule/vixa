import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, push, set, remove } from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private db: any;

  constructor() {
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
  }

  async getProducts(): Promise<Product[]> {
    const dbRef = ref(this.db);
    try {
      const snapshot = await get(child(dbRef, 'products'));
      const products: Product[] = [];
      if (snapshot.exists()) {
        const productsObj = snapshot.val();
        Object.keys(productsObj).forEach(key => {
          products.push({ id: key, ...productsObj[key] });
        });
      }
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  }

  async addProduct(product: Product): Promise<void> {
    const newRef = push(ref(this.db, 'products'));
    product.id = newRef.key || '';
    await set(newRef, product);
  }

  async updateProduct(product: Product, table: 'products' | 'orders' = 'products'): Promise<void> {
    if (!product.id) throw new Error('Product ID required');
    const productRef = ref(this.db, `${table}/${product.id}`);
    await set(productRef, { ...product, id: product.id });
  }

  async deleteProduct(id: string, table: 'products' | 'orders' = 'products'): Promise<void> {
    const productRef = ref(this.db, `${table}/${id}`);
    await remove(productRef);
  }

  async addOrder(order: Product): Promise<void> {
    const newRef = push(ref(this.db, 'orders'));
    order.id = newRef.key || '';
    await set(newRef, order);
  }

  async getOrders(): Promise<Product[]> {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, 'orders'));
    const orders: Product[] = [];
    if (snapshot.exists()) {
      const ordersObj = snapshot.val();
      Object.keys(ordersObj).forEach(key => {
        orders.push({ id: key, ...ordersObj[key] });
      });
    }
    return orders;
  }
}
