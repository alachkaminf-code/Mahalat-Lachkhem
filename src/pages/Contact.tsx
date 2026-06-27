import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    showToast(t('contact.sent'), 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('contact.title')}</h1>
          <p className="text-teal-100">{t('contact.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Phone size={22} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('common.phone')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">0550 12 34 56</p>
                  <p className="text-slate-600 dark:text-slate-300">0770 12 34 56</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Mail size={22} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('common.email')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">contact@lachkhem.dz</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('contact.locations')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{language === 'ar' ? 'الجزائر العاصمة، الجزائر' : 'Algiers, Algeria'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{t('contact.hours')}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{t('contact.hours_weekday')}</p>
                  <p className="text-slate-600 dark:text-slate-300">{t('contact.hours_friday')}</p>
                </div>
              </div>
            </div>

            <a href="https://wa.me/213550123456" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-green-500 hover:bg-green-600 rounded-2xl p-6 text-white transition">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold">{t('contact.whatsapp')}</h3>
                <p className="text-green-50 text-sm">0550 12 34 56</p>
              </div>
            </a>
          </div>

          {/* Map + Form */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik"
                className="w-full h-48"
                title="Store Location"
              />
              <div className="p-4 text-sm text-slate-600 dark:text-slate-300">{language === 'ar' ? 'شارع ديدوش مراد، الجزائر العاصمة' : 'Didouche Mourad Street, Algiers'}</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">{t('contact.send')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.form_name')}</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.form_email')}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.form_subject')}</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('contact.form_message')}</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} required className={inputClass} />
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {t('contact.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
