import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Truck, Heart } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const values = [
    { icon: Award, title_ar: 'الجودة', title_en: 'Quality', desc_ar: 'نختار أفضل المنتجات لعملائنا', desc_en: 'We select the best products for our customers' },
    { icon: Truck, title_ar: 'التوصيل', title_en: 'Delivery', desc_ar: 'نوصل لكل ولايات الوطن', desc_en: 'We deliver to all wilayas' },
    { icon: Heart, title_ar: 'ثقة العملاء', title_en: 'Customer Trust', desc_ar: 'رضا عملائنا أولويتنا', desc_en: 'Customer satisfaction is our priority' },
    { icon: Users, title_ar: 'فريق محترف', title_en: 'Professional Team', desc_ar: 'فريق متخصص لخدمتكم', desc_en: 'Dedicated team to serve you' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">محلات لشخم — Lachkhem Store</h1>
            <p className="text-teal-100 max-w-2xl mx-auto">{t('footer.about_desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">{t('page.about')}</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
          <p>محلات لشخم هي وجهتك الأولى للأدوات والمواد المنزلية في الجزائر. تأسس المحل برؤية واضحة: توفير منتجات عالية الجودة بأسعار منافسة لكل الجزائريين.</p>
          <p>Lachkhem Store is your first destination for tools and household goods in Algeria. Founded with a clear vision: providing high-quality products at competitive prices for all Algerians.</p>
          <p>نقدم تشكيلة واسعة من المنتجات تشمل: الأدوات المنزلية، مواد البناء، الأجهزة الكهربائية، أدوات الحدائق، والكثير أكثر. مع خدمة توصيل لكل 58 ولاية.</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-100 dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">قيمنا</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                  <v.icon size={24} className="text-teal-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{v.title_ar}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{v.desc_ar}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            { num: '10K+', label_ar: 'منتج', label_en: 'Products' },
            { num: '58', label_ar: 'ولاية', label_en: 'Wilayas' },
            { num: '25K+', label_ar: 'عميل سعيد', label_en: 'Happy Customers' },
            { num: '15+', label_ar: 'سنة خبرة', label_en: 'Years Experience' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="text-3xl font-bold text-teal-600">{s.num}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label_ar}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
