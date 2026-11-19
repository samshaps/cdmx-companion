import { useState } from 'react'
import { Card } from '../Card'
import { inputClass } from '../Page'
import { SelectField, TextField } from './fields'
import { ToolsCards } from './ToolsCards'
import { DestinationField } from '../DestinationField'
import { UI_LANGUAGES } from '../../../shared/i18n/index.js'
import { SkinToast } from '../SkinToast'
import { useT } from '../../i18n/LocaleContext'
import { sameSkin } from '../../../shared/skins'
import { CURRENCIES, LANGUAGES, reconcileItinerary, suggestLocale } from '../../../shared/tripSchema'

export function BasicsSection({ id, doc, change, hasPasscode, onSetPasscode, onImport, onShowInstall }) {
  const t = useT()
  const { trip } = doc
  const [passcode, setPasscode] = useState('')
  const [greeting, setGreeting] = useState(null)
  const known = suggestLocale(trip.destination)
  const wearingFlag = Boolean(known) && sameSkin(trip.skin, known.skin)

  // Moving the dates reshapes the schedule, so warn before plans are dropped.
  function changeDates(start, end) {
    if (!start || !end || end < start) return
    const next = reconcileItinerary(doc.itinerary, start, end)
    const kept = new Set(next.map((d) => d.date))
    const losing = doc.itinerary.filter((d) => !kept.has(d.date) && d.events.length > 0)
    if (losing.length && !window.confirm(t('This removes {count} day(s) that have events planned. Continue?', { count: losing.length }))) return
    change((d) => {
      d.trip.dates = { start, end }
      d.itinerary = next
    })
  }

  // Picking a known place also updates flag, currency and language.
  function applyLocale(d, locale) {
    d.trip.emoji = locale.emoji
    d.trip.currency.local = locale.currency
    d.trip.language = { code: locale.language, name: LANGUAGES.find((l) => l.code === locale.language)?.name || '' }
  }

  const languageOptions = LANGUAGES.map((l) => ({ value: l.code, label: l.name }))

  return (
    <div className="flex flex-col gap-4">
      <TextField label={t('Trip name')} value={trip.name} onChange={(v) => change((d) => { d.trip.name = v })} maxLength={60} />
      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <DestinationField
          value={trip.destination}
          onType={(v) => change((d) => { d.trip.destination = v })}
          onPick={(match) => {
            change((d) => { applyLocale(d, match); d.trip.destination = match.label; d.trip.skin = match.skin })
            setGreeting(match)
          }}
        />
        <TextField label={t('Flag')} value={trip.emoji} onChange={(v) => change((d) => { d.trip.emoji = v })} maxLength={8} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label={t('First day')} type="date" value={trip.dates.start} onChange={(v) => changeDates(v, trip.dates.end < v ? v : trip.dates.end)} />
        <TextField label={t('Last day')} type="date" value={trip.dates.end} min={trip.dates.start} onChange={(v) => changeDates(trip.dates.start, v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField label={t('Your currency')} value={trip.currency.home} options={CURRENCIES} onChange={(v) => change((d) => { d.trip.currency.home = v })} />
        <SelectField label={t('Local currency')} value={trip.currency.local} options={CURRENCIES} onChange={(v) => change((d) => { d.trip.currency.local = v })} />
      </div>
      <SelectField
        label={t('Language of the app')}
        hint={t('What you and your guests see the app in.')}
        value={trip.locale}
        options={UI_LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
        onChange={(v) => change((d) => { d.trip.locale = v })}
      />
      <SelectField
        label={t('Local language')}
        hint={t('Used for the phrase book’s pronunciation.')}
        value={trip.language.code}
        options={languageOptions}
        onChange={(v) => change((d) => { d.trip.language = { code: v, name: LANGUAGES.find((l) => l.code === v)?.name || '' } })}
      />

      <Card>
        <h3 className="font-bold text-charcoal">{t('Colors')}</h3>
        <p className="text-sm text-charcoal/60 mt-0.5">
          {!known
            ? t('Pick a destination we recognize and the trip can wear the colors of its flag.')
            : wearingFlag
              ? t('Wearing the colors of {place}’s flag {emoji}. Guests see them too.', { place: known.place, emoji: known.emoji })
              : t('Using the original colors. {place}’s flag colors are available.', { place: known.place })}
        </p>
        {known && (
          <button
            type="button"
            onClick={() => { setGreeting(null); change((d) => { d.trip.skin = wearingFlag ? null : known.skin }) }}
            className="min-h-[44px] text-terracotta font-bold"
          >
            {wearingFlag ? t('Back to the original colors') : t('Use {place}’s colors {emoji}', { place: known.place, emoji: known.emoji })}
          </button>
        )}
        {!known && trip.skin && (
          <button type="button" onClick={() => change((d) => { d.trip.skin = null })} className="min-h-[44px] text-terracotta font-bold">
            {t('Back to the original colors')}
          </button>
        )}
      </Card>

      {greeting && trip.skin && (
        <SkinToast
          hello={greeting.hello}
          emoji={greeting.emoji}
          place={greeting.place}
          onKeep={() => setGreeting(null)}
          onRevert={() => { setGreeting(null); change((d) => { d.trip.skin = null }) }}
        />
      )}

      <Card>
        <h3 className="font-bold text-charcoal">{t('Guest passcode')}</h3>
        <p className="text-sm text-charcoal/60 mt-0.5">
          {hasPasscode
            ? t('On. Guests enter it once to open the trip.')
            : t('Off. Anyone with the guest link can open the trip.')}
        </p>
        <form
          className="flex gap-2 mt-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!passcode.trim()) return
            onSetPasscode(passcode.trim())
            setPasscode('')
          }}
        >
          <input
            className={inputClass}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder={hasPasscode ? t('New passcode') : t('Choose a passcode')}
            aria-label={t('New passcode')}
            maxLength={40}
            autoCapitalize="none"
          />
          <button type="submit" className="text-terracotta font-bold px-2 whitespace-nowrap">{t('Set')}</button>
        </form>
        {hasPasscode && (
          <button type="button" onClick={() => onSetPasscode('')} className="text-terracotta text-sm font-bold mt-2 min-h-[32px]">
            {t('Remove passcode')}
          </button>
        )}
      </Card>

      <ToolsCards id={id} doc={doc} onImport={onImport} onShowInstall={onShowInstall} />
    </div>
  )
}
