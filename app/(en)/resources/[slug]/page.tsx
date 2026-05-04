import { notFound } from 'next/navigation'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { ResourceGate } from '@/components/resources/ResourceGate'
import { buildMetaTags } from '@/components/seo/MetaTags'

export async function generateStaticParams() {
  return cms.getAllResources()
    .filter(r => !r.comingSoon)
    .map(r => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const resource = cms.getResource(slug)
    return buildMetaTags({
      title: resource.metaTitle,
      description: resource.metaDescription,
      canonical: `/resources/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let resource
  try {
    resource = cms.getResource(slug)
  } catch {
    notFound()
  }

  if (resource.comingSoon) notFound()

  const labelColorClass =
    resource.label === 'Critical' ? 'text-red-400' : 'text-amber-400'

  return (
    <>
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: resource.headline },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <span className={`text-xs font-bold uppercase tracking-widest ${labelColorClass}`}>
              {resource.label}
            </span>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mt-2">
              {resource.headline}
            </h1>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">
              This information is for educational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </div>

      {/* Gate + Content */}
      <div className="bg-surface-page">
        <ResourceGate resource={resource} />
      </div>

      <DisclaimerBanner variant="default" />
    </>
  )
}
