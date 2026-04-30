type DisclaimerVariant = 'default' | 'intake' | 'tool' | 'state'

interface DisclaimerBannerProps {
  variant?: DisclaimerVariant
  locale?: 'en' | 'es'
  className?: string
}

const disclaimerText: Record<'en' | 'es', Record<DisclaimerVariant, string>> = {
  en: {
    default:
      'AccidentPath is not a law firm and does not provide legal advice. Information provided is for educational purposes only. By using this site, you acknowledge that no attorney-client relationship is formed. If you are in immediate danger, call 911. For medical emergencies, seek care immediately.',
    intake:
      'AccidentPath connects consumers with attorneys in our network. Attorneys in our network may pay a fee for marketing services. This does not affect the quality of service you receive. AccidentPath does not endorse or guarantee any attorney\u2019s services.',
    tool:
      'This tool is for informational and educational purposes only. It does not constitute legal advice and should not be relied upon as such. Consult a licensed attorney for advice specific to your situation.',
    state:
      'Laws vary by state. The information on this page is general in nature and may not reflect the current law in your jurisdiction. Consult a licensed attorney in your state for specific guidance.',
  },
  es: {
    default:
      'AccidentPath no es un bufete de abogados y no proporciona asesoramiento legal. La informaci\u00f3n proporcionada es \u00fanicamente para fines educativos. Al usar este sitio, usted reconoce que no se forma ninguna relaci\u00f3n abogado-cliente. Si est\u00e1 en peligro inmediato, llame al 911. Para emergencias m\u00e9dicas, busque atenci\u00f3n de inmediato.',
    intake:
      'AccidentPath conecta a los consumidores con abogados de nuestra red. Los abogados de nuestra red pueden pagar una tarifa por servicios de marketing. Esto no afecta la calidad del servicio que recibe. AccidentPath no avala ni garantiza los servicios de ning\u00fan abogado.',
    tool:
      'Esta herramienta es \u00fanicamente para fines informativos y educativos. No constituye asesoramiento legal y no debe utilizarse como tal. Consulte a un abogado con licencia para obtener asesoramiento espec\u00edfico a su situaci\u00f3n.',
    state:
      'Las leyes var\u00edan seg\u00fan el estado. La informaci\u00f3n en esta p\u00e1gina es de car\u00e1cter general y puede no reflejar la ley vigente en su jurisdicci\u00f3n. Consulte a un abogado con licencia en su estado para obtener orientaci\u00f3n espec\u00edfica.',
  },
}

export function DisclaimerBanner({ variant = 'default', locale = 'en', className = '' }: DisclaimerBannerProps) {
  return (
    <aside
      aria-label="Legal disclaimer"
      className={`bg-neutral-50 border border-neutral-100 rounded-lg px-4 py-3 ${className}`}
    >
      <p className="text-sm text-neutral-500 leading-relaxed">{disclaimerText[locale][variant]}</p>
    </aside>
  )
}
