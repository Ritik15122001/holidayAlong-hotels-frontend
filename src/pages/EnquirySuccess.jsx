import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowRight, Clock } from 'lucide-react';
import { EMAIL } from '../components/Contact.js';

export default function EnquirySuccess() {
  const { state } = useLocation();
  return (
    <div className="bg-surface">
      <div className="container-x flex min-h-[68vh] items-center justify-center py-14">
        <div className="card w-full max-w-lg p-7 text-center sm:p-9">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></span>
          <h1 className="text-[24px] font-extrabold text-ink-900 sm:text-[28px]">Booking request received{state?.name ? `, ${state.name.split(' ')[0]}` : ''}.</h1>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
            Our team will confirm your booking shortly{state?.hotelName ? <> about your stay at <span className="font-semibold text-ink-900">{state.hotelName}</span></> : ''}.
            You'll receive a tailored proposal with availability and final tariffs.
          </p>
          <span className="chip mt-4 !border-emerald-200 !bg-emerald-50 !text-emerald-700"><Clock size={14} /> Typical reply time: under 24 hours</span>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/hotels" className="btn-ghost">Browse more hotels <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2.5 border-t border-line pt-5 text-[13px] text-ink-500 sm:flex-row sm:justify-center sm:gap-6">
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-brand-700"><Mail size={15} className="text-brand-600" /> {EMAIL}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
