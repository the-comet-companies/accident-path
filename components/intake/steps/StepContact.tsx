'use client'
import { ConsentCheckbox } from '@/components/intake/ConsentCheckbox'
import type { StepProps } from '@/lib/intake'

interface StepContactProps extends StepProps {
  onSubmit: () => Promise<void>
  submitting: boolean
}

export function StepContact({ data, onChange, onBack, onSubmit, submitting, strings }: StepContactProps) {
  const consentGiven = data.consent === true
  const canSubmit = consentGiven && !submitting
  const locale = strings ? 'es' : 'en'

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step9_question ?? 'Get your personalized results'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step9_desc ?? 'Almost done. Please review the consent below, then optionally share your contact info so we can send your results.'}
      </p>

      {/* Consent — required */}
      <div className="mb-6">
        <ConsentCheckbox
          checked={data.consent === true}
          onChange={val => onChange({ consent: val })}
          tcpaText={strings?.tcpaConsent}
        />
      </div>

      {/* Contact fields — optional, disabled until consent given */}
      <div className={`flex flex-col gap-4 transition-opacity ${consentGiven ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <p className="text-xs font-semibold font-sans text-neutral-500 uppercase tracking-wider">
          {strings?.step9_contactOptional ?? 'Contact info (optional — to receive your results by email)'}
        </p>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            {strings?.step9_fullName ?? 'Full Name'}
          </label>
          <input
            id="contact-name"
            type="text"
            value={data.name ?? ''}
            onChange={e => onChange({ name: e.target.value })}
            placeholder={strings?.step9_namePlaceholder ?? 'Jane Smith'}
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            {strings?.step9_email ?? 'Email Address'}
          </label>
          <input
            id="contact-email"
            type="email"
            value={data.email ?? ''}
            onChange={e => onChange({ email: e.target.value })}
            placeholder={strings?.step9_emailPlaceholder ?? 'jane@example.com'}
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            {strings?.step9_phone ?? 'Phone Number'}
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={data.phone ?? ''}
            onChange={e => onChange({ phone: e.target.value })}
            placeholder={strings?.step9_phonePlaceholder ?? '(555) 000-0000'}
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-40"
        >
          {strings?.back ?? 'Back'}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting
            ? (strings?.step9_submitting ?? 'Submitting…')
            : (strings?.step9_seeResults ?? 'See My Results')}
        </button>
      </div>

      <p className="mt-4 text-xs text-neutral-400 text-center leading-relaxed">
        {strings?.step9_privacyNote ?? 'Your contact info is never sold. By submitting, you agree to our'}{' '}
        <a href={locale === 'es' ? '/es/privacidad' : '/privacy'} className="underline hover:text-neutral-600">
          {strings?.step9_privacy ?? 'Privacy Policy'}
        </a>{' '}
        {locale === 'es' ? 'y nuestros' : 'and'}{' '}
        <a href={locale === 'es' ? '/es/terminos' : '/terms'} className="underline hover:text-neutral-600">
          {strings?.step9_terms ?? 'Terms of Use'}
        </a>
        .
      </p>
    </div>
  )
}
