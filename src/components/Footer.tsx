import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <div>
                <div className="font-bold text-white text-lg">محلات لشخم</div>
                <div className="text-xs text-slate-400">Lachkhem Store</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{t('footer.about_desc')}</p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition">
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-teal-400 transition">{t('nav.products')}</Link></li>
              <li><Link to="/categories" className="hover:text-teal-400 transition">{t('nav.categories')}</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">{t('nav.contact')}</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition">{t('nav.faq')}</Link></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('footer.customer_service')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-teal-400 transition">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-teal-400 transition">{t('footer.terms')}</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition">{t('footer.faq')}</Link></li>
              <li><Link to="/cart" className="hover:text-teal-400 transition">{t('nav.cart')}</Link></li>
              <li><Link to="/wishlist" className="hover:text-teal-400 transition">{t('nav.wishlist')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('footer.contact_us')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-teal-400" />
                <span>0550 12 34 56</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-teal-400" />
                <span>contact@lachkhem.dz</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-teal-400" />
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-2">{t('footer.payment_methods')}</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-slate-800 rounded text-xs">BaridiMob</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-xs">CIB</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-xs">Edahabia</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-xs">COD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} محلات لشخم — Lachkhem Store. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
}
