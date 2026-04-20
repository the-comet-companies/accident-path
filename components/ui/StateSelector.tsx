'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type StateCode = 'CA' | 'AZ'

interface City {
  label: string
  slug: string
}

const cities: Record<StateCode, City[]> = {
  CA: [
    { label: 'Los Angeles', slug: 'los-angeles' },
    { label: 'San Diego', slug: 'san-diego' },
    { label: 'San Jose', slug: 'san-jose' },
    { label: 'San Francisco', slug: 'san-francisco' },
    { label: 'Fresno', slug: 'fresno' },
    { label: 'Sacramento', slug: 'sacramento' },
    { label: 'Long Beach', slug: 'long-beach' },
    { label: 'Oakland', slug: 'oakland' },
    { label: 'Bakersfield', slug: 'bakersfield' },
    { label: 'Anaheim', slug: 'anaheim' },
  ],
  AZ: [
    { label: 'Phoenix', slug: 'phoenix' },
    { label: 'Tucson', slug: 'tucson' },
    { label: 'Mesa', slug: 'mesa' },
    { label: 'Chandler', slug: 'chandler' },
    { label: 'Scottsdale', slug: 'scottsdale' },
    { label: 'Gilbert', slug: 'gilbert' },
  ],
}

const stateNames: Record<StateCode, string> = {
  CA: 'California',
  AZ: 'Arizona',
}

export interface StateSelectorValue {
  state: StateCode
  city: string
  citySlug: string
}

interface StateSelectorProps {
  onChange?: (value: StateSelectorValue) => void
  /** If true, navigates to /states/[state]/[city] on city select */
  navigateOnSelect?: boolean
  className?: string
}

function SelectWrapper({
  label,
  id,
  value,
  onChange,
  children,
  disabled,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white border border-neutral-200 rounded-lg px-4 py-3 pr-10 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export function StateSelector({ onChange, navigateOnSelect = false, className = '' }: StateSelectorProps) {
  const [selectedState, setSelectedState] = useState<StateCode | ''>('')
  const [selectedCitySlug, setSelectedCitySlug] = useState('')

  function handleStateChange(value: string) {
    const state = value as StateCode | ''
    setSelectedState(state)
    setSelectedCitySlug('')
  }

  function handleCityChange(value: string) {
    if (!selectedState || !value) return
    setSelectedCitySlug(value)

    const cityObj = cities[selectedState].find(c => c.slug === value)
    if (!cityObj) return

    const result: StateSelectorValue = {
      state: selectedState,
      city: cityObj.label,
      citySlug: value,
    }

    onChange?.(result)

    if (navigateOnSelect) {
      const stateSlug = selectedState === 'CA' ? 'california' : 'arizona'
      window.location.href = `/states/${stateSlug}/${value}`
    }
  }

  const cityList = selectedState ? cities[selectedState] : []

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <SelectWrapper
        label="Select your state"
        id="state-select"
        value={selectedState}
        onChange={handleStateChange}
      >
        <option value="" disabled>Choose a state…</option>
        {(Object.keys(stateNames) as StateCode[]).map(code => (
          <option key={code} value={code}>{stateNames[code]}</option>
        ))}
      </SelectWrapper>

      <SelectWrapper
        label="Select your city"
        id="city-select"
        value={selectedCitySlug}
        onChange={handleCityChange}
        disabled={!selectedState}
      >
        <option value="" disabled>
          {selectedState ? 'Choose a city…' : 'Select a state first'}
        </option>
        {cityList.map(city => (
          <option key={city.slug} value={city.slug}>{city.label}</option>
        ))}
      </SelectWrapper>
    </div>
  )
}
