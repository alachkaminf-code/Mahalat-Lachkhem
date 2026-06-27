import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '213550123456';
  const message = encodeURIComponent('مرحباً، أريد الاستفسار عن منتجاتكم');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </a>
  );
}
