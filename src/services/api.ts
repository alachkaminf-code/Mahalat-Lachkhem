import type { Product, Category, Brand, Review, Testimonial, Order, UserProfile } from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const productService = {
  async getAll(params?: {
    category_id?: string;
    brand_id?: string;
    featured?: boolean;
    best_seller?: boolean;
    has_discount?: boolean;
    search?: string;
    sort?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) query.set(key, String(value));
      });
    }
    const qs = query.toString();
    return fetchJSON<Product[]>(`${API_BASE}/products${qs ? `?${qs}` : ''}`);
  },

  async getById(id: string): Promise<Product> {
    const all = await fetchJSON<Product[]>(`${API_BASE}/products`);
    const product = all.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async create(product: Partial<Product>, token: string): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(product),
    });
  },

  async update(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ id, ...updates }),
    });
  },

  async delete(id: string, token: string): Promise<void> {
    await fetchJSON(`${API_BASE}/products`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ id }),
    });
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return fetchJSON<Category[]>(`${API_BASE}/categories`);
  },
  async create(category: Partial<Category>, token: string): Promise<Category> {
    return fetchJSON<Category>(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(category),
    });
  },
};

export const brandService = {
  async getAll(): Promise<Brand[]> {
    return fetchJSON<Brand[]>(`${API_BASE}/brands`);
  },
  async create(brand: Partial<Brand>, token: string): Promise<Brand> {
    return fetchJSON<Brand>(`${API_BASE}/brands`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(brand),
    });
  },
};

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    return fetchJSON<Review[]>(`${API_BASE}/reviews?product_id=${productId}`);
  },
  async create(review: Partial<Review>, token: string): Promise<Review> {
    return fetchJSON<Review>(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(review),
    });
  },
};

export const couponService = {
  async validate(code: string): Promise<{ code: string; discount_percent: number }> {
    return fetchJSON(`${API_BASE}/coupons?code=${encodeURIComponent(code)}`);
  },
};

export const orderService = {
  async getMyOrders(token: string): Promise<Order[]> {
    return fetchJSON<Order[]>(`${API_BASE}/orders`, { headers: getAuthHeaders(token) });
  },
  async create(order: Partial<Order>, token: string): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(order),
    });
  },
};

export const profileService = {
  async get(token: string): Promise<UserProfile> {
    return fetchJSON<UserProfile>(`${API_BASE}/profile`, { headers: getAuthHeaders(token) });
  },
  async update(updates: Partial<UserProfile>, token: string): Promise<UserProfile> {
    return fetchJSON<UserProfile>(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates),
    });
  },
};

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    return fetchJSON<Testimonial[]>(`${API_BASE}/testimonials`);
  },
};

export const uploadService = {
  async uploadImage(file: File, token: string): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = reader.result?.toString().split(',')[1] || '';
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ fileName: file.name, fileBase64: base64, contentType: file.type }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Upload failed');
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
