import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/Toast';
import { couponService } from '../services/api';
import { getProductName, formatPrice, getEffectivePrice } from '../utils/format';

export default function Cart() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items, updateQuantity, removeFromCart, subtotal, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const tax = subtotal * 0.19;
  const discountAmount = subtotal * (couponDiscount / 100);
  const total = subtotal - discountAmount + tax;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const coupon = await couponService.validate(couponInput.trim().toUpperCase());
      applyCoupon(coupon.code, coupon.discount_percent);
      showToast('Coupon applied!', 'success');
    } catch {
      showToast('Invalid coupon', 'error');
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('common.empty_cart')}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{language === 'ar' ? 'لم تقم بإضافة أي منتجات بعد' : 'You haven\'t added any products yet'}</p>
        <Link to="/products" className="inline-block px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition">
          {t('common.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('nav.cart')}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex gap-4">
              <Link to={`/products/${item.product.id}`} className="shrink-0">
                <img src={item.product.image_url || '/placeholder.png'} alt="" className="w-24 h-24 rounded-xl object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`} className="font-medium text-slate-900 dark:text-white hover:text-teal-600 line-clamp-2">
                  {getProductName(item.product, language)}
                </Link>
                <div className="text-teal-700 dark:text-teal-400 font-bold mt-1">{formatPrice(getEffectivePrice(item.product), t('common.currency'))}</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-s-lg">
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-e-lg">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1">
                    <Trash2 size={14} /> {t('common.remove')}
                  </button>
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className="font-bold text-slate-900 dark:text-white">{formatPrice(getEffectivePrice(item.product) * item.quantity, t('common.currency'))}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('checkout.order_summary')}</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 mb-3">
                <span className="text-sm text-green-700 dark:text-green-400 flex items-center gap-1">
                  <Tag size={14} /> {couponCode} (-{couponDiscount}%)
                </span>
                <button onClick={removeCoupon} className="text-red-500 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t('common.coupon_placeholder')}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button onClick={handleApplyCoupon} disabled={applying} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium disabled:opacity-50">
                  {t('common.apply')}
                </button>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('common.subtotal')}</span>
                <span>{formatPrice(subtotal, t('common.currency'))}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('common.discount')}</span>
                  <span>-{formatPrice(discountAmount, t('common.currency'))}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('common.tax')} (19%)</span>
                <span>{formatPrice(tax, t('common.currency'))}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('common.shipping')}</span>
                <span className="text-slate-400">{language === 'ar' ? 'يحسب عند الدفع' : 'Calculated at checkout'}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>{t('common.total')}</span>
                <span>{formatPrice(total, t('common.currency'))}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition shadow-sm"
            >
              {t('common.checkout')}
            </button>
            <Link to="/products" className="block text-center mt-2 text-sm text-teal-600 hover:underline">
              {t('common.continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
