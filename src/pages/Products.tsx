import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, Plus, Minus } from 'lucide-react';
import { productService, categoryService, brandService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getCategoryName, getBrandName } from '../utils/format';
import ProductGrid from '../components/ProductGrid';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import ProductForm from '../components/ProductForm';
import type { Product, Category, Brand } from '../types';

export default function Products() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isAdmin, session } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [brandId, setBrandId] = useState(searchParams.get('brand_id') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'all', refetchKey],
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

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name_ar.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q));
    }
    if (categoryId) result = result.filter((p) => p.category_id === categoryId);
    if (brandId) result = result.filter((p) => p.brand_id === brandId);
    if (minPrice) result = result.filter((p) => (p.discount_price ?? p.price) >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => (p.discount_price ?? p.price) <= Number(maxPrice));
    if (inStockOnly) result = result.filter((p) => p.stock > 0);

    if (sort === 'price_low') result.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
    else if (sort === 'price_high') result.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
    else if (sort === 'discount') result.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    else result.sort((a, b) => b.created_at.localeCompare(a.created_at));

    return result;
  }, [products, search, categoryId, brandId, minPrice, maxPrice, inStockOnly, sort]);

  const perPage = 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const updateSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    if (val) setSearchParams({ search: val });
  };

  const clearFilters = () => {
    setSearch(''); setCategoryId(''); setBrandId(''); setMinPrice(''); setMaxPrice(''); setInStockOnly(false); setSort('newest');
    setSearchParams({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id, session?.access_token || '');
      showToast('Product deleted', 'success');
      setRefetchKey((k) => k + 1);
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('common.search')}</label>
        <input
          type="text"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder={t('nav.search')}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('common.category')}</label>
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="">{t('common.view_all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{getCategoryName(c, language)}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('common.brand')}</label>
        <select value={brandId} onChange={(e) => { setBrandId(e.target.value); setPage(1); }} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option value="">{t('common.view_all')}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{getBrandName(b, language)}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('common.price')}</label>
        <div className="flex items-center gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <span className="text-slate-400">—</span>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
      </div>

      {/* In stock */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-teal-600" />
        <span className="text-sm text-slate-700 dark:text-slate-300">{t('common.in_stock')} فقط</span>
      </label>

      <button onClick={clearFilters} className="w-full py-2 text-sm text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-xl transition">
        {t('common.cancel')}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Add button */}
      {isAdmin && (
        <div className="mb-4">
          <button
            onClick={() => { setEditingProduct(null); setFormOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm"
          >
            + {t('product.add')}
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('common.filter')}</h3>
            </div>
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium">
              <SlidersHorizontal size={16} /> {t('common.filter')}
            </button>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} {t('nav.products')}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="newest">{t('sort.newest')}</option>
              <option value="price_low">{t('sort.price_low')}</option>
              <option value="price_high">{t('sort.price_high')}</option>
              <option value="popular">{t('sort.popular')}</option>
              <option value="discount">{t('sort.discount')}</option>
            </select>
          </div>

          <ProductGrid products={paged} loading={isLoading} skeletonCount={8} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Minus size={16} />
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl font-medium transition ${
                      page === p
                        ? 'bg-teal-600 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute end-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('common.filter')}</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Product form */}
      {formOpen && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          brands={brands}
          onClose={() => setFormOpen(false)}
          onSaved={() => setRefetchKey((k) => k + 1)}
        />
      )}
    </div>
  );
}

function getDiscountPercent(product: Product): number {
  if (!product.discount_price || product.discount_price >= product.price) return 0;
  return Math.round(((product.price - product.discount_price) / product.price) * 100);
}
