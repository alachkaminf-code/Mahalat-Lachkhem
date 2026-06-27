import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { categoryService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getCategoryName } from '../utils/format';

export default function Categories() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">{t('nav.categories')}</h1>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-slate-500">{t('common.no_products')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category_id=${cat.id}`}
                className="block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition group"
              >
                <div className="aspect-video bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-5xl group-hover:scale-110 transition">
                  {cat.icon || '📦'}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{getCategoryName(cat, language)}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
