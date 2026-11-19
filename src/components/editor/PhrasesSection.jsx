import { AddButton, ItemCard, TextField } from './fields'
import { buttonSecondary } from '../Page'
import { useT } from '../../i18n/LocaleContext'
import { hasStarterPhrases, starterPhrases } from '../../../shared/phrasePacks'

export function PhrasesSection({ doc, change }) {
  const t = useT()
  const set = (i, key) => (value) => change((d) => { d.phrases[i][key] = value })
  const language = doc.trip.language.name || t('the local language')
  const lastCategory = doc.phrases.at(-1)?.category || 'basics'

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-charcoal/60">
        {t('Handy phrases in {language}. Guests can tap to hear each one spoken. Phrases with the same group appear together.', { language })}
      </p>
      {doc.phrases.length === 0 && hasStarterPhrases(doc.trip.language.code) && (
        <button type="button" className={buttonSecondary} onClick={() => change((d) => { d.phrases = starterPhrases(d.trip.language.code) })}>
          {t('Add the starter phrase book')}
        </button>
      )}
      {doc.phrases.map((phrase, i) => (
        <ItemCard key={i} title={phrase.english || t('Phrase {n}', { n: i + 1 })} onRemove={() => change((d) => { d.phrases.splice(i, 1) })}>
          <TextField label={t('In English')} value={phrase.english} onChange={set(i, 'english')} maxLength={200} />
          <TextField label={t('Translation')} value={phrase.translation} onChange={set(i, 'translation')} maxLength={200} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label={t('Sounds like (optional)')} value={phrase.phonetic} onChange={set(i, 'phonetic')} maxLength={200} />
            <TextField label={t('Group')} value={phrase.category} onChange={set(i, 'category')} placeholder={t('basics')} maxLength={30} autoCapitalize="none" />
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => change((d) => { d.phrases.push({ category: lastCategory, english: '', translation: '', phonetic: '' }) })}>
        {t('Add a phrase')}
      </AddButton>
    </div>
  )
}
