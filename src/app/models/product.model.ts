export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image: string;
  
  // Optional attributes
  firstName?: string;
  description?: string;
  phoneNumber?: string;
  quantity?: number;
  color?: string;
  specialOffer?: number;
  orderDate?: any;

  // Identifiers
  isOrdered?: boolean;
  isQuotes?: boolean;
  isProduct?: boolean;
}export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  image: string;
  
  // Optional attributes
  firstName?: string;
  description?: string;
  phoneNumber?: string;
  quantity?: number;
  color?: string;
  specialOffer?: number;
  orderDate?: any;

  // Identifiers
  isOrdered?: boolean;
  isQuotes?: boolean;
  isProduct?: boolean;
}