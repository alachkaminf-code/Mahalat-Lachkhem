import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-teal-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('page.not_found')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{t('page.404_desc')}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition">
          <Home size={18} /> {t('page.go_home')}
        </Link>
      </div>
    </div>
  );
}
