import { Phone, Send } from 'lucide-react';
import { WhatsAppIcon } from './Icons.jsx';
import { PHONE, PHONE_DISPLAY, waLink } from './Contact.js';
import { useEnquiry } from '../store/useStore';

/** Reusable call / WhatsApp / enquiry action group. */
export default function CtaBar({ variant = 'row', context = {}, waText, className = '', labels = true }) {
  const openEnquiry = useEnquiry((s) => s.openEnquiry);
  const stack = variant === 'stack';

  return (
    <div className={`flex gap-2.5 ${stack ? 'flex-col' : 'flex-wrap items-center'} ${className}`}>
      <button onClick={() => openEnquiry(context)} className={`btn-accent ${stack ? 'w-full !py-3.5' : ''} font-bold`}>
        <Send size={16} /> Send enquiry
      </button>
      <a href={waLink(waText)} target="_blank" rel="noreferrer"
        className={`btn border border-[#25D366] bg-[#25D366] px-5 py-3 text-sm text-white hover:bg-[#1db954] ${stack ? 'w-full !py-3.5' : ''}`}>
        <WhatsAppIcon size={17} /> WhatsApp{labels ? ' us' : ''}
      </a>
      <a href={`tel:${PHONE}`} className={`btn-outline ${stack ? 'w-full !py-3.5' : ''}`}>
        <Phone size={16} /> {labels ? PHONE_DISPLAY : 'Call'}
      </a>
    </div>
  );
}

/** Floating WhatsApp + call bubbles, always reachable. */
export function FloatingCta() {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2.5 lg:bottom-6">
      <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105">
        <WhatsAppIcon size={26} />
      </a>
      <a href={`tel:${PHONE}`} aria-label="Call us"
        className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-lift transition hover:scale-105 lg:hidden">
        <Phone size={21} />
      </a>
    </div>
  );
}
