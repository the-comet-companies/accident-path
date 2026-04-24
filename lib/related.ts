import { cms } from '@/lib/cms'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RelatedLink {
  href: string
  label: string
  type: 'accident' | 'injury' | 'guide' | 'tool'
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Convert a kebab-case slug to Title Case as a CMS-lookup fallback. */
function slugToTitleCase(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function resolveInjuryLabel(slug: string): string {
  try {
    return cms.getInjury(slug).title
  } catch {
    return slugToTitleCase(slug)
  }
}

function resolveAccidentLabel(slug: string): string {
  try {
    return cms.getAccident(slug).title
  } catch {
    return slugToTitleCase(slug)
  }
}

function resolveGuideLabel(slug: string): string {
  try {
    return cms.getGuide(slug).title
  } catch {
    return slugToTitleCase(slug)
  }
}

function resolveToolLabel(slug: string): string {
  try {
    return cms.getTool(slug).title
  } catch {
    return slugToTitleCase(slug)
  }
}

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Returns related injuries, guides, and tools for an accident page.
 */
export function getAccidentRelated(slug: string): {
  injuries: RelatedLink[]
  guides: RelatedLink[]
  tools: RelatedLink[]
} {
  let accident
  try {
    accident = cms.getAccident(slug)
  } catch {
    return { injuries: [], guides: [], tools: [] }
  }

  const injuries: RelatedLink[] = accident.relatedInjuries
    .map((injurySlug): RelatedLink | null => {
      try {
        return {
          href: `/injuries/${injurySlug}`,
          label: resolveInjuryLabel(injurySlug),
          type: 'injury',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const guides: RelatedLink[] = accident.relatedGuides
    .map((guideSlug): RelatedLink | null => {
      try {
        return {
          href: `/guides/${guideSlug}`,
          label: resolveGuideLabel(guideSlug),
          type: 'guide',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const tools: RelatedLink[] = accident.relatedTools
    .map((toolSlug): RelatedLink | null => {
      try {
        return {
          href: `/tools/${toolSlug}`,
          label: resolveToolLabel(toolSlug),
          type: 'tool',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { injuries, guides, tools }
}

/**
 * Returns related accidents and tools for an injury page.
 */
export function getInjuryRelated(slug: string): {
  accidents: RelatedLink[]
  tools: RelatedLink[]
} {
  let injury
  try {
    injury = cms.getInjury(slug)
  } catch {
    return { accidents: [], tools: [] }
  }

  const accidents: RelatedLink[] = injury.relatedAccidents
    .map((accidentSlug): RelatedLink | null => {
      try {
        return {
          href: `/accidents/${accidentSlug}`,
          label: resolveAccidentLabel(accidentSlug),
          type: 'accident',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const tools: RelatedLink[] = injury.relatedTools
    .map((toolSlug): RelatedLink | null => {
      try {
        return {
          href: `/tools/${toolSlug}`,
          label: resolveToolLabel(toolSlug),
          type: 'tool',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { accidents, tools }
}

/**
 * Returns related accidents, tools, and sibling guides for a guide page.
 */
export function getGuideRelated(slug: string): {
  accidents: RelatedLink[]
  tools: RelatedLink[]
  guides: RelatedLink[]
} {
  let guide
  try {
    guide = cms.getGuide(slug)
  } catch {
    return { accidents: [], tools: [], guides: [] }
  }

  const accidents: RelatedLink[] = guide.relatedAccidents
    .map((accidentSlug): RelatedLink | null => {
      try {
        return {
          href: `/accidents/${accidentSlug}`,
          label: resolveAccidentLabel(accidentSlug),
          type: 'accident',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const tools: RelatedLink[] = guide.relatedTools
    .map((toolSlug): RelatedLink | null => {
      try {
        return {
          href: `/tools/${toolSlug}`,
          label: resolveToolLabel(toolSlug),
          type: 'tool',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const guides: RelatedLink[] = guide.relatedGuides
    .map((guideSlug): RelatedLink | null => {
      try {
        return {
          href: `/guides/${guideSlug}`,
          label: resolveGuideLabel(guideSlug),
          type: 'guide',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { accidents, tools, guides }
}

/**
 * Returns related accidents, guides, and sibling tools for a tool page.
 */
export function getToolRelated(slug: string): {
  accidents: RelatedLink[]
  guides: RelatedLink[]
  tools: RelatedLink[]
} {
  let tool
  try {
    tool = cms.getTool(slug)
  } catch {
    return { accidents: [], guides: [], tools: [] }
  }

  const accidents: RelatedLink[] = tool.relatedAccidents
    .map((accidentSlug): RelatedLink | null => {
      try {
        return {
          href: `/accidents/${accidentSlug}`,
          label: resolveAccidentLabel(accidentSlug),
          type: 'accident',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const guides: RelatedLink[] = tool.relatedGuides
    .map((guideSlug): RelatedLink | null => {
      try {
        return {
          href: `/guides/${guideSlug}`,
          label: resolveGuideLabel(guideSlug),
          type: 'guide',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  const tools: RelatedLink[] = tool.relatedTools
    .map((toolSlug): RelatedLink | null => {
      try {
        return {
          href: `/tools/${toolSlug}`,
          label: resolveToolLabel(toolSlug),
          type: 'tool',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { accidents, guides, tools }
}

/**
 * Returns the first 4 accident links derived from a city's commonAccidentTypes.
 */
export function getCityRelated(slug: string): {
  accidents: RelatedLink[]
} {
  let city
  try {
    city = cms.getCity(slug)
  } catch {
    return { accidents: [] }
  }

  const accidents: RelatedLink[] = city.commonAccidentTypes
    .slice(0, 4)
    .map((accidentSlug): RelatedLink | null => {
      try {
        return {
          href: `/accidents/${accidentSlug}`,
          label: resolveAccidentLabel(accidentSlug),
          type: 'accident',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { accidents }
}

/** Core accident slugs surfaced on every state page. */
const STATE_CORE_ACCIDENTS = [
  'car',
  'truck',
  'motorcycle',
  'slip-and-fall',
  'dog-bite',
] as const

/**
 * Returns a static set of core accident links for a state page.
 * The slug parameter is accepted for API consistency but state data
 * does not carry its own accident list.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getStateRelated(_slug: string): {
  accidents: RelatedLink[]
} {
  const accidents: RelatedLink[] = STATE_CORE_ACCIDENTS
    .map((accidentSlug): RelatedLink | null => {
      try {
        return {
          href: `/accidents/${accidentSlug}`,
          label: resolveAccidentLabel(accidentSlug),
          type: 'accident',
        }
      } catch {
        return null
      }
    })
    .filter((link): link is RelatedLink => link !== null)

  return { accidents }
}
