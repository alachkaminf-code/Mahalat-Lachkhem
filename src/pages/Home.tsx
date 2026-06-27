import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService, categoryService, brandService, testimonialService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getProductName, getCategoryName, getBrandName, formatPrice, getEffectivePrice, getDiscountPercent } from '../utils/format';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import type { Category, Brand } from '../types';

export default function Home() {
  const { t } = useTranslation();
  const { language, dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productService.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandService.getAll,
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getAll,
  });

  const popular = products.filter((p) => p.best_seller).slice(0, 8);
  const newest = [...products].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8);
  const discounted = products.filter((p) => getDiscountPercent(p) > 0).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-4">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              {t('home.seasonal_offers')}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">{t('home.hero_title')}</h1>
            <p className="text-lg text-teal-100 mb-8 max-w-lg">{t('home.hero_subtitle')}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition">
                {t('home.hero_cta')}
                <Arrow size={18} />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white font-semibold border border-white/20 transition">
                {t('nav.categories')}
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/products?category_id=${cat.id}`}
                  className={`bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition ${i % 2 === 1 ? 'translate-y-6' : ''}`}
                >
                  <div className="text-3xl mb-2">{cat.icon || '📦'}</div>
                  <div className="font-semibold">{getCategoryName(cat, language)}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: t('home.delivery_info'), desc: t('home.delivery_desc') },
            { icon: ShieldCheck, title: language === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee', desc: language === 'ar' ? 'منتجات أصلية ومضمونة' : 'Authentic products' },
            { icon: RefreshCw, title: language === 'ar' ? 'إرجاع سهل' : 'Easy Returns', desc: language === 'ar' ? 'إرجاع خلال 7 أيام' : '7-day return policy' },
            { icon: Headphones, title: language === 'ar' ? 'دعم 24/7' : '24/7 Support', desc: language === 'ar' ? 'فريق دعم متخصص' : 'Dedicated support team' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <item.icon size={22} className="text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader title={t('home.featured_categories')} link="/categories" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {categories.slice(0, 6).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title={t('home.popular_products')} link="/products?sort=popular" />
        <div className="mt-6">
          <ProductGrid products={popular} loading={isLoading} skeletonCount={4} />
        </div>
      </section>

      {/* Seasonal Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 sm:p-12">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('home.seasonal_offers')}</h2>
            <p className="text-amber-50 mb-4">{language === 'ar' ? 'خصومات تصل إلى 50% على مجموعة واسعة من المنتجات' : 'Up to 50% off on a wide range of products'}</p>
            <Link to="/products?has_discount=true" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-amber-600 font-semibold hover:bg-amber-50 transition">
              {t('common.view_all')} <Arrow size={18} />
            </Link>
          </div>
          <div className="absolute end-0 top-0 bottom-0 w-1/2 opacity-20 hidden sm:block">
            <div className="text-[200px] absolute end-4 top-1/2 -translate-y-1/2">🔥</div>
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <SectionHeader title={t('home.newest_products')} link="/products?sort=newest" />
        <div className="mt-6">
          <ProductGrid products={newest} loading={isLoading} skeletonCount={4} />
        </div>
      </section>

      {/* Discount Products */}
      {discounted.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader title={t('home.discount_products')} link="/products?has_discount=true" />
          <div className="mt-6">
            <ProductGrid products={discounted} loading={isLoading} skeletonCount={4} />
          </div>
        </section>
      )}

      {/* Featured Brands */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <SectionHeader title={t('home.featured_brands')} />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-center justify-center border border-slate-100 dark:border-slate-700 hover:shadow-lg transition"
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={getBrandName(brand, language)} className="max-h-12 object-contain" />
                ) : (
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-lg">{getBrandName(brand, language)}</span>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-slate-100 dark:bg-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title={t('home.testimonials')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {testimonials.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 font-bold text-lg">
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.city}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">"{language === 'ar' ? item.comment_ar : item.comment_en}"</p>
                  <div className="flex gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className={s < item.rating ? 'text-amber-400' : 'text-slate-300'}>★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Delivery Info */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4">
            <Truck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('home.delivery_info')}</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{t('home.delivery_desc')}</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-slate-900 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t('home.newsletter')}</h2>
          <p className="text-slate-400 mb-6">{t('home.newsletter_desc')}</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder={t('home.newsletter_placeholder')}
              className="flex-1 px-4 py-3 rounded-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="px-6 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition">
              {t('home.subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, link }: { title: string; link?: string }) {
  const { t } = useTranslation();
  const { dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {link && (
        <Link to={link} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
          {t('common.view_all')} <Arrow size={16} />
        </Link>
      )}
    </div>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const { language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/products?category_id=${category.id}`}
        className="block bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-teal-300 transition group"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">
          {category.icon || '📦'}
        </div>
        <div className="text-sm font-medium text-slate-900 dark:text-white">{getCategoryName(category, language)}</div>
      </Link>
    </motion.div>
  );
}
