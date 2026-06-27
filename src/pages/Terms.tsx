import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

export default function Terms() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const sections = language === 'ar' ? [
    { title: 'القبول', body: 'باستخدامك لهذا الموقع، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام الموقع.' },
    { title: 'الطلبات', body: 'جميع الطلبات تخضع للتأكيد والتوفر. نحتفظ بالحق في رفض أو إلغاء أي طلب.' },
    { title: 'الأسعار', body: 'جميع الأسعار بالدينار الجزائري (دج) وقد تتغير دون إشعار مسبق. الأسعار المعروضة عند تأكيد الطلب هي الأسعار النهائية.' },
    { title: 'التوصيل', body: 'نوصل لكل 58 ولاية. مدة التوصيل تتراوح بين 2-5 أيام عمل. تكاليف التوصيل تختلف حسب الولاية.' },
    { title: 'الإرجاع', body: 'يمكن إرجاع المنتجات خلال 7 أيام من الاستلام بشرط أن تكون في حالتها الأصلية مع التغليف الأصلي.' },
    { title: 'الضمان', body: 'تتمتع بعض المنتجات بضمان من الشركة المصنعة. يرجى مراجعة تفاصيل المنتج للحصول على معلومات الضمان.' },
  ] : [
    { title: 'Acceptance', body: 'By using this website, you agree to these terms and conditions. If you do not agree, please do not use the site.' },
    { title: 'Orders', body: 'All orders are subject to confirmation and availability. We reserve the right to refuse or cancel any order.' },
    { title: 'Pricing', body: 'All prices are in Algerian Dinar (DZD) and may change without notice. Prices shown at order confirmation are final.' },
    { title: 'Delivery', body: 'We deliver to all 58 wilayas. Delivery takes 2-5 business days. Shipping costs vary by wilaya.' },
    { title: 'Returns', body: 'Products can be returned within 7 days of delivery, provided they are in original condition with original packaging.' },
    { title: 'Warranty', body: 'Some products come with manufacturer warranty. Please check product details for warranty information.' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-700 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">{t('page.terms')}</h1>
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
