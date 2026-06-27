import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductName, formatPrice, getEffectivePrice } from '../utils/format';

export default function Wishlist() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Heart size={40} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('common.empty_wishlist')}</h2>
        <Link to="/products" className="inline-block mt-4 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition">
          {t('common.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('nav.wishlist')} ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((product) => (
          <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex gap-4">
            <Link to={`/products/${product.id}`} className="shrink-0">
              <img src={product.image_url || '/placeholder.png'} alt="" className="w-24 h-24 rounded-xl object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product.id}`} className="font-medium text-slate-900 dark:text-white hover:text-teal-600 line-clamp-2">
                {getProductName(product, language)}
              </Link>
              <div className="text-teal-700 dark:text-teal-400 font-bold mt-1">{formatPrice(getEffectivePrice(product), t('common.currency'))}</div>
              <div className="flex items-center gap-2 mt-2">
                <Link to={`/products/${product.id}`} className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700">
                  {t('common.buy_now')}
                </Link>
                <button onClick={() => removeFromWishlist(product.id)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-500 text-xs font-medium hover:bg-red-50 dark:hover:bg-slate-700">
                  {t('common.remove')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
