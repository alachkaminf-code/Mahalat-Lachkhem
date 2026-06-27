import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, Heart, LogOut, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../components/Toast';
import { orderService, profileService } from '../services/api';
import { WILAYAS } from '../utils/wilayas';
import { formatPrice } from '../utils/format';
import type { Order } from '../types';

export default function Profile() {
  const { t } = useTranslation();
  const { user, session, signOut } = useAuth();
  const { items: wishItems } = useWishlist();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'info');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      orderService.getMyOrders(session?.access_token || '').then((data) => {
        setOrders(data);
      }).catch(() => {}).finally(() => setLoadingOrders(false));

      profileService.get(session?.access_token || '').then((p) => {
        setFullName(p.full_name || '');
        setPhone(p.phone || '');
      }).catch(() => {
        setFullName(user.user_metadata?.full_name || '');
      });
    }
  }, [user, session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileService.update({ full_name: fullName, phone }, session?.access_token || '');
      showToast('Profile updated', 'success');
    } catch {
      showToast('Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'info', label: t('profile.personal_info'), icon: User },
    { id: 'orders', label: t('profile.orders'), icon: Package },
    { id: 'wishlist', label: t('profile.wishlist'), icon: Heart },
    { id: 'settings', label: t('profile.settings'), icon: Settings },
  ];

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('profile.title')}</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 font-bold text-lg">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-900 dark:text-white truncate text-sm">{fullName || user?.email}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => { setTab(tb.id); setSearchParams({ tab: tb.id }); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === tb.id ? 'bg-teal-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  <tb.icon size={18} /> {tb.label}
                </button>
              ))}
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} /> {t('nav.logout')}
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'info' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('profile.personal_info')}</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('common.full_name')}</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('common.email')}</label>
                  <input value={user?.email || ''} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('common.phone')}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="0550 12 34 56" />
                </div>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {t('common.save')}
                </button>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('profile.orders')}</h2>
              {loadingOrders ? (
                <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-teal-600" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={40} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500">{t('profile.no_orders')}</p>
                  <Link to="/products" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium">{t('common.continue_shopping')}</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold text-teal-600">#{order.id.substring(0, 8).toUpperCase()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{formatPrice(order.total, t('common.currency'))}</div>
                      <div className="text-xs text-slate-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('profile.wishlist')} ({wishItems.length})</h2>
              {wishItems.length === 0 ? (
                <p className="text-slate-500 text-center py-8">{t('common.empty_wishlist')}</p>
              ) : (
                <div className="space-y-3">
                  {wishItems.map((p) => (
                    <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                      <img src={p.image_url || '/placeholder.png'} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white text-sm truncate">{language === 'ar' ? p.name_ar : p.name_en}</div>
                        <div className="text-teal-600 font-bold text-sm">{formatPrice(p.discount_price ?? p.price, t('common.currency'))}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('profile.settings')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm">{language === 'ar' ? 'العنوان المحفوظ' : 'Saved Address'}</div>
                    <div className="text-xs text-slate-500">{t('profile.no_addresses')}</div>
                  </div>
                  <button className="text-teal-600 text-sm font-medium flex items-center gap-1">
                    <Plus size={14} /> {t('profile.add_address')}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white text-sm">{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</div>
                  </div>
                  <Link to="/forgot-password" className="text-teal-600 text-sm font-medium">{t('auth.reset')}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
