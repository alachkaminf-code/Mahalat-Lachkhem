import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Minus, Plus, Star, Truck, ShieldCheck, RefreshCw, Check, Pencil, Trash2 } from 'lucide-react';
import { productService, categoryService, brandService, reviewService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { getProductName, getProductDescription, getCategoryName, getBrandName, formatPrice, getEffectivePrice, getDiscountPercent } from '../utils/format';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import type { Product, Category, Brand } from '../types';

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAdmin, session } = useAuth();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'all', refetchKey],
    queryFn: () => productService.getAll(),
  });

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll });
  const { data: brands = [] } = useQuery({ queryKey: ['brands'], queryFn: brandService.getAll });

  const product = products.find((p) => p.id === id);
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getByProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">{t('common.no_products')}</p>
        <Link to="/products" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-teal-600 text-white font-medium">{t('common.continue_shopping')}</Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const brand = brands.find((b) => b.id === product.brand_id);
  const discount = getDiscountPercent(product);
  const price = getEffectivePrice(product);
  const outOfStock = product.stock <= 0;
  const inWishlist = isInWishlist(product.id);
  const gallery = [product.image_url, ...(product.gallery || [])].filter(Boolean);
  const related = products.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(t('common.add_to_cart'), 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(product.id, session?.access_token || '');
      showToast('Product deleted', 'success');
      navigate('/products');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-teal-600">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-teal-600">{t('nav.products')}</Link>
        {category && (<><span>/</span><Link to={`/products?category_id=${category.id}`} className="hover:text-teal-600">{getCategoryName(category, language)}</Link></>)}
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={gallery[activeImage] || '/placeholder.png'}
              alt={getProductName(product, language)}
              className={`w-full h-full object-cover transition-transform duration-300 ${zoom ? 'scale-150' : 'scale-100'}`}
            />
            {discount > 0 && (
              <span className="absolute top-4 start-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow">-{discount}%</span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${activeImage === i ? 'border-teal-600' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {brand && (
            <Link to={`/products?brand_id=${brand.id}`} className="text-sm text-teal-600 font-medium hover:underline">{getBrandName(brand, language)}</Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-2">{getProductName(product, language)}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
              ))}
            </div>
            <span className="text-sm text-slate-500">({reviews.length} {t('common.reviews')})</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-bold text-teal-700 dark:text-teal-400">{formatPrice(price, t('common.currency'))}</span>
            {discount > 0 && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.price, t('common.currency'))}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full" /> {t('common.out_of_stock')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Check size={14} /> {t('common.in_stock')} ({product.stock})
              </span>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-s-xl">
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium text-slate-900 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-e-xl">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${inWishlist ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Heart size={18} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ShoppingCart size={20} /> {t('common.add_to_cart')}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              {t('common.buy_now')}
            </button>
          </div>

          {/* Admin buttons */}
          {isAdmin && (
            <div className="flex gap-2 mb-6">
              <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-300 text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 text-sm font-medium">
                <Pencil size={16} /> {t('common.edit')}
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 text-sm font-medium">
                <Trash2 size={16} /> {t('common.delete')}
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 dark:border-slate-800">
            {[
              { icon: Truck, label: t('common.shipping') },
              { icon: ShieldCheck, label: language === 'ar' ? 'ضمان' : 'Warranty' },
              { icon: RefreshCw, label: language === 'ar' ? 'إرجاع' : 'Returns' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <item.icon size={20} className="text-teal-600" />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('common.description')}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{getProductDescription(product, language)}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('common.specifications')}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
            {category && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-slate-500">{t('common.category')}</span>
                <span className="font-medium text-slate-900 dark:text-white">{getCategoryName(category, language)}</span>
              </div>
            )}
            {brand && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-slate-500">{t('common.brand')}</span>
                <span className="font-medium text-slate-900 dark:text-white">{getBrandName(brand, language)}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-slate-500">{t('common.stock')}</span>
              <span className="font-medium text-slate-900 dark:text-white">{product.stock}</span>
            </div>
            {Object.entries(product.specifications || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-slate-500">{key}</span>
                <span className="font-medium text-slate-900 dark:text-white">{val[language] || val.ar || val.en}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('common.reviews')} ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">{language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">{r.user_name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={14} className={s < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('common.related')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {formOpen && (
        <ProductForm
          product={product}
          categories={categories}
          brands={brands}
          onClose={() => setFormOpen(false)}
          onSaved={() => setRefetchKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
