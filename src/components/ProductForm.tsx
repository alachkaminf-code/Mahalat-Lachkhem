import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2 } from 'lucide-react';
import type { Product, Category, Brand } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { productService, uploadService } from '../services/api';
import { useToast } from './Toast';

const schema = z.object({
  name_ar: z.string().min(1, 'Required'),
  name_en: z.string().min(1, 'Required'),
  description_ar: z.string().min(1, 'Required'),
  description_en: z.string().min(1, 'Required'),
  price: z.number().min(0, 'Must be positive'),
  discount_price: z.number().nullable().optional(),
  category_id: z.string().min(1, 'Required'),
  brand_id: z.string().min(1, 'Required'),
  stock: z.number().min(0, 'Must be positive'),
  image_url: z.string().optional().or(z.literal('')),
  featured: z.boolean(),
  best_seller: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, categories, brands, onClose, onSaved }: ProductFormProps) {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { showToast } = useToast();
  const token = session?.access_token || '';
  const [uploading, setUploading] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(product?.gallery || []);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name_ar: product.name_ar,
          name_en: product.name_en,
          description_ar: product.description_ar,
          description_en: product.description_en,
          price: Number(product.price),
          discount_price: product.discount_price ? Number(product.discount_price) : null,
          category_id: product.category_id,
          brand_id: product.brand_id,
          stock: Number(product.stock),
          image_url: product.image_url || '',
          featured: product.featured ?? false,
          best_seller: product.best_seller ?? false,
        }
      : undefined,
  });

  const imageUrl = watch('image_url');

  const handleImageUpload = async (file: File, field: 'main' | 'gallery') => {
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file, token);
      if (field === 'main') {
        setValue('image_url', url);
      } else {
        setGalleryUrls((prev) => [...prev, url]);
      }
      showToast('Image uploaded', 'success');
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { ...data, gallery: galleryUrls, specifications: product?.specifications || {} };
      if (product) {
        await productService.update(product.id, payload, token);
        showToast('Product updated', 'success');
      } else {
        await productService.create(payload, token);
        showToast('Product created', 'success');
      }
      onSaved();
      onClose();
    } catch {
      showToast('Failed to save product', 'error');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {product ? t('product.edit') : t('product.add')}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('product.name_ar')}</label>
              <input {...register('name_ar')} className={inputClass} dir="rtl" />
              {errors.name_ar && <p className="text-xs text-red-500 mt-1">{errors.name_ar.message}</p>}
            </div>
            <div>
              <label className={labelClass}>{t('product.name_en')}</label>
              <input {...register('name_en')} className={inputClass} dir="ltr" />
              {errors.name_en && <p className="text-xs text-red-500 mt-1">{errors.name_en.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('product.desc_ar')}</label>
              <textarea {...register('description_ar')} rows={3} className={inputClass} dir="rtl" />
              {errors.description_ar && <p className="text-xs text-red-500 mt-1">{errors.description_ar.message}</p>}
            </div>
            <div>
              <label className={labelClass}>{t('product.desc_en')}</label>
              <textarea {...register('description_en')} rows={3} className={inputClass} dir="ltr" />
              {errors.description_en && <p className="text-xs text-red-500 mt-1">{errors.description_en.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t('product.price')}</label>
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={inputClass} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className={labelClass}>{t('product.discount_price')}</label>
              <input type="number" step="0.01" {...register('discount_price', { valueAsNumber: true })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('product.stock_qty')}</label>
              <input type="number" {...register('stock', { valueAsNumber: true })} className={inputClass} />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('product.category')}</label>
              <select {...register('category_id')} className={inputClass}>
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_ar} / {c.name_en}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
            </div>
            <div>
              <label className={labelClass}>{t('product.brand')}</label>
              <select {...register('brand_id')} className={inputClass}>
                <option value="">—</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name_ar} / {b.name_en}</option>
                ))}
              </select>
              {errors.brand_id && <p className="text-xs text-red-500 mt-1">{errors.brand_id.message}</p>}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className={labelClass}>{t('product.image')}</label>
            <div className="flex items-center gap-3">
              {imageUrl && <img src={imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover" />}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-teal-500 text-sm text-slate-600 dark:text-slate-400">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                <span>{uploading ? t('common.loading') : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                />
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('product.gallery')}</label>
            <div className="flex flex-wrap gap-2">
              {galleryUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={url} alt="" className="w-full h-full rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-teal-500 flex items-center justify-center">
                {uploading ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Upload size={18} className="text-slate-400" />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gallery')}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('product.featured_flag')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('best_seller')} className="w-4 h-4 accent-teal-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('product.best_seller_flag')}</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {t('common.save')}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
