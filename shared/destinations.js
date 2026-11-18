// "Where is this?" lookup for the create form: typing a country or a
// well-known city fills in the flag, local currency and phrase-book language.
// Each row: [flag, currency, language, country names, cities].
const DESTINATIONS = [
  ['🇲🇽', 'MXN', 'es-MX', ['mexico'], ['mexico city', 'cdmx', 'oaxaca', 'cancun', 'tulum', 'guadalajara', 'playa del carmen', 'puerto vallarta', 'cabo', 'merida', 'san miguel de allende']],
  ['🇪🇸', 'EUR', 'es-ES', ['spain', 'espana'], ['madrid', 'barcelona', 'seville', 'sevilla', 'valencia', 'malaga', 'granada', 'bilbao', 'san sebastian', 'mallorca', 'ibiza', 'tenerife']],
  ['🇫🇷', 'EUR', 'fr-FR', ['france'], ['paris', 'lyon', 'nice', 'marseille', 'bordeaux', 'strasbourg', 'provence', 'chamonix']],
  ['🇮🇹', 'EUR', 'it-IT', ['italy', 'italia'], ['rome', 'roma', 'florence', 'venice', 'milan', 'naples', 'amalfi', 'sicily', 'tuscany', 'bologna', 'turin', 'sardinia', 'lake como', 'cinque terre']],
  ['🇵🇹', 'EUR', 'pt-PT', ['portugal'], ['lisbon', 'lisboa', 'porto', 'algarve', 'madeira', 'azores', 'sintra', 'lagos']],
  ['🇧🇷', 'BRL', 'pt-BR', ['brazil', 'brasil'], ['rio de janeiro', 'rio', 'sao paulo', 'salvador', 'florianopolis']],
  ['🇩🇪', 'EUR', 'de-DE', ['germany', 'deutschland'], ['berlin', 'munich', 'hamburg', 'frankfurt', 'cologne']],
  ['🇦🇹', 'EUR', 'de-DE', ['austria'], ['vienna', 'salzburg', 'innsbruck']],
  ['🇨🇭', 'CHF', 'de-DE', ['switzerland'], ['zurich', 'geneva', 'lucerne', 'zermatt', 'interlaken']],
  ['🇳🇱', 'EUR', 'nl-NL', ['netherlands', 'holland'], ['amsterdam', 'rotterdam', 'the hague', 'utrecht']],
  ['🇧🇪', 'EUR', 'fr-FR', ['belgium'], ['brussels', 'bruges', 'antwerp', 'ghent']],
  ['🇬🇷', 'EUR', 'el-GR', ['greece'], ['athens', 'santorini', 'mykonos', 'crete', 'thessaloniki', 'corfu', 'rhodes', 'paros', 'naxos']],
  ['🇹🇷', 'TRY', 'tr-TR', ['turkey', 'turkiye'], ['istanbul', 'cappadocia', 'antalya', 'bodrum', 'izmir']],
  ['🇯🇵', 'JPY', 'ja-JP', ['japan'], ['tokyo', 'kyoto', 'osaka', 'hokkaido', 'sapporo', 'okinawa', 'hiroshima', 'nara']],
  ['🇰🇷', 'KRW', 'ko-KR', ['south korea', 'korea'], ['seoul', 'busan', 'jeju']],
  ['🇨🇳', 'CNY', 'zh-CN', ['china'], ['beijing', 'shanghai', 'chengdu', 'shenzhen', 'guangzhou', 'xian']],
  ['🇹🇼', 'TWD', 'zh-CN', ['taiwan'], ['taipei']],
  ['🇭🇰', 'HKD', 'zh-CN', ['hong kong'], []],
  ['🇸🇬', 'SGD', 'en-GB', ['singapore'], []],
  ['🇹🇭', 'THB', 'th-TH', ['thailand'], ['bangkok', 'phuket', 'chiang mai', 'koh samui', 'krabi']],
  ['🇻🇳', 'VND', 'vi-VN', ['vietnam'], ['hanoi', 'ho chi minh', 'saigon', 'da nang', 'hoi an']],
  ['🇮🇩', 'IDR', 'id-ID', ['indonesia'], ['bali', 'jakarta', 'ubud', 'lombok']],
  ['🇵🇭', 'PHP', 'en-GB', ['philippines'], ['manila', 'cebu', 'palawan']],
  ['🇲🇾', 'MYR', 'en-GB', ['malaysia'], ['kuala lumpur', 'penang', 'langkawi']],
  ['🇮🇳', 'INR', 'hi-IN', ['india'], ['delhi', 'mumbai', 'goa', 'jaipur', 'agra', 'bangalore', 'kerala']],
  ['🇦🇪', 'AED', 'ar-SA', ['united arab emirates', 'uae'], ['dubai', 'abu dhabi']],
  ['🇲🇦', 'MAD', 'ar-SA', ['morocco'], ['marrakech', 'marrakesh', 'fez', 'casablanca', 'tangier']],
  ['🇪🇬', 'EGP', 'ar-SA', ['egypt'], ['cairo', 'luxor', 'sharm el sheikh']],
  ['🇯🇴', 'JOD', 'ar-SA', ['jordan'], ['amman', 'petra']],
  ['🇮🇱', 'ILS', 'he-IL', ['israel'], ['tel aviv', 'jerusalem']],
  ['🇿🇦', 'ZAR', 'en-GB', ['south africa'], ['cape town', 'johannesburg']],
  ['🇰🇪', 'KES', 'en-GB', ['kenya'], ['nairobi']],
  ['🇦🇷', 'ARS', 'es-MX', ['argentina'], ['buenos aires', 'mendoza', 'patagonia', 'bariloche']],
  ['🇨🇴', 'COP', 'es-MX', ['colombia'], ['bogota', 'medellin', 'cartagena']],
  ['🇵🇪', 'PEN', 'es-MX', ['peru'], ['lima', 'cusco', 'machu picchu']],
  ['🇨🇱', 'CLP', 'es-MX', ['chile'], ['santiago', 'valparaiso']],
  ['🇨🇷', 'CRC', 'es-MX', ['costa rica'], ['san jose', 'tamarindo']],
  ['🇩🇴', 'DOP', 'es-MX', ['dominican republic'], ['punta cana', 'santo domingo']],
  ['🇨🇺', 'CUP', 'es-MX', ['cuba'], ['havana']],
  ['🇵🇷', 'USD', 'es-MX', ['puerto rico'], ['san juan']],
  ['🇬🇧', 'GBP', 'en-GB', ['united kingdom', 'uk', 'england', 'scotland', 'wales', 'britain'], ['london', 'edinburgh', 'manchester', 'glasgow', 'liverpool', 'bath', 'oxford', 'cambridge']],
  ['🇮🇪', 'EUR', 'en-GB', ['ireland'], ['dublin', 'galway', 'cork']],
  ['🇺🇸', 'USD', 'en-US', ['united states', 'usa', 'america'], ['new york', 'nyc', 'los angeles', 'san francisco', 'chicago', 'miami', 'las vegas', 'hawaii', 'maui', 'honolulu', 'new orleans', 'nashville', 'austin', 'seattle', 'boston', 'washington dc', 'denver', 'san diego', 'orlando']],
  ['🇨🇦', 'CAD', 'en-US', ['canada'], ['toronto', 'vancouver', 'montreal', 'banff', 'quebec', 'whistler']],
  ['🇦🇺', 'AUD', 'en-GB', ['australia'], ['sydney', 'melbourne', 'brisbane', 'perth', 'gold coast']],
  ['🇳🇿', 'NZD', 'en-GB', ['new zealand'], ['auckland', 'queenstown', 'wellington']],
  ['🇸🇪', 'SEK', 'sv-SE', ['sweden'], ['stockholm', 'gothenburg']],
  ['🇳🇴', 'NOK', 'nb-NO', ['norway'], ['oslo', 'bergen', 'tromso', 'lofoten']],
  ['🇩🇰', 'DKK', 'da-DK', ['denmark'], ['copenhagen', 'aarhus']],
  ['🇫🇮', 'EUR', 'fi-FI', ['finland'], ['helsinki', 'lapland', 'rovaniemi']],
  ['🇮🇸', 'ISK', 'is-IS', ['iceland'], ['reykjavik']],
  ['🇨🇿', 'CZK', 'cs-CZ', ['czech republic', 'czechia'], ['prague']],
  ['🇵🇱', 'PLN', 'pl-PL', ['poland'], ['warsaw', 'krakow', 'gdansk']],
  ['🇭🇺', 'HUF', 'hu-HU', ['hungary'], ['budapest']],
  ['🇭🇷', 'EUR', 'hr-HR', ['croatia'], ['dubrovnik', 'split', 'zagreb', 'hvar']],
]

// Lowercase and strip accents so "São Paulo", "sao paulo" and "SAO PAULO" match.
const plain = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const hasWord = (haystack, word) => new RegExp(`(^|[^a-z])${word}([^a-z]|$)`).test(haystack)

export function suggestLocale(destination) {
  const text = plain(destination || '').trim()
  if (!text) return null
  // Cities first: "Lagos, Portugal" should win over nothing, and a city is
  // the more specific thing to have typed. Longer names first so that
  // "new york" is not shadowed by a shorter overlapping name.
  let best = null
  for (const [emoji, currency, language, countries, cities] of DESTINATIONS) {
    for (const name of [...countries, ...cities]) {
      if (hasWord(text, name) && (!best || name.length > best.name.length)) {
        best = { name, emoji, currency, language }
      }
    }
  }
  return best && { emoji: best.emoji, currency: best.currency, language: best.language }
}
