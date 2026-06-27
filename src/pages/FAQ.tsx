import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const FAQS = [
  { q_ar: 'كيف يمكنني الطلب؟', q_en: 'How can I place an order?', a_ar: 'تصفح المنتجات، أضف ما تريد إلى السلة، ثم اذهب إلى صفحة الدفع وأكمل معلوماتك.', a_en: 'Browse products, add items to your cart, then go to checkout and complete your information.' },
  { q_ar: 'ما هي طرق الدفع المتاحة؟', q_en: 'What payment methods are available?', a_ar: 'نوفر الدفع عند الاستلام، BaridiMob، بطاقة CIB، والبطاقة الذهبية (Edahabia).', a_en: 'We offer Cash on Delivery, BaridiMob, CIB card, and Edahabia card.' },
  { q_ar: 'كم تستغرق مدة التوصيل؟', q_en: 'How long does delivery take?', a_ar: 'عادة بين 2 إلى 5 أيام عمل حسب الولاية.', a_en: 'Usually between 2 to 5 business days depending on the wilaya.' },
  { q_ar: 'هل يمكنني إرجاع المنتج؟', q_en: 'Can I return a product?', a_ar: 'نعم، يمكنك إرجاع المنتج خلال 7 أيام من الاستلام بشرط أن يكون في حالته الأصلية.', a_en: 'Yes, you can return a product within 7 days of delivery, provided it is in its original condition.' },
  { q_ar: 'هل التوصيل متاح لكل الولايات؟', q_en: 'Is delivery available to all wilayas?', a_ar: 'نعم، نوصل لكل 58 ولاية في الجزائر.', a_en: 'Yes, we deliver to all 58 wilayas in Algeria.' },
  { q_ar: 'كيف أتواصل مع خدمة العملاء؟', q_en: 'How do I contact customer service?', a_ar: 'يمكنك التواصل معنا عبر الهاتف، الواتساب، أو من خلال صفحة اتصل بنا.', a_en: 'You can contact us via phone, WhatsApp, or through the contact page.' },
];

export default function FAQ() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">{t('page.faq')}</h1>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-start"
              >
                <span className="font-medium text-slate-900 dark:text-white">{language === 'ar' ? faq.q_ar : faq.q_en}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform shrink-0 ms-2 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{language === 'ar' ? faq.a_ar : faq.a_en}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
