import type { ReactNode } from 'react'
import {
  Car,
  Truck,
  Bike,
  PersonStanding,
  AlertTriangle,
  Dog,
  HardHat,
  Briefcase,
  Scale,
  Package,
  MapPin,
  Brain,
  Zap,
} from 'lucide-react'
import { cms } from '@/lib/cms'
import { AccidentCard } from '@/components/content/AccidentCard'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Accident Type Guides — Car, Truck, Slip & Fall, and More',
  description:
    'Find clear guidance for your specific type of accident. Evidence checklists, immediate steps, timeline risks, and educational resources for every accident type.',
  canonical: '/accidents',
})

const ICON_MAP: Record<string, ReactNode> = {
  car: <Car className="w-5 h-5" />,
  truck: <Truck className="w-5 h-5" />,
  motorcycle: <Bike className="w-5 h-5" />,
  'uber-lyft': <Car className="w-5 h-5" />,
  pedestrian: <PersonStanding className="w-5 h-5" />,
  bicycle: <Bike className="w-5 h-5" />,
  'slip-and-fall': <AlertTriangle className="w-5 h-5" />,
  'dog-bite': <Dog className="w-5 h-5" />,
  construction: <HardHat className="w-5 h-5" />,
  workplace: <Briefcase className="w-5 h-5" />,
  'wrongful-death': <Scale className="w-5 h-5" />,
  premises: <MapPin className="w-5 h-5" />,
  product: <Package className="w-5 h-5" />,
  'traumatic-brain': <Brain className="w-5 h-5" />,
  spinal: <Zap className="w-5 h-5" />,
}

const DEFAULT_ICON = <AlertTriangle className="w-5 h-5" />

export default function AccidentsPage() {
  const accidents = cms.getAllAccidents()

  return (
    <div className="bg-surface-page min-h-screen">
      {/* Page header */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Accident Types' }]} />
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white mt-3 leading-tight">
            Accident Type Guides
          </h1>
          <p className="mt-3 text-primary-200 text-lg max-w-2xl leading-relaxed">
            Find guidance specific to your type of accident — evidence checklists, immediate steps,
            timeline risks, and educational resources to help you understand your situation.
          </p>
          <p className="mt-3 text-primary-400 text-sm">
            This information is for educational purposes only and does not constitute legal advice.
          </p>
        </div>
      </div>

      {/* Accident grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {accidents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {accidents.map(accident => (
              <AccidentCard
                key={accident.slug}
                title={accident.title}
                description={accident.description.slice(0, 120) + '\u2026'}
                href={`/accidents/${accident.slug}`}
                icon={ICON_MAP[accident.slug] ?? DEFAULT_ICON}
              />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-16 text-sm">
            Accident guides are being prepared. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
