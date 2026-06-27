export type Language = 'ar' | 'en';

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  discount_price: number | null;
  category_id: string;
  brand_id: string;
  stock: number;
  image_url: string;
  gallery: string[];
  featured: boolean;
  best_seller: boolean;
  specifications: Record<string, { ar: string; en: string }>;
  created_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  image_url: string;
  created_at: string;
}

export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  logo_url: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Coupon {
  code: string;
  discount_percent: number;
  active: boolean;
}

export interface Wilaya {
  code: number;
  name_ar: string;
  name_en: string;
  shipping_cost: number;
  home_delivery_cost: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment_ar: string;
  comment_en: string;
  avatar: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  wilaya: string;
  address: string;
  phone: string;
  payment_method: string;
  full_name?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  wilaya: string;
  details: string;
  phone: string;
}
