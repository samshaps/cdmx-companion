// Known destinations for the create form's picklist: choosing one fills in
// the flag, local currency and phrase-book language. Anything not listed
// can still be typed freely; those fields are then set by hand.
// Each row: [flag, currency, language, country, cities, other spellings].
const DESTINATIONS = [
  ['🇲🇽', 'MXN', 'es-MX', 'Mexico', ['Mexico City', 'Oaxaca', 'Cancún', 'Tulum', 'Guadalajara', 'Playa del Carmen', 'Puerto Vallarta', 'Cabo San Lucas', 'Mérida', 'San Miguel de Allende', 'Cozumel'], ['cdmx', 'cabo']],
  ['🇪🇸', 'EUR', 'es-ES', 'Spain', ['Madrid', 'Barcelona', 'Seville', 'Valencia', 'Málaga', 'Granada', 'Bilbao', 'San Sebastián', 'Mallorca', 'Ibiza', 'Tenerife'], ['espana', 'sevilla']],
  ['🇫🇷', 'EUR', 'fr-FR', 'France', ['Paris', 'Lyon', 'Nice', 'Marseille', 'Bordeaux', 'Strasbourg', 'Provence', 'Chamonix'], []],
  ['🇮🇹', 'EUR', 'it-IT', 'Italy', ['Rome', 'Florence', 'Venice', 'Milan', 'Naples', 'Amalfi Coast', 'Sicily', 'Tuscany', 'Bologna', 'Turin', 'Sardinia', 'Lake Como', 'Cinque Terre'], ['italia', 'roma', 'amalfi']],
  ['🇵🇹', 'EUR', 'pt-PT', 'Portugal', ['Lisbon', 'Porto', 'Algarve', 'Madeira', 'Azores', 'Sintra', 'Lagos'], ['lisboa']],
  ['🇧🇷', 'BRL', 'pt-BR', 'Brazil', ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Florianópolis'], ['brasil', 'rio']],
  ['🇩🇪', 'EUR', 'de-DE', 'Germany', ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'], ['deutschland']],
  ['🇦🇹', 'EUR', 'de-DE', 'Austria', ['Vienna', 'Salzburg', 'Innsbruck'], []],
  ['🇨🇭', 'CHF', 'de-DE', 'Switzerland', ['Zurich', 'Geneva', 'Lucerne', 'Zermatt', 'Interlaken'], []],
  ['🇳🇱', 'EUR', 'nl-NL', 'Netherlands', ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'], ['holland']],
  ['🇧🇪', 'EUR', 'fr-FR', 'Belgium', ['Brussels', 'Bruges', 'Antwerp', 'Ghent'], []],
  ['🇬🇷', 'EUR', 'el-GR', 'Greece', ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Thessaloniki', 'Corfu', 'Rhodes', 'Paros', 'Naxos'], []],
  ['🇹🇷', 'TRY', 'tr-TR', 'Turkey', ['Istanbul', 'Cappadocia', 'Antalya', 'Bodrum', 'Izmir'], ['turkiye']],
  ['🇨🇾', 'EUR', 'el-GR', 'Cyprus', ['Paphos', 'Limassol'], []],
  ['🇲🇹', 'EUR', 'en-GB', 'Malta', ['Valletta'], []],
  ['🇯🇵', 'JPY', 'ja-JP', 'Japan', ['Tokyo', 'Kyoto', 'Osaka', 'Hokkaido', 'Sapporo', 'Okinawa', 'Hiroshima', 'Nara'], []],
  ['🇰🇷', 'KRW', 'ko-KR', 'South Korea', ['Seoul', 'Busan', 'Jeju'], ['korea']],
  ['🇨🇳', 'CNY', 'zh-CN', 'China', ["Beijing", "Shanghai", "Chengdu", "Shenzhen", "Guangzhou", "Xi'an"], ['xian']],
  ['🇹🇼', 'TWD', 'zh-CN', 'Taiwan', ['Taipei'], []],
  ['🇭🇰', 'HKD', 'zh-CN', 'Hong Kong', [], []],
  ['🇸🇬', 'SGD', 'en-GB', 'Singapore', [], []],
  ['🇹🇭', 'THB', 'th-TH', 'Thailand', ['Bangkok', 'Phuket', 'Chiang Mai', 'Koh Samui', 'Krabi'], []],
  ['🇻🇳', 'VND', 'vi-VN', 'Vietnam', ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An'], ['saigon', 'ho chi minh']],
  ['🇰🇭', 'KHR', 'en-GB', 'Cambodia', ['Siem Reap', 'Phnom Penh'], []],
  ['🇮🇩', 'IDR', 'id-ID', 'Indonesia', ['Bali', 'Jakarta', 'Ubud', 'Lombok'], []],
  ['🇵🇭', 'PHP', 'en-GB', 'Philippines', ['Manila', 'Cebu', 'Palawan'], []],
  ['🇲🇾', 'MYR', 'en-GB', 'Malaysia', ['Kuala Lumpur', 'Penang', 'Langkawi'], []],
  ['🇮🇳', 'INR', 'hi-IN', 'India', ['Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Bangalore', 'Kerala'], []],
  ['🇱🇰', 'LKR', 'en-GB', 'Sri Lanka', ['Colombo'], []],
  ['🇳🇵', 'NPR', 'en-GB', 'Nepal', ['Kathmandu'], []],
  ['🇲🇻', 'MVR', 'en-GB', 'Maldives', ['Malé'], []],
  ['🇦🇪', 'AED', 'ar-SA', 'United Arab Emirates', ['Dubai', 'Abu Dhabi'], ['uae']],
  ['🇶🇦', 'QAR', 'ar-SA', 'Qatar', ['Doha'], []],
  ['🇸🇦', 'SAR', 'ar-SA', 'Saudi Arabia', ['Riyadh', 'Jeddah'], []],
  ['🇲🇦', 'MAD', 'ar-SA', 'Morocco', ['Marrakech', 'Fez', 'Casablanca', 'Tangier'], ['marrakesh']],
  ['🇪🇬', 'EGP', 'ar-SA', 'Egypt', ['Cairo', 'Luxor', 'Sharm El Sheikh'], []],
  ['🇯🇴', 'JOD', 'ar-SA', 'Jordan', ['Amman', 'Petra'], []],
  ['🇮🇱', 'ILS', 'he-IL', 'Israel', ['Tel Aviv', 'Jerusalem'], []],
  ['🇿🇦', 'ZAR', 'en-GB', 'South Africa', ['Cape Town', 'Johannesburg'], []],
  ['🇰🇪', 'KES', 'en-GB', 'Kenya', ['Nairobi'], []],
  ['🇹🇿', 'TZS', 'en-GB', 'Tanzania', ['Zanzibar', 'Arusha'], []],
  ['🇲🇺', 'MUR', 'en-GB', 'Mauritius', [], []],
  ['🇸🇨', 'SCR', 'en-GB', 'Seychelles', [], []],
  ['🇦🇷', 'ARS', 'es-MX', 'Argentina', ['Buenos Aires', 'Mendoza', 'Patagonia', 'Bariloche'], []],
  ['🇨🇴', 'COP', 'es-MX', 'Colombia', ['Bogotá', 'Medellín', 'Cartagena'], []],
  ['🇵🇪', 'PEN', 'es-MX', 'Peru', ['Lima', 'Cusco', 'Machu Picchu'], []],
  ['🇨🇱', 'CLP', 'es-MX', 'Chile', ['Santiago', 'Valparaíso'], []],
  ['🇺🇾', 'UYU', 'es-MX', 'Uruguay', ['Montevideo', 'Punta del Este'], []],
  ['🇪🇨', 'USD', 'es-MX', 'Ecuador', ['Quito', 'Galápagos'], []],
  ['🇧🇴', 'BOB', 'es-MX', 'Bolivia', ['La Paz'], []],
  ['🇨🇷', 'CRC', 'es-MX', 'Costa Rica', ['San José', 'Tamarindo'], []],
  ['🇵🇦', 'PAB', 'es-MX', 'Panama', ['Panama City', 'Bocas del Toro'], []],
  ['🇬🇹', 'GTQ', 'es-MX', 'Guatemala', ['Antigua Guatemala'], []],
  ['🇧🇿', 'BZD', 'en-US', 'Belize', ['San Pedro', 'Caye Caulker'], []],
  ['🇩🇴', 'DOP', 'es-MX', 'Dominican Republic', ['Punta Cana', 'Santo Domingo'], []],
  ['🇨🇺', 'CUP', 'es-MX', 'Cuba', ['Havana'], []],
  ['🇵🇷', 'USD', 'es-MX', 'Puerto Rico', ['San Juan'], []],
  ['🇦🇼', 'AWG', 'nl-NL', 'Aruba', ['Oranjestad'], []],
  ['🇨🇼', 'XCG', 'nl-NL', 'Curaçao', ['Willemstad'], []],
  ['🇧🇶', 'USD', 'nl-NL', 'Bonaire', [], []],
  ['🇸🇽', 'XCG', 'nl-NL', 'Sint Maarten', [], []],
  ['🇲🇫', 'EUR', 'fr-FR', 'Saint Martin', [], ['st martin', 'st. martin']],
  ['🇧🇱', 'EUR', 'fr-FR', 'Saint Barthélemy', [], ['st barts', 'st. barts', 'st barths', 'saint barts']],
  ['🇲🇶', 'EUR', 'fr-FR', 'Martinique', [], []],
  ['🇬🇵', 'EUR', 'fr-FR', 'Guadeloupe', [], []],
  ['🇭🇹', 'HTG', 'fr-FR', 'Haiti', [], []],
  ['🇯🇲', 'JMD', 'en-US', 'Jamaica', ['Montego Bay', 'Negril', 'Kingston', 'Ocho Rios'], []],
  ['🇧🇸', 'BSD', 'en-US', 'Bahamas', ['Nassau', 'Exuma'], []],
  ['🇧🇧', 'BBD', 'en-US', 'Barbados', ['Bridgetown'], []],
  ['🇹🇹', 'TTD', 'en-US', 'Trinidad and Tobago', [], ['trinidad', 'tobago']],
  ['🇰🇾', 'KYD', 'en-US', 'Cayman Islands', ['Grand Cayman'], []],
  ['🇹🇨', 'USD', 'en-US', 'Turks and Caicos', ['Providenciales'], ['turks & caicos']],
  ['🇻🇬', 'USD', 'en-US', 'British Virgin Islands', ['Tortola', 'Virgin Gorda'], ['bvi']],
  ['🇻🇮', 'USD', 'en-US', 'US Virgin Islands', ['St. Thomas', 'St. John', 'St. Croix'], ['usvi', 'st thomas', 'st john', 'st croix']],
  ['🇱🇨', 'XCD', 'en-US', 'Saint Lucia', [], ['st lucia', 'st. lucia']],
  ['🇦🇬', 'XCD', 'en-US', 'Antigua and Barbuda', ['Antigua'], []],
  ['🇬🇩', 'XCD', 'en-US', 'Grenada', [], []],
  ['🇰🇳', 'XCD', 'en-US', 'Saint Kitts and Nevis', [], ['st kitts', 'st. kitts', 'nevis']],
  ['🇩🇲', 'XCD', 'en-US', 'Dominica', [], []],
  ['🇻🇨', 'XCD', 'en-US', 'Saint Vincent and the Grenadines', [], ['st vincent', 'st. vincent', 'grenadines']],
  ['🇦🇮', 'XCD', 'en-US', 'Anguilla', [], []],
  ['🇧🇲', 'BMD', 'en-US', 'Bermuda', [], []],
  ['🇬🇧', 'GBP', 'en-GB', 'United Kingdom', ['London', 'Edinburgh', 'Manchester', 'Glasgow', 'Liverpool', 'Bath', 'Oxford', 'Cambridge'], ['uk', 'england', 'scotland', 'wales', 'britain']],
  ['🇮🇪', 'EUR', 'en-GB', 'Ireland', ['Dublin', 'Galway', 'Cork'], []],
  ['🇺🇸', 'USD', 'en-US', 'United States', ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Miami', 'Las Vegas', 'Hawaii', 'Maui', 'Honolulu', 'New Orleans', 'Nashville', 'Austin', 'Seattle', 'Boston', 'Washington DC', 'Denver', 'San Diego', 'Orlando'], ['usa', 'america', 'nyc']],
  ['🇨🇦', 'CAD', 'en-US', 'Canada', ['Toronto', 'Vancouver', 'Montreal', 'Banff', 'Quebec City', 'Whistler'], ['quebec']],
  ['🇦🇺', 'AUD', 'en-GB', 'Australia', ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast'], []],
  ['🇳🇿', 'NZD', 'en-GB', 'New Zealand', ['Auckland', 'Queenstown', 'Wellington'], []],
  ['🇫🇯', 'FJD', 'en-GB', 'Fiji', [], []],
  ['🇵🇫', 'XPF', 'fr-FR', 'French Polynesia', ['Tahiti', 'Bora Bora', 'Moorea'], []],
  ['🇸🇪', 'SEK', 'sv-SE', 'Sweden', ['Stockholm', 'Gothenburg'], []],
  ['🇳🇴', 'NOK', 'nb-NO', 'Norway', ['Oslo', 'Bergen', 'Tromsø', 'Lofoten'], []],
  ['🇩🇰', 'DKK', 'da-DK', 'Denmark', ['Copenhagen', 'Aarhus'], []],
  ['🇫🇮', 'EUR', 'fi-FI', 'Finland', ['Helsinki', 'Lapland', 'Rovaniemi'], []],
  ['🇮🇸', 'ISK', 'is-IS', 'Iceland', ['Reykjavik'], []],
  ['🇨🇿', 'CZK', 'cs-CZ', 'Czech Republic', ['Prague'], ['czechia']],
  ['🇵🇱', 'PLN', 'pl-PL', 'Poland', ['Warsaw', 'Kraków', 'Gdańsk'], []],
  ['🇭🇺', 'HUF', 'hu-HU', 'Hungary', ['Budapest'], []],
  ['🇭🇷', 'EUR', 'hr-HR', 'Croatia', ['Dubrovnik', 'Split', 'Zagreb', 'Hvar'], []],
  ['🇸🇮', 'EUR', 'en-GB', 'Slovenia', ['Ljubljana', 'Lake Bled'], []],
  ['🇷🇴', 'RON', 'en-GB', 'Romania', ['Bucharest'], []],
  ['🇧🇬', 'BGN', 'en-GB', 'Bulgaria', ['Sofia'], []],
  ['🇬🇪', 'GEL', 'en-GB', 'Georgia (country)', ['Tbilisi'], []],
]

// Lowercase and strip accents so "São Paulo", "sao paulo" and "SAO PAULO" match.
const plain = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// Every pickable place, cities labelled with their country. `keys` are the
// spellings that find it; other spellings ("CDMX", "St Barts") lead to the country.
const PLACES = DESTINATIONS.flatMap(([emoji, currency, language, country, cities, aliases]) => {
  const locale = { emoji, currency, language }
  return [
    { label: country, keys: [country, ...aliases].map(plain), ...locale },
    ...cities.map((city) => ({ label: `${city}, ${country}`, keys: [plain(city)], ...locale })),
  ]
})

const hasWord = (haystack, word) => {
  const at = haystack.indexOf(word)
  if (at === -1) return false
  const before = haystack[at - 1]
  const after = haystack[at + word.length]
  return !(before && /[a-z]/.test(before)) && !(after && /[a-z]/.test(after))
}

// Best guess for free text such as "a week in new york": the longest known
// name that appears as a whole word.
export function suggestLocale(destination) {
  const text = plain(destination || '')
  if (!text) return null
  let best = null
  for (const place of PLACES) {
    for (const key of place.keys) {
      if (hasWord(text, key) && (!best || key.length > best.key.length)) best = { key, ...place }
    }
  }
  return best && { emoji: best.emoji, currency: best.currency, language: best.language }
}

// Picklist matches for what has been typed so far: names that start with it
// first, then names that contain it.
export function searchDestinations(query, limit = 6) {
  const text = plain(query || '')
  if (!text) return []
  const starts = PLACES.filter((p) => p.keys.some((key) => key.startsWith(text)))
  const contains = PLACES.filter((p) => !starts.includes(p) && plain(p.label).includes(text))
  // Places whose own name matches come before ones found by another spelling.
  const rank = (p) => (p.keys[0].startsWith(text) ? 0 : 1)
  const byLength = (a, b) => rank(a) - rank(b) || a.label.length - b.label.length
  return [...starts.sort(byLength), ...contains.sort(byLength)]
    .slice(0, limit)
    .map(({ label, emoji, currency, language }) => ({ label, emoji, currency, language }))
}
