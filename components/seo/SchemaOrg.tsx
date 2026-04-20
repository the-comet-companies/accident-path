import Script from 'next/script'

interface SchemaOrgProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
  id?: string
}

export function SchemaOrg({ schema, id = 'schema-org' }: SchemaOrgProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
