import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = 'lachkhem_cart';
const COUPON_KEY = 'lachkhem_coupon';

interface StoredCoupon {
  code: string;
  discount: number;
}

function loadStoredCoupon(): StoredCoupon | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    if (!raw) return null;
    // Support the old format where only the bare code string was stored
    // (no discount), which would otherwise silently apply a 0% discount.
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'code' in parsed) {
      return parsed as StoredCoupon;
    }
    return null;
  } catch {
    // Old format stored the raw code string, e.g. localStorage.getItem -> "SAVE20"
    const raw = localStorage.getItem(COUPON_KEY);
    return raw ? { code: raw, discount: 0 } : null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof localStorage === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const initialCoupon = loadStoredCoupon();
  const [couponCode, setCouponCode] = useState<string | null>(initialCoupon?.code ?? null);
  const [couponDiscount, setCouponDiscount] = useState(initialCoupon?.discount ?? 0);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setCouponDiscount(0);
    localStorage.removeItem(COUPON_KEY);
  };

  const applyCoupon = (code: string, discount: number) => {
    setCouponCode(code);
    setCouponDiscount(discount);
    localStorage.setItem(COUPON_KEY, JSON.stringify({ code, discount }));
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
    localStorage.removeItem(COUPON_KEY);
  };

  // If we loaded a coupon code from an old-format (pre-discount-persistence)
  // localStorage entry, its discount will be 0. Re-validate it against the
  // API so the customer doesn't end up checking out with a "0% discount"
  // silently applied while the code still shows as active.
  useEffect(() => {
    if (couponCode && couponDiscount === 0) {
      fetch(`/api/coupons?code=${encodeURIComponent(couponCode)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((coupon) => {
          if (coupon?.discount_percent) {
            applyCoupon(couponCode, coupon.discount_percent);
          } else {
            removeCoupon();
          }
        })
        .catch(() => removeCoupon());
    }
    // Only run on mount: intentionally not re-running when applyCoupon /
    // removeCoupon identities change, since they're stable for the
    // lifetime of this provider instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = i.product.discount_price ?? i.product.price;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
