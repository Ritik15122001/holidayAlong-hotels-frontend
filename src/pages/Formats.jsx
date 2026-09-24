import { useState } from 'react';
import { FileText, Copy, Check, ChevronRight } from 'lucide-react';

/**
 * Internal copy-and-paste library for the sales desk.
 * Square brackets mark the blanks to fill in before sending.
 */
const TEMPLATES = [
  {
    id: 'first-call', group: 'Calls', title: 'First call script',
    body: `Good [morning/afternoon], thank you for contacting Holiday Along Hotels — this is [your name].

May I take a few details so I can put the right options together?

• Guest name: [name]
• Contact number: [number]
• Email: [email]
• Destination: [city / region]
• Travel dates: [check-in] to [check-out]
• Nights: [n]
• Guests: [x] adults, [y] children (ages [ ])
• Rooms required: [n]
• Hotel category: [3★ / 4★ / 5★]
• Meal plan: [EP / CP / MAP]
• Budget per night: [amount]
• Anything special? [honeymoon / family / business / accessibility]

Thank you. I will send you options within [time] on WhatsApp and email.`,
  },
  {
    id: 'b2b-send', group: 'Quotes', title: 'B2B send format',
    body: `Dear [agent name],

Thank you for your query. Please find our offer below.

Destination: [destination]
Dates: [check-in] to [check-out] ([n] nights)
Guests: [x] adults, [y] children
Hotel: [hotel name], [category]
Room type: [room type]
Meal plan: [EP / CP / MAP]

Net rate: INR [amount] per room per night
Total: INR [amount] (exclusive of GST)

Inclusions: [accommodation, meals, transfers, sightseeing]
Exclusions: [airfare, personal expenses, anything not mentioned]

Rates are subject to availability at the time of confirmation.

Regards,
[your name] | Holiday Along Hotels`,
  },
  {
    id: 'package-send', group: 'Quotes', title: 'Package send format',
    body: `Hi [name],

As discussed, I have shared your customised package for [destination] on [WhatsApp / email].

Package: [package name]
Duration: [n] nights / [n] days
Hotels: [hotel names]
Total for [x] guests: INR [amount]

Please review and let me know if you would like any changes. Happy to adjust hotels, dates or inclusions.

Regards,
[your name]`,
  },
  {
    id: 'no-answer-before', group: 'Follow-ups', title: 'No answer — before quote',
    body: `Hi [name], this is [your name] from Holiday Along Hotels.

I tried reaching you regarding your [destination] enquiry but could not connect. Could you share a convenient time to call?

You can also reply here with your dates, number of guests and preferred hotel category, and I will send options right away.`,
  },
  {
    id: 'no-answer-after', group: 'Follow-ups', title: 'No answer — after quote',
    body: `Hi [name], following up on the [destination] options I shared on [date].

Did you get a chance to look them over? I can revise the hotels, dates or budget — just tell me what would work better.

Rooms at [hotel name] are moving quickly for your dates, so let me know soon and I will hold them for you.`,
  },
  {
    id: 'cab-cost', group: 'Vendors', title: 'Cab cost format',
    body: `Hi [vendor name],

Please share your best rate for the following:

Guest: [name] — [x] adults, [y] children
Pickup: [location] on [date] at [time]
Drop: [location]
Vehicle: [sedan / SUV / tempo traveller]
Itinerary: [day-wise route]
Nights: [n]

Please confirm the all-inclusive rate (fuel, driver, tolls, parking, permits) and vehicle model.`,
  },
  {
    id: 'hotel-booking', group: 'Vendors', title: 'Hotel booking format',
    body: `Dear [hotel name] team,

Please confirm the following booking:

Guest name: [name]
Check-in: [date] · Check-out: [date] ([n] nights)
Rooms: [n] x [room type]
Occupancy: [x] adults, [y] children (ages [ ])
Meal plan: [EP / CP / MAP]
Confirmed tariff: INR [amount] per room per night
Total: INR [amount]
Special requests: [early check-in / high floor / connecting rooms]

Kindly share the confirmation voucher on this email.

Regards,
[your name] | Holiday Along Hotels`,
  },
  {
    id: 'wa-hotel-booking', group: 'WhatsApp', title: 'WhatsApp hotel booking format',
    body: `Booking request — Holiday Along Hotels

Hotel: [hotel name]
Guest: [name]
Check-in: [date]
Check-out: [date] ([n] nights)
Rooms: [n] x [room type]
Pax: [x] adults, [y] children
Plan: [EP / CP / MAP]
Tariff: INR [amount] per night
Total: INR [amount]

Please confirm availability and send the voucher.`,
  },
  {
    id: 'wa-availability', group: 'WhatsApp', title: 'WhatsApp room availability format',
    body: `Hi [hotel name], checking availability please.

Dates: [check-in] to [check-out] ([n] nights)
Rooms: [n] x [room type]
Pax: [x] adults, [y] children
Meal plan: [EP / CP / MAP]

Please share availability and your best net rate for these dates.`,
  },
  {
    id: 'wa-cab-vendor', group: 'WhatsApp', title: 'Cab details with vendor — WhatsApp',
    body: `Cab confirmation — Holiday Along Hotels

Guest: [name] — [phone]
Pax: [x] adults, [y] children
Vehicle: [type]
Pickup: [location], [date] at [time]
Drop: [location]
Itinerary: [route]
Agreed rate: INR [amount] (all inclusive)

Please share the driver name and number [time] before pickup.`,
  },
  {
    id: 'advance-payment', group: 'Payments', title: 'Advance payment mail format',
    body: `Dear [name],

Thank you for confirming your [destination] booking.

Total package: INR [amount]
Advance due now: INR [amount]
Balance: INR [amount], due by [date]

Please make the advance payment using the details below and share the receipt so we can issue your confirmation vouchers.

[bank / UPI details]

Regards,
[your name] | Holiday Along Hotels`,
  },
  {
    id: 'balance-payment', group: 'Payments', title: 'Balance payment mail format',
    body: `Dear [name],

Hope you are looking forward to your [destination] trip.

This is a reminder that the balance of INR [amount] is due by [date] to keep your bookings confirmed.

Total package: INR [amount]
Advance received: INR [amount] on [date]
Balance due: INR [amount]

[bank / UPI details]

Regards,
[your name]`,
  },
  {
    id: 'complete-payment', group: 'Payments', title: 'Complete payment mail format',
    body: `Dear [name],

We have received your full payment. Thank you.

Total package: INR [amount]
Advance: INR [amount] on [date]
Balance: INR [amount] on [date]
Status: Paid in full

Your vouchers are attached. Our team is on call throughout your stay on [number].

Wishing you a wonderful trip.

Regards,
[your name] | Holiday Along Hotels`,
  },
];

const GROUPS = [...new Set(TEMPLATES.map((t) => t.group))];

export default function Formats() {
  const [copied, setCopied] = useState('');

  const copy = async (t) => {
    try {
      await navigator.clipboard.writeText(t.body);
      setCopied(t.id);
      setTimeout(() => setCopied(''), 1600);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="bg-surface pb-16">
      <section className="border-b border-line bg-white">
        <div className="container-x py-10 sm:py-12">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-500">
            <FileText size={13} /> Team library
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight text-ink-900 sm:text-[36px]">Formats &amp; Scripts</h1>
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            Ready-made call scripts and message formats for the desk. Copy one, fill in the blanks marked in brackets, and send.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-6 pt-6 lg:grid-cols-[210px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="card p-2">
            {GROUPS.map((g) => (
              <div key={g} className="mb-2 last:mb-0">
                <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-400">{g}</p>
                {TEMPLATES.filter((t) => t.group === g).map((t) => (
                  <a key={t.id} href={`#${t.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-ink-700 transition hover:bg-brand-50 hover:text-brand-700">
                    <span className="truncate">{t.title}</span>
                    <ChevronRight size={13} className="shrink-0 text-ink-400" />
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-4">
          {TEMPLATES.map((t) => (
            <article key={t.id} id={t.id} className="card scroll-mt-24 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-brand-50 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-brand-700">{t.group}</span>
                  <h2 className="mt-2 text-[17px] font-extrabold text-ink-900">{t.title}</h2>
                </div>
                <button onClick={() => copy(t)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-bold transition ${
                    copied === t.id ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-line text-ink-700 hover:border-brand-300 hover:text-brand-700'}`}>
                  {copied === t.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <pre className="mt-3.5 whitespace-pre-wrap break-words rounded-xl bg-surface p-4 font-sans text-[13.5px] leading-relaxed text-ink-700">{t.body}</pre>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
