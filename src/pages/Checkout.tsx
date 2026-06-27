import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle, Truck, Home as HomeIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { orderService } from '../services/api';
import { WILAYAS, PAYMENT_METHODS } from '../utils/wilayas';
import { formatPrice } from '../utils/format';

export default function Checkout() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items, subtotal, couponDiscount, clearCart } = useCart();
  const { session } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const wilaya = WILAYAS.find((w) => w.code === Number(wilayaCode));
  const shippingCost = wilaya
    ? deliveryType === 'home'
      ? wilaya.home_delivery_cost
      : wilaya.shipping_cost
    : 0;
  const discountAmount = subtotal * (couponDiscount / 100);
  const tax = (subtotal - discountAmount) * 0.19;
  const total = subtotal - discountAmount + tax + shippingCost;

  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('checkout.order_placed')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-1">{t('checkout.order_number')}:</p>
        <p className="text-lg font-mono font-bold text-teal-600 mb-6">#{orderId.substring(0, 8).toUpperCase()}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/products" className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold">{t('common.continue_shopping')}</Link>
          <Link to="/profile?tab=orders" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">{t('nav.orders')}</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{t('common.empty_cart')}</p>
        <Link to="/products" className="px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold">{t('common.continue_shopping')}</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !wilayaCode || !address) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderService.create({
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        total,
        wilaya: wilaya?.name_en || '',
        address,
        phone,
        payment_method: paymentMethod,
        full_name: fullName,
      }, session?.access_token || '');
      setOrderId(order.id);
      clearCart();
      showToast('Order placed!', 'success');
    } catch {
      showToast('Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('checkout.customer_info')}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('common.full_name')}</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{t('common.phone')}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('checkout.shipping_address')}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>{t('common.wilaya')}</label>
                <select value={wilayaCode} onChange={(e) => setWilayaCode(e.target.value)} className={inputClass} required>
                  <option value="">—</option>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>{w.code} - {language === 'ar' ? w.name_ar : w.name_en}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>{t('common.address')}</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={inputClass} required />
            </div>
            {/* Delivery type */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('home')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${deliveryType === 'home' ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <HomeIcon size={18} className={deliveryType === 'home' ? 'text-teal-600' : 'text-slate-400'} />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{t('checkout.home_delivery')}</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('office')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${deliveryType === 'office' ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <Truck size={18} className={deliveryType === 'office' ? 'text-teal-600' : 'text-slate-400'} />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{t('checkout.office_delivery')}</span>
              </button>
            </div>
            {wilaya && (
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2">
                {t('common.shipping')}: <span className="font-bold text-teal-600">{formatPrice(shippingCost, t('common.currency'))}</span>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('checkout.payment')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${paymentMethod === pm.id ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{language === 'ar' ? pm.name_ar : pm.name_en}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('checkout.order_summary')}</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-2 text-sm">
                  <img src={item.product.image_url || '/placeholder.png'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-900 dark:text-white truncate text-xs">{language === 'ar' ? item.product.name_ar : item.product.name_en}</div>
                    <div className="text-slate-500 text-xs">x{item.quantity}</div>
                  </div>
                  <div className="text-slate-900 dark:text-white text-xs font-medium">{formatPrice((item.product.discount_price ?? item.product.price) * item.quantity, t('common.currency'))}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-slate-100 dark:border-slate-700 pt-3">
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
                <span>{t('common.tax')}</span>
                <span>{formatPrice(tax, t('common.currency'))}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('common.shipping')}</span>
                <span>{formatPrice(shippingCost, t('common.currency'))}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>{t('common.total')}</span>
                <span>{formatPrice(total, t('common.currency'))}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {t('checkout.place_order')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
