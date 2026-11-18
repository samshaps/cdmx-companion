import { useRef, useState } from 'react'
import { Card } from '../Card'
import { buttonPrimary } from '../Page'
import { editUrl, guestUrl } from '../../lib/router'
import { copyToClipboard } from '../../utils/clipboard'

function ShareLink({ label, description, url, testId }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (await copyToClipboard(url)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <h3 className="font-bold text-charcoal">{label}</h3>
      <p className="text-sm text-charcoal/60 mt-0.5">{description}</p>
      <p data-testid={testId} className="font-mono text-xs text-teal bg-white rounded-lg px-3 py-2 mt-3 break-all">{url}</p>
      <button onClick={handleCopy} className="mt-2 min-h-[44px] text-terracotta font-bold">
        {copied ? 'Copied!' : `Copy ${label.toLowerCase()}`}
      </button>
    </Card>
  )
}

export function ShareSection({ id, token, doc, onImport }) {
  const fileInput = useRef(null)
  const [importError, setImportError] = useState('')

  function handleExport() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${id}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function handleImport(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const imported = JSON.parse(await file.text())
      if (!imported?.trip?.name) throw new Error('not a trip')
      setImportError('')
      onImport(imported)
    } catch {
      setImportError('That file is not a trip export.')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ShareLink
        label="Guest link"
        description="Send this to everyone on the trip. They open it and add it to their home screen."
        url={guestUrl(id)}
        testId="guest-link"
      />
      <ShareLink
        label="Edit link"
        description="Keep this private. Anyone with it can change the trip. It is the only way back to this page from another device."
        url={editUrl(id, token)}
        testId="edit-link"
      />
      <a href={guestUrl(id)} target="_blank" rel="noopener noreferrer" className={`${buttonPrimary} mt-2`}>
        Open the guest view
      </a>

      <Card className="mt-4">
        <h3 className="font-bold text-charcoal">Backup</h3>
        <p className="text-sm text-charcoal/60 mt-0.5">
          Download the whole trip as a file, or load one to replace everything here.
        </p>
        <div className="flex gap-4 mt-2">
          <button onClick={handleExport} className="min-h-[44px] text-terracotta font-bold">Export trip</button>
          <button onClick={() => fileInput.current.click()} className="min-h-[44px] text-terracotta font-bold">Import trip</button>
          <input ref={fileInput} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" data-testid="import-file" />
        </div>
        {importError && <p role="alert" className="text-terracotta text-sm">{importError}</p>}
      </Card>
    </div>
  )
}
