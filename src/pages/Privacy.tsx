import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

export default function Privacy() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const sections = language === 'ar' ? [
    { title: 'مقدمة', body: 'تحترم محلات لشخم خصوصية عملائنا وتلتزم بحماية بياناتهم الشخصية وفقاً للقوانين الجزائرية.' },
    { title: 'البيانات التي نجمعها', body: 'نجمع الاسم، البريد الإلكتروني، رقم الهاتف، وعنوان التوصيل عند إنشاء حساب أو إتمام طلب.' },
    { title: 'كيف نستخدم بياناتك', body: 'نستخدم بياناتك لمعالجة الطلبات، التواصل معك، وتحسين خدماتنا. لا نبيع بياناتك لأطراف ثالثة.' },
    { title: 'الأمان', body: 'نتخذ إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به.' },
    { title: 'حقوقك', body: 'يمكنك طلب الاطلاع على بياناتك أو تعديلها أو حذفها في أي وقت عبر التواصل معنا.' },
  ] : [
    { title: 'Introduction', body: 'Lachkhem Store respects the privacy of our customers and is committed to protecting their personal data in accordance with Algerian laws.' },
    { title: 'Data We Collect', body: 'We collect name, email, phone number, and delivery address when you create an account or place an order.' },
    { title: 'How We Use Your Data', body: 'We use your data to process orders, contact you, and improve our services. We do not sell your data to third parties.' },
    { title: 'Security', body: 'We take appropriate security measures to protect your data from unauthorized access.' },
    { title: 'Your Rights', body: 'You can request to view, modify, or delete your data at any time by contacting us.' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">{t('page.privacy')}</h1>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
