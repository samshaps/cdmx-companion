import { Card } from '../components/Card'
import { Link, buttonPrimary, buttonSecondary } from '../components/Page'
import { useT } from '../i18n/LocaleContext'
import { getMyTrips } from '../lib/localTrips'

const tx = (s) => s // marks text for translation; translated where rendered

// What the group chat sounds like without it.
const QUESTIONS = [
  tx('wait what’s the wifi'),
  tx('which airbnb is it again'),
  tx('what time is dinner??'),
  tx('can someone send the address'),
]

const FOR_YOU = [
  tx('Set the whole trip up in about ten minutes.'),
  tx('Change the plan and everyone’s copy updates.'),
  tx('Stop being the group’s help desk.'),
]

const FOR_THEM = [
  tx('Nothing to download. No account.'),
  tx('Wifi, address and tonight’s plan, one tap away.'),
  tx('Still works when their signal doesn’t.'),
]

const FEATURES = [
  ['🏠', tx('The stay'), tx('Address, wifi, door code and house notes, one tap from Uber or Maps.')],
  ['🗓️', tx('The plan'), tx('A day-by-day schedule that highlights what is happening now and next.')],
  ['🧭', tx('The city'), tx('Your saved places sorted by distance, key phrases, and a currency converter.')],
]

const STEPS = [
  [tx('Name the trip'), tx('Where and when. It takes a minute.')],
  [tx('Fill in what you know'), tx('The stay, the plan, your favorite spots. Paste your Airbnb link to get a head start.')],
  [tx('Drop the link in the group chat'), tx('They add it to their home screen. You’re done.')],
]

function Phone({ src, alt, className = '' }) {
  return (
    <div className={`w-52 shrink-0 rounded-[2rem] border-[6px] border-charcoal bg-white overflow-hidden shadow-card ${className}`}>
      <img src={src} alt={alt} className="w-full block" loading="lazy" />
    </div>
  )
}

function Checklist({ items, t }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-charcoal/80">
          <span className="text-teal font-bold">✓</span>
          <span>{t(item)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Landing() {
  const t = useT()
  const myTrips = getMyTrips()

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-md md:max-w-4xl mx-auto px-5 pt-8 pb-20">
        <p className="font-display font-bold text-charcoal text-lg">🧳 {t('Trip Companion')}</p>

        {/* Hero */}
        <div className="md:flex md:items-center md:gap-12 mt-8 md:mt-12">
          <div className="md:flex-1">
            <p className="inline-block text-xs font-bold uppercase tracking-wide text-teal bg-teal/10 rounded-full px-3 py-1">
              {t('Free · Nothing to download · No sign-ups')}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mt-4 leading-tight">
              {t('For Type A people with Type B friends.')}
            </h1>
            <p className="text-charcoal/70 text-lg mt-4 leading-relaxed">
              {t('Put the whole trip behind one link: where you’re staying, the plan, the wifi.')}{' '}
              <strong className="text-charcoal">{t('You get to feel organized. They get to show up.')}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link to="/new" className={buttonPrimary}>{t('Create a trip')}</Link>
              <Link to="/demo" className={buttonSecondary}>{t('See the demo trip')}</Link>
            </div>
          </div>
          <div className="flex justify-center mt-10 md:mt-0">
            <Phone src="/images/preview-home.jpg" alt={t('The Home tab of a trip: address, wifi and house notes')} className="-rotate-2" />
            <Phone src="/images/preview-schedule.jpg" alt={t('The Schedule tab of a trip')} className="hidden sm:block rotate-3 -ml-8 mt-10" />
          </div>
        </div>

        {myTrips.length > 0 && (
          <div className="mt-12 max-w-md">
            <h2 className="font-display text-lg font-bold text-charcoal mb-3">{t('Your trips')}</h2>
            <div className="flex flex-col gap-3">
              {myTrips.map((trip) => (
                <Link key={trip.id} to={`/t/${trip.id}/edit`}>
                  <Card interactive>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal">{trip.name}</span>
                      <span className="text-terracotta font-medium text-sm">{t('Manage')} →</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* The problem, as a group chat */}
        <div className="mt-16 md:mt-24 md:flex md:items-center md:gap-12">
          <div className="md:flex-1">
            <h2 className="font-display text-3xl font-bold text-charcoal">{t('You planned it. Now you’re the help desk.')}</h2>
            <p className="text-charcoal/70 mt-3 leading-relaxed">
              {t('Every trip has one person who knows everything, and a group chat that keeps asking them. Send one link instead.')}
            </p>
          </div>
          <div className="md:flex-1 mt-6 md:mt-0 flex flex-col gap-2" aria-hidden="true">
            {QUESTIONS.map((question, i) => (
              <p key={question} className={`self-start bg-white rounded-2xl rounded-bl-sm shadow-card px-4 py-2 text-charcoal/80 ${i % 2 ? 'ml-6' : ''}`}>
                {t(question)}
              </p>
            ))}
            <p className="self-end bg-teal text-white rounded-2xl rounded-br-sm shadow-card px-4 py-2 mt-2 font-medium">
              {t('it’s all in the link 👆')}
            </p>
          </div>
        </div>

        {/* You / them */}
        <div className="grid md:grid-cols-2 gap-4 mt-16 md:mt-24">
          <Card>
            <p className="text-xs font-bold uppercase tracking-wide text-terracotta">{t('You')}</p>
            <h3 className="font-display text-2xl font-bold text-charcoal mt-1">{t('Get to feel organized')}</h3>
            <Checklist items={FOR_YOU} t={t} />
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-wide text-terracotta">{t('Them')}</p>
            <h3 className="font-display text-2xl font-bold text-charcoal mt-1">{t('Get to show up')}</h3>
            <Checklist items={FOR_THEM} t={t} />
          </Card>
        </div>

        {/* What is in it */}
        <h2 className="font-display text-3xl font-bold text-charcoal mt-16 md:mt-24">{t('Everything they’ll ask about')}</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-5">
          {FEATURES.map(([emoji, title, body]) => (
            <Card key={title}>
              <span className="text-3xl">{emoji}</span>
              <h3 className="font-bold text-charcoal mt-2">{t(title)}</h3>
              <p className="text-sm text-charcoal/70 mt-0.5">{t(body)}</p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <h2 className="font-display text-3xl font-bold text-charcoal mt-16 md:mt-24">{t('Three steps, then you’re done')}</h2>
        <ol className="grid md:grid-cols-3 gap-6 mt-5">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex md:block gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-teal text-white font-bold flex items-center justify-center">{i + 1}</span>
              <div className="md:mt-3">
                <h3 className="font-bold text-charcoal">{t(title)}</h3>
                <p className="text-sm text-charcoal/70 mt-0.5">{t(body)}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Closing call to action */}
        <div className="mt-16 md:mt-24 bg-teal rounded-card p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white">{t('Be the friend with the link.')}</h2>
          <p className="text-white/80 mt-2">{t('Free, and ready before your coffee’s cold.')}</p>
          <Link to="/new" className="inline-flex items-center justify-center min-h-[48px] bg-white text-teal font-bold rounded-card px-8 mt-5 active:scale-[0.98] transition-transform">
            {t('Create your trip')}
          </Link>
        </div>

        <p className="text-center text-xs text-charcoal/40 mt-10">
          {t('Free and open source. Trips are deleted automatically 30 days after they end.')}
        </p>
      </div>
    </div>
  )
}
