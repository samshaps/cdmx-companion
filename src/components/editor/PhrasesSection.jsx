import { AddButton, ItemCard, TextField } from './fields'

export function PhrasesSection({ doc, change }) {
  const set = (i, key) => (value) => change((d) => { d.phrases[i][key] = value })
  const language = doc.trip.language.name || 'the local language'
  const lastCategory = doc.phrases.at(-1)?.category || 'basics'

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-charcoal/60">
        Handy phrases in {language}. Guests can tap to hear each one spoken. Phrases with the same group appear together.
      </p>
      {doc.phrases.map((phrase, i) => (
        <ItemCard key={i} title={phrase.english || `Phrase ${i + 1}`} onRemove={() => change((d) => { d.phrases.splice(i, 1) })}>
          <TextField label="In English" value={phrase.english} onChange={set(i, 'english')} maxLength={200} />
          <TextField label="Translation" value={phrase.translation} onChange={set(i, 'translation')} maxLength={200} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Sounds like (optional)" value={phrase.phonetic} onChange={set(i, 'phonetic')} maxLength={200} />
            <TextField label="Group" value={phrase.category} onChange={set(i, 'category')} placeholder="basics" maxLength={30} autoCapitalize="none" />
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => change((d) => { d.phrases.push({ category: lastCategory, english: '', translation: '', phonetic: '' }) })}>
        Add a phrase
      </AddButton>
    </div>
  )
}
