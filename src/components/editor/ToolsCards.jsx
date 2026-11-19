import { useRef, useState } from 'react'
import { Card } from '../Card'
import { getInstallPlatform } from '../../utils/platform'
import { useT } from '../../i18n/LocaleContext'

// The less-used extras at the bottom of Basics: installing the app on the
// organiser's own phone, and backing the trip up to a file.
export function ToolsCards({ id, doc, onImport, onShowInstall }) {
  const t = useT()
  const fileInput = useRef(null)
  const [importError, setImportError] = useState('')
  const [platform] = useState(getInstallPlatform)

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
      setImportError(t('That file is not a trip export.'))
    }
  }

  return (
    <>
      <Card>
        <h3 className="font-bold text-charcoal">{t('📲 On your home screen')}</h3>
        {platform === 'installed' ? (
          <p className="text-sm text-charcoal/60 mt-0.5">{t('You are using the installed app. Guests are shown how to install it when they first open their link.')}</p>
        ) : platform === 'desktop' ? (
          <p className="text-sm text-charcoal/60 mt-0.5">
            {t('The trip works best as an app on your phone. Open your edit link there and you will be walked through adding it. Guests get the same walkthrough the first time they open their link.')}
          </p>
        ) : (
          <>
            <p className="text-sm text-charcoal/60 mt-0.5">{t('Add the trip to your phone like an app. Guests get the same walkthrough the first time they open their link.')}</p>
            <button onClick={onShowInstall} className="min-h-[44px] text-terracotta font-bold">{t('Show me how')}</button>
          </>
        )}
      </Card>

      <Card>
        <h3 className="font-bold text-charcoal">{t('Backup')}</h3>
        <p className="text-sm text-charcoal/60 mt-0.5">
          {t('Download the whole trip as a file, or load one to replace everything here.')}
        </p>
        <div className="flex gap-4 mt-2">
          <button onClick={handleExport} className="min-h-[44px] text-terracotta font-bold">{t('Export trip')}</button>
          <button onClick={() => fileInput.current.click()} className="min-h-[44px] text-terracotta font-bold">{t('Import trip')}</button>
          <input ref={fileInput} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" data-testid="import-file" />
        </div>
        {importError && <p role="alert" className="text-terracotta text-sm">{importError}</p>}
      </Card>
    </>
  )
}
