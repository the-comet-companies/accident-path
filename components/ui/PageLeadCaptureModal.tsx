'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'

interface Props {
  triggerLabel: string
  headline: string
  subtext: string
  buttonLabel: string
  toolSlug: string
  toolContext?: Record<string, string>
}

export function PageLeadCaptureModal({
  triggerLabel,
  headline,
  subtext,
  buttonLabel,
  toolSlug,
  toolContext,
}: Props) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function onClose() { setOpen(false) }
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    if (
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    ) {
      setOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-amber-600 hover:text-amber-700 transition-colors min-h-[44px] sm:min-h-0 cursor-pointer"
      >
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="m-auto w-full max-w-md rounded-2xl border border-neutral-100 bg-white p-0 shadow-2xl backdrop:bg-black/50 open:animate-fade-in"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-100">
          <p className="font-sans font-semibold text-neutral-950 text-sm">{headline}</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-5">
          <PageLeadCapture
            headline=""
            subtext={subtext}
            buttonLabel={buttonLabel}
            toolSlug={toolSlug}
            toolContext={toolContext}
            bare
          />
        </div>
      </dialog>
    </>
  )
}
