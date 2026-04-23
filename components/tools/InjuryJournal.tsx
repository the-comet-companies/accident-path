'use client'

import { useState, useEffect } from 'react'
import { Printer, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { ToolConfig } from '@/types/tool'

interface JournalEntry {
  id: string
  date: string        // 'YYYY-MM-DD'
  painLevel: number   // 1-10
  symptoms: string[]
  treatments: string[]
  medications: string
  limitations: string
  notes: string
}

interface InjuryJournalProps {
  tool: ToolConfig
}

const STORAGE_KEY = 'ap-injury-journal'

const SYMPTOM_OPTIONS = [
  { value: 'headache', label: 'Headache' },
  { value: 'neck-pain', label: 'Neck pain or stiffness' },
  { value: 'back-pain', label: 'Back pain' },
  { value: 'dizziness', label: 'Dizziness or vertigo' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'numbness-tingling', label: 'Numbness or tingling' },
  { value: 'sleep-disruption', label: 'Sleep disruption' },
  { value: 'anxiety-depression', label: 'Anxiety or depression' },
  { value: 'difficulty-concentrating', label: 'Difficulty concentrating' },
  { value: 'fatigue', label: 'Fatigue or low energy' },
  { value: 'limited-range-of-motion', label: 'Limited range of motion' },
]

const TREATMENT_OPTIONS = [
  { value: 'doctor-visit', label: 'Doctor visit' },
  { value: 'physical-therapy', label: 'Physical therapy' },
  { value: 'chiropractic', label: 'Chiropractic care' },
  { value: 'medication', label: 'Medication' },
  { value: 'er-urgent-care', label: 'Emergency room or urgent care' },
  { value: 'mental-health', label: 'Mental health therapy' },
  { value: 'massage', label: 'Massage therapy' },
  { value: 'imaging', label: 'Imaging (X-ray, MRI, CT)' },
]

function getTodayString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateStr: string): string {
  // Parse as local date to avoid timezone shift
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getPainBadgeClass(level: number): string {
  if (level <= 3) return 'bg-success-50 text-success-700'
  if (level <= 6) return 'bg-warning-50 text-warning-700'
  return 'bg-danger-50 text-danger-700'
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function InjuryJournal({ tool }: InjuryJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [view, setView] = useState<'list' | 'add' | 'calendar'>('list')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const today = new Date()
  const [calendarMonth, setCalendarMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  })

  // Form state
  const [formDate, setFormDate] = useState(getTodayString())
  const [formPainLevel, setFormPainLevel] = useState(0)
  const [formSymptoms, setFormSymptoms] = useState<string[]>([])
  const [formTreatments, setFormTreatments] = useState<string[]>([])
  const [formMedications, setFormMedications] = useState('')
  const [formLimitations, setFormLimitations] = useState('')
  const [formNotes, setFormNotes] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setEntries(parsed as JournalEntry[])
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  function saveEntries(newEntries: JournalEntry[]) {
    setEntries(newEntries)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
    } catch {
      // ignore storage errors
    }
  }

  function resetForm(date?: string) {
    setFormDate(date ?? getTodayString())
    setFormPainLevel(0)
    setFormSymptoms([])
    setFormTreatments([])
    setFormMedications('')
    setFormLimitations('')
    setFormNotes('')
  }

  function handleAddView(date?: string) {
    resetForm(date)
    setView('add')
  }

  function handleSaveEntry() {
    if (!formDate || formPainLevel === 0) return
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: formDate,
      painLevel: formPainLevel,
      symptoms: formSymptoms,
      treatments: formTreatments,
      medications: formMedications,
      limitations: formLimitations,
      notes: formNotes,
    }
    const newEntries = [entry, ...entries]
    saveEntries(newEntries)
    resetForm()
    setView('list')
    setExpandedId(entry.id)
  }

  function toggleSymptom(value: string) {
    setFormSymptoms(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  function toggleTreatment(value: string) {
    setFormTreatments(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    )
  }

  // Calendar helpers
  function handleCalendarDayClick(dateStr: string) {
    const hasEntry = entries.some(e => e.date === dateStr)
    if (hasEntry) {
      const entry = entries.find(e => e.date === dateStr)
      setView('list')
      setExpandedId(entry?.id ?? null)
    } else {
      handleAddView(dateStr)
    }
  }

  function prevMonth() {
    setCalendarMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  function nextMonth() {
    setCalendarMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  // Sort entries newest first
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  const todayStr = getTodayString()

  // Build a set of dates with entries for quick lookup
  const entryDates = new Set(entries.map(e => e.date))

  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>

      {/* View tabs */}
      <div className="flex gap-2 print-hide" aria-label="Journal views">
        {(['list', 'calendar', 'add'] as const).map(v => (
          <button
            key={v}
            type="button"
            aria-current={view === v ? 'true' : undefined}
            onClick={() => {
              if (v === 'add') {
                handleAddView()
              } else {
                setView(v)
              }
            }}
            className={`px-4 py-2 rounded-lg font-sans font-semibold text-sm min-h-[40px] transition-colors ${
              view === v
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {v === 'list' ? 'Log' : v === 'calendar' ? 'Calendar' : 'Add Entry'}
          </button>
        ))}
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-neutral-950">Journal Entries</h2>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="print-hide flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Print journal"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print
            </button>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="rounded-xl border border-neutral-100 bg-surface-card p-8 text-center">
              <p className="text-neutral-500 text-sm mb-4">
                No entries yet. Add your first entry to start tracking.
              </p>
              <button
                type="button"
                onClick={() => handleAddView()}
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors"
              >
                Add Entry
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedEntries.map(entry => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-neutral-100 bg-surface-card shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expandedId === entry.id ? null : entry.id)
                    }
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                    aria-expanded={expandedId === entry.id}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-sans font-semibold text-sm text-neutral-950 shrink-0">
                        {formatDate(entry.date)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans shrink-0 ${getPainBadgeClass(entry.painLevel)}`}
                      >
                        Pain: {entry.painLevel}/10
                      </span>
                    </div>
                    {expandedId === entry.id ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" aria-hidden="true" />
                    )}
                  </button>

                  {expandedId === entry.id && (
                    <div className="px-5 pb-5 flex flex-col gap-3 border-t border-neutral-100">
                      {entry.symptoms.length > 0 && (
                        <div>
                          <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                            Symptoms
                          </p>
                          <p className="text-sm text-neutral-700">
                            {entry.symptoms
                              .map(
                                s =>
                                  SYMPTOM_OPTIONS.find(o => o.value === s)?.label ?? s
                              )
                              .join(', ')}
                          </p>
                        </div>
                      )}
                      {entry.treatments.length > 0 && (
                        <div>
                          <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                            Treatments
                          </p>
                          <p className="text-sm text-neutral-700">
                            {entry.treatments
                              .map(
                                t =>
                                  TREATMENT_OPTIONS.find(o => o.value === t)?.label ?? t
                              )
                              .join(', ')}
                          </p>
                        </div>
                      )}
                      {entry.medications && (
                        <div>
                          <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                            Medications
                          </p>
                          <p className="text-sm text-neutral-700">{entry.medications}</p>
                        </div>
                      )}
                      {entry.limitations && (
                        <div>
                          <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                            Limitations
                          </p>
                          <p className="text-sm text-neutral-700">{entry.limitations}</p>
                        </div>
                      )}
                      {entry.notes && (
                        <div>
                          <p className="text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-neutral-700">{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
            {/* Month header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" aria-hidden="true" />
              </button>
              <h2 className="font-sans font-bold text-base text-neutral-950">
                {MONTH_NAMES[calendarMonth.month]} {calendarMonth.year}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" aria-hidden="true" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div
                  key={d}
                  className="text-center text-xs font-sans font-semibold text-neutral-500 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {/* Empty cells before first day */}
              {Array.from({ length: getFirstDayOfWeek(calendarMonth.year, calendarMonth.month) }).map(
                (_, i) => (
                  <div key={`empty-${i}`} />
                )
              )}

              {/* Day cells */}
              {Array.from({ length: getDaysInMonth(calendarMonth.year, calendarMonth.month) }).map(
                (_, i) => {
                  const dayNum = i + 1
                  const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const hasEntry = entryDates.has(dateStr)
                  const isToday = dateStr === todayStr

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => handleCalendarDayClick(dateStr)}
                      className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-sans font-medium transition-colors hover:bg-primary-50 ${
                        isToday
                          ? 'ring-2 ring-primary-600 font-bold text-primary-700'
                          : 'text-neutral-700'
                      }`}
                      aria-label={`${dateStr}${hasEntry ? ' — has entry' : ''}`}
                    >
                      <span>{dayNum}</span>
                      {hasEntry && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Form */}
      {view === 'add' && (
        <div className="rounded-xl border border-neutral-100 bg-surface-card p-6 shadow-sm flex flex-col gap-6">
          <h2 className="font-sans font-bold text-xl text-neutral-950">Add Journal Entry</h2>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="entry-date" className="font-sans font-semibold text-sm text-neutral-700">
              Date
            </label>
            <input
              id="entry-date"
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              max={getTodayString()}
              className="w-full sm:w-48 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-950 bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Pain level */}
          <div className="flex flex-col gap-2">
            <p className="font-sans font-semibold text-sm text-neutral-700">
              Pain Level <span className="text-neutral-400 font-normal">(select 1–10)</span>
            </p>
            <div
              role="group"
              aria-label="Pain level 1 to 10"
              className="flex flex-wrap gap-2"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormPainLevel(n)}
                  aria-pressed={formPainLevel === n}
                  className={`w-9 h-9 rounded-lg font-sans font-semibold text-sm transition-colors ${
                    formPainLevel === n
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="flex flex-col gap-2">
            <p className="font-sans font-semibold text-sm text-neutral-700">Symptoms</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SYMPTOM_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formSymptoms.includes(opt.value)}
                    onChange={() => toggleSymptom(opt.value)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-950 transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div className="flex flex-col gap-2">
            <p className="font-sans font-semibold text-sm text-neutral-700">Treatments Today</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TREATMENT_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formTreatments.includes(opt.value)}
                    onChange={() => toggleTreatment(opt.value)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-neutral-950 transition-colors">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="entry-medications"
              className="font-sans font-semibold text-sm text-neutral-700"
            >
              Medications
            </label>
            <textarea
              id="entry-medications"
              rows={2}
              value={formMedications}
              onChange={e => setFormMedications(e.target.value)}
              placeholder="List medications taken today"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-950 bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </div>

          {/* Limitations */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="entry-limitations"
              className="font-sans font-semibold text-sm text-neutral-700"
            >
              Limitations
            </label>
            <textarea
              id="entry-limitations"
              rows={2}
              value={formLimitations}
              onChange={e => setFormLimitations(e.target.value)}
              placeholder="Activities you couldn't do today"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-950 bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="entry-notes"
              className="font-sans font-semibold text-sm text-neutral-700"
            >
              Additional Notes
            </label>
            <textarea
              id="entry-notes"
              rows={3}
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="Additional notes about today"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-950 bg-surface-card focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </div>

          {/* Form actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEntry}
              disabled={!formDate || formPainLevel === 0}
              className="flex-1 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
