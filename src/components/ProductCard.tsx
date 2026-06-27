import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductName, getEffectivePrice, getDiscountPercent, formatPrice } from '../utils/format';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image_url || '/placeholder.png'}
            alt={getProductName(product, language)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">-{discount}%</span>
          )}
          {product.featured && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">{t('common.featured')}</span>
          )}
          {product.best_seller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">{t('common.best_seller')}</span>
          )}
          {outOfStock && (
            <span className="bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">{t('common.out_of_stock')}</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow flex items-center justify-center hover:scale-110 transition"
        >
          <Heart size={18} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'} />
        </button>

        {/* Quick view */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            to={`/products/${product.id}`}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-xl text-sm font-medium text-slate-900 dark:text-white shadow-lg hover:bg-teal-600 hover:text-white transition"
          >
            <Eye size={16} />
            {t('common.description')}
          </Link>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 min-h-[2.5rem] hover:text-teal-600 transition">
            {getProductName(product, language)}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs text-slate-400">(0)</span>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            {discount > 0 && (
              <div className="text-xs text-slate-400 line-through">{formatPrice(product.price, t('common.currency'))}</div>
            )}
            <div className="text-lg font-bold text-teal-700 dark:text-teal-400">{formatPrice(price, t('common.currency'))}</div>
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={outOfStock}
            className="w-9 h-9 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
