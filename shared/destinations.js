// Known destinations for the create form's picklist: choosing one fills in
// the flag, local currency and phrase-book language, and offers a color
// skin taken from the flag. Anything not listed can still be typed freely.
//
// Each row: [flag, currency, language, name, cities, other spellings,
//            flag colors (primary accent highlight), hello, region?]
// US states carry the region "USA" and their state flag's colors.
import { skinFromNames } from './skins.js'

const DESTINATIONS = [
  ["🇲🇽", "MXN", "es-MX", "Mexico", ["Mexico City", "Oaxaca", "Cancún", "Tulum", "Guadalajara", "Playa del Carmen", "Puerto Vallarta", "Cabo San Lucas", "Mérida", "San Miguel de Allende", "Cozumel"], ["cdmx", "cabo"], "darkgreen red gold", "¡Hola!"],
  ["🇪🇸", "EUR", "es-ES", "Spain", ["Madrid", "Barcelona", "Seville", "Valencia", "Málaga", "Granada", "Bilbao", "San Sebastián", "Mallorca", "Ibiza", "Tenerife"], ["espana", "sevilla"], "red darkred yellow", "¡Hola!"],
  ["🇫🇷", "EUR", "fr-FR", "France", ["Paris", "Lyon", "Nice", "Marseille", "Bordeaux", "Strasbourg", "Provence", "Chamonix"], [], "blue red lightblue", "Bonjour !"],
  ["🇮🇹", "EUR", "it-IT", "Italy", ["Rome", "Florence", "Venice", "Milan", "Naples", "Amalfi Coast", "Sicily", "Tuscany", "Bologna", "Turin", "Sardinia", "Lake Como", "Cinque Terre"], ["italia", "roma", "amalfi"], "green red mint", "Ciao!"],
  ["🇵🇹", "EUR", "pt-PT", "Portugal", ["Lisbon", "Porto", "Algarve", "Madeira", "Azores", "Sintra", "Lagos"], ["lisboa"], "darkgreen red yellow", "Olá!"],
  ["🇧🇷", "BRL", "pt-BR", "Brazil", ["Rio de Janeiro", "São Paulo", "Salvador", "Florianópolis"], ["brasil", "rio"], "green royal yellow", "Olá!"],
  ["🇩🇪", "EUR", "de-DE", "Germany", ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"], ["deutschland"], "black red gold", "Hallo!"],
  ["🇦🇹", "EUR", "de-DE", "Austria", ["Vienna", "Salzburg", "Innsbruck"], [], "red darkred coral", "Servus!"],
  ["🇨🇭", "CHF", "de-DE", "Switzerland", ["Zurich", "Geneva", "Lucerne", "Zermatt", "Interlaken"], [], "red darkred coral", "Grüezi!"],
  ["🇳🇱", "EUR", "nl-NL", "Netherlands", ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"], ["holland"], "royal red orange", "Hallo!"],
  ["🇧🇪", "EUR", "fr-FR", "Belgium", ["Brussels", "Bruges", "Antwerp", "Ghent"], [], "black red yellow", "Bonjour !"],
  ["🇬🇷", "EUR", "el-GR", "Greece", ["Athens", "Santorini", "Mykonos", "Crete", "Thessaloniki", "Corfu", "Rhodes", "Paros", "Naxos"], [], "blue royal lightblue", "Γεια σας!"],
  ["🇹🇷", "TRY", "tr-TR", "Turkey", ["Istanbul", "Cappadocia", "Antalya", "Bodrum", "Izmir"], ["turkiye"], "red darkred coral", "Merhaba!"],
  ["🇨🇾", "EUR", "el-GR", "Cyprus", ["Paphos", "Limassol"], [], "copper darkgreen gold", "Γεια σας!"],
  ["🇲🇹", "EUR", "en-GB", "Malta", ["Valletta"], [], "red darkred coral", "Bonġu!"],
  ["🇯🇵", "JPY", "ja-JP", "Japan", ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Sapporo", "Okinawa", "Hiroshima", "Nara"], [], "crimson darkred coral", "こんにちは！"],
  ["🇰🇷", "KRW", "ko-KR", "South Korea", ["Seoul", "Busan", "Jeju"], ["korea"], "royal red sky", "안녕하세요!"],
  ["🇨🇳", "CNY", "zh-CN", "China", ["Beijing", "Shanghai", "Chengdu", "Shenzhen", "Guangzhou", "Xi'an"], ["xian"], "red darkred yellow", "你好！"],
  ["🇹🇼", "TWD", "zh-CN", "Taiwan", ["Taipei"], [], "royal red sky", "你好！"],
  ["🇭🇰", "HKD", "zh-CN", "Hong Kong", [], [], "red darkred coral", "你好！"],
  ["🇸🇬", "SGD", "en-GB", "Singapore", [], [], "red darkred coral", "Hello!"],
  ["🇹🇭", "THB", "th-TH", "Thailand", ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui", "Krabi"], [], "navy red sky", "สวัสดี!"],
  ["🇻🇳", "VND", "vi-VN", "Vietnam", ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An"], ["saigon", "ho chi minh"], "red darkred yellow", "Xin chào!"],
  ["🇰🇭", "KHR", "en-GB", "Cambodia", ["Siem Reap", "Phnom Penh"], [], "royal red sky", "សួស្តី!"],
  ["🇮🇩", "IDR", "id-ID", "Indonesia", ["Bali", "Jakarta", "Ubud", "Lombok"], [], "red darkred coral", "Halo!"],
  ["🇵🇭", "PHP", "en-GB", "Philippines", ["Manila", "Cebu", "Palawan"], [], "royal red yellow", "Kumusta!"],
  ["🇲🇾", "MYR", "en-GB", "Malaysia", ["Kuala Lumpur", "Penang", "Langkawi"], [], "navy red yellow", "Hai!"],
  ["🇮🇳", "INR", "hi-IN", "India", ["Delhi", "Mumbai", "Goa", "Jaipur", "Agra", "Bangalore", "Kerala"], [], "darkgreen navy saffron", "नमस्ते!"],
  ["🇱🇰", "LKR", "en-GB", "Sri Lanka", ["Colombo"], [], "maroon darkgreen gold", "Ayubowan!"],
  ["🇳🇵", "NPR", "en-GB", "Nepal", ["Kathmandu"], [], "crimson royal coral", "Namaste!"],
  ["🇲🇻", "MVR", "en-GB", "Maldives", ["Malé"], [], "darkgreen red mint", "Assalaamu alaikum!"],
  ["🇦🇪", "AED", "ar-SA", "United Arab Emirates", ["Dubai", "Abu Dhabi"], ["uae"], "green red mint", "!مرحبا"],
  ["🇶🇦", "QAR", "ar-SA", "Qatar", ["Doha"], [], "maroon darkred coral", "!مرحبا"],
  ["🇸🇦", "SAR", "ar-SA", "Saudi Arabia", ["Riyadh", "Jeddah"], [], "darkgreen green mint", "!مرحبا"],
  ["🇲🇦", "MAD", "ar-SA", "Morocco", ["Marrakech", "Fez", "Casablanca", "Tangier"], ["marrakesh"], "red darkgreen mint", "!مرحبا"],
  ["🇪🇬", "EGP", "ar-SA", "Egypt", ["Cairo", "Luxor", "Sharm El Sheikh"], [], "black red gold", "!مرحبا"],
  ["🇯🇴", "JOD", "ar-SA", "Jordan", ["Amman", "Petra"], [], "black red mint", "!مرحبا"],
  ["🇮🇱", "ILS", "he-IL", "Israel", ["Tel Aviv", "Jerusalem"], [], "royal blue lightblue", "!שלום"],
  ["🇿🇦", "ZAR", "en-GB", "South Africa", ["Cape Town", "Johannesburg"], [], "green navy gold", "Sawubona!"],
  ["🇰🇪", "KES", "en-GB", "Kenya", ["Nairobi"], [], "black red green", "Jambo!"],
  ["🇹🇿", "TZS", "en-GB", "Tanzania", ["Zanzibar", "Arusha"], [], "green blue yellow", "Jambo!"],
  ["🇲🇺", "MUR", "en-GB", "Mauritius", [], [], "red royal yellow", "Bonzour!"],
  ["🇸🇨", "SCR", "en-GB", "Seychelles", [], [], "royal red yellow", "Bonzour!"],
  ["🇦🇷", "ARS", "es-MX", "Argentina", ["Buenos Aires", "Mendoza", "Patagonia", "Bariloche"], [], "lightblue royal gold", "¡Hola!"],
  ["🇨🇴", "COP", "es-MX", "Colombia", ["Bogotá", "Medellín", "Cartagena"], [], "royal red yellow", "¡Hola!"],
  ["🇵🇪", "PEN", "es-MX", "Peru", ["Lima", "Cusco", "Machu Picchu"], [], "red darkred coral", "¡Hola!"],
  ["🇨🇱", "CLP", "es-MX", "Chile", ["Santiago", "Valparaíso"], [], "royal red sky", "¡Hola!"],
  ["🇺🇾", "UYU", "es-MX", "Uruguay", ["Montevideo", "Punta del Este"], [], "royal blue gold", "¡Hola!"],
  ["🇪🇨", "USD", "es-MX", "Ecuador", ["Quito", "Galápagos"], [], "royal red yellow", "¡Hola!"],
  ["🇧🇴", "BOB", "es-MX", "Bolivia", ["La Paz"], [], "darkgreen red yellow", "¡Hola!"],
  ["🇨🇷", "CRC", "es-MX", "Costa Rica", ["San José", "Tamarindo"], [], "royal red sky", "¡Hola!"],
  ["🇵🇦", "PAB", "es-MX", "Panama", ["Panama City", "Bocas del Toro"], [], "royal red sky", "¡Hola!"],
  ["🇬🇹", "GTQ", "es-MX", "Guatemala", ["Antigua Guatemala"], [], "lightblue royal gold", "¡Hola!"],
  ["🇧🇿", "BZD", "en-US", "Belize", ["San Pedro", "Caye Caulker"], [], "royal red sky", "Hello!"],
  ["🇩🇴", "DOP", "es-MX", "Dominican Republic", ["Punta Cana", "Santo Domingo"], [], "royal red sky", "¡Hola!"],
  ["🇨🇺", "CUP", "es-MX", "Cuba", ["Havana"], [], "royal red sky", "¡Hola!"],
  ["🇵🇷", "USD", "es-MX", "Puerto Rico", ["San Juan"], [], "royal red sky", "¡Hola!"],
  ["🇦🇼", "AWG", "nl-NL", "Aruba", ["Oranjestad"], [], "lightblue red yellow", "Bon dia!"],
  ["🇨🇼", "XCG", "nl-NL", "Curaçao", ["Willemstad"], [], "royal blue yellow", "Bon dia!"],
  ["🇧🇶", "USD", "nl-NL", "Bonaire", [], [], "royal red yellow", "Bon dia!"],
  ["🇸🇽", "XCG", "nl-NL", "Sint Maarten", [], [], "royal red yellow", "Hallo!"],
  ["🇲🇫", "EUR", "fr-FR", "Saint Martin", [], ["st martin", "st. martin"], "blue red lightblue", "Bonjour !"],
  ["🇧🇱", "EUR", "fr-FR", "Saint Barthélemy", [], ["st barts", "st. barts", "st barths", "saint barts"], "blue red gold", "Bonjour !"],
  ["🇲🇶", "EUR", "fr-FR", "Martinique", [], [], "darkgreen red mint", "Bonjour !"],
  ["🇬🇵", "EUR", "fr-FR", "Guadeloupe", [], [], "blue red lightblue", "Bonjour !"],
  ["🇭🇹", "HTG", "fr-FR", "Haiti", [], [], "royal red gold", "Bonjou!"],
  ["🇯🇲", "JMD", "en-US", "Jamaica", ["Montego Bay", "Negril", "Kingston", "Ocho Rios"], [], "darkgreen black gold", "Wah gwaan!"],
  ["🇧🇸", "BSD", "en-US", "Bahamas", ["Nassau", "Exuma"], [], "turquoise black gold", "Hello!"],
  ["🇧🇧", "BBD", "en-US", "Barbados", ["Bridgetown"], [], "royal navy gold", "Hello!"],
  ["🇹🇹", "TTD", "en-US", "Trinidad and Tobago", [], ["trinidad", "tobago"], "red black coral", "Hello!"],
  ["🇰🇾", "KYD", "en-US", "Cayman Islands", ["Grand Cayman"], [], "navy red gold", "Hello!"],
  ["🇹🇨", "USD", "en-US", "Turks and Caicos", ["Providenciales"], ["turks & caicos"], "navy red gold", "Hello!"],
  ["🇻🇬", "USD", "en-US", "British Virgin Islands", ["Tortola", "Virgin Gorda"], ["bvi"], "navy darkgreen gold", "Hello!"],
  ["🇻🇮", "USD", "en-US", "US Virgin Islands", ["St. Thomas", "St. John", "St. Croix"], ["usvi", "st thomas", "st john", "st croix"], "royal red gold", "Hello!"],
  ["🇱🇨", "XCD", "en-US", "Saint Lucia", [], ["st lucia", "st. lucia"], "lightblue black gold", "Hello!"],
  ["🇦🇬", "XCD", "en-US", "Antigua and Barbuda", ["Antigua"], [], "red black gold", "Hello!"],
  ["🇬🇩", "XCD", "en-US", "Grenada", [], [], "red darkgreen gold", "Hello!"],
  ["🇰🇳", "XCD", "en-US", "Saint Kitts and Nevis", [], ["st kitts", "st. kitts", "nevis"], "darkgreen red yellow", "Hello!"],
  ["🇩🇲", "XCD", "en-US", "Dominica", [], [], "darkgreen purple yellow", "Hello!"],
  ["🇻🇨", "XCD", "en-US", "Saint Vincent and the Grenadines", [], ["st vincent", "st. vincent", "grenadines"], "royal darkgreen yellow", "Hello!"],
  ["🇦🇮", "XCD", "en-US", "Anguilla", [], [], "navy turquoise orange", "Hello!"],
  ["🇧🇲", "BMD", "en-US", "Bermuda", [], [], "red navy coral", "Hello!"],
  ["🇬🇧", "GBP", "en-GB", "United Kingdom", ["London", "Edinburgh", "Manchester", "Glasgow", "Liverpool", "Bath", "Oxford", "Cambridge"], ["uk", "england", "scotland", "wales", "britain"], "darknavy red sky", "Hello!"],
  ["🇮🇪", "EUR", "en-GB", "Ireland", ["Dublin", "Galway", "Cork"], [], "green orange mint", "Dia dhuit!"],
  ["🇺🇸", "USD", "en-US", "United States", [], ["usa", "america"], "navy red sky", "Hello!"],
  ["🇺🇸", "USD", "en-US", "Alabama", [], [], "crimson darkred coral", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Alaska", ["Anchorage", "Juneau"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Arizona", ["Phoenix", "Scottsdale", "Sedona", "Tucson", "Grand Canyon"], [], "navy copper gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Arkansas", [], [], "red navy sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "California", ["Los Angeles", "San Francisco", "San Diego", "Napa", "Palm Springs", "Lake Tahoe", "Big Sur"], ["sf"], "red brown green", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Colorado", ["Denver", "Aspen", "Vail", "Boulder"], [], "royal red gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Connecticut", [], [], "royal navy gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Delaware", [], [], "lightblue navy buff", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Florida", ["Miami", "Orlando", "Key West", "Tampa", "Fort Lauderdale"], [], "red darkred gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Georgia", ["Atlanta", "Savannah"], [], "red navy gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Hawaii", ["Maui", "Honolulu", "Kauai", "Oahu", "Big Island"], [], "darknavy red sky", "Aloha!", "USA"],
  ["🇺🇸", "USD", "en-US", "Idaho", ["Boise", "Sun Valley"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Illinois", ["Chicago"], [], "navy red gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Indiana", ["Indianapolis"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Iowa", [], [], "royal red sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Kansas", [], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Kentucky", ["Louisville"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Louisiana", ["New Orleans"], ["nola"], "royal navy gold", "Bonjour, y’all!", "USA"],
  ["🇺🇸", "USD", "en-US", "Maine", ["Portland (Maine)", "Bar Harbor"], [], "navy darkgreen gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Maryland", ["Baltimore", "Annapolis"], [], "red black gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Massachusetts", ["Boston", "Cape Cod", "Nantucket", "Martha's Vineyard"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Michigan", ["Detroit"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Minnesota", ["Minneapolis"], [], "navy lightblue sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Mississippi", [], [], "red navy gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Missouri", ["St. Louis", "Kansas City"], [], "royal red sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Montana", ["Big Sky", "Bozeman"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Nebraska", [], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Nevada", ["Las Vegas", "Reno"], ["vegas"], "royal darkgreen gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "New Hampshire", [], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "New Jersey", ["Jersey Shore"], [], "blue navy buff", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "New Mexico", ["Santa Fe", "Albuquerque", "Taos"], [], "red darkred yellow", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "New York", ["New York City", "Brooklyn", "The Hamptons", "Hudson Valley"], ["nyc", "manhattan"], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "North Carolina", ["Asheville", "Charlotte", "Outer Banks"], [], "navy red gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "North Dakota", [], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Ohio", ["Cleveland", "Columbus", "Cincinnati"], [], "red navy sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Oklahoma", [], [], "lightblue brown buff", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Oregon", ["Portland", "Bend"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Pennsylvania", ["Philadelphia", "Pittsburgh"], ["philly"], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Rhode Island", ["Newport", "Providence"], [], "royal navy gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "South Carolina", ["Charleston", "Hilton Head"], [], "navy royal sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "South Dakota", [], [], "lightblue royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Tennessee", ["Nashville", "Memphis"], [], "red navy sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Texas", ["Austin", "Dallas", "Houston", "San Antonio"], [], "navy red sky", "Howdy!", "USA"],
  ["🇺🇸", "USD", "en-US", "Utah", ["Park City", "Salt Lake City", "Moab", "Zion"], [], "navy red gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Vermont", ["Stowe", "Burlington"], [], "navy darkgreen gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Virginia", ["Virginia Beach", "Richmond"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Washington", ["Seattle"], ["washington state"], "green darkgreen gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "West Virginia", [], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Wisconsin", ["Milwaukee", "Madison"], [], "navy royal gold", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Wyoming", ["Jackson Hole", "Yellowstone"], [], "navy red sky", "Hello!", "USA"],
  ["🇺🇸", "USD", "en-US", "Washington, D.C.", [], ["washington dc", "dc", "washington d.c."], "red darkred coral", "Hello!", "USA"],
  ["🇨🇦", "CAD", "en-US", "Canada", ["Toronto", "Vancouver", "Montreal", "Banff", "Quebec City", "Whistler"], ["quebec"], "red darkred coral", "Hello!"],
  ["🇦🇺", "AUD", "en-GB", "Australia", ["Sydney", "Melbourne", "Brisbane", "Perth", "Gold Coast"], [], "darknavy red sky", "G’day!"],
  ["🇳🇿", "NZD", "en-GB", "New Zealand", ["Auckland", "Queenstown", "Wellington"], [], "darknavy red sky", "Kia ora!"],
  ["🇫🇯", "FJD", "en-GB", "Fiji", [], [], "lightblue navy coral", "Bula!"],
  ["🇵🇫", "XPF", "fr-FR", "French Polynesia", ["Tahiti", "Bora Bora", "Moorea"], [], "red darkred coral", "Ia ora na!"],
  ["🇸🇪", "SEK", "sv-SE", "Sweden", ["Stockholm", "Gothenburg"], [], "blue royal yellow", "Hej!"],
  ["🇳🇴", "NOK", "nb-NO", "Norway", ["Oslo", "Bergen", "Tromsø", "Lofoten"], [], "red navy sky", "Hei!"],
  ["🇩🇰", "DKK", "da-DK", "Denmark", ["Copenhagen", "Aarhus"], [], "red darkred coral", "Hej!"],
  ["🇫🇮", "EUR", "fi-FI", "Finland", ["Helsinki", "Lapland", "Rovaniemi"], [], "royal blue lightblue", "Hei!"],
  ["🇮🇸", "ISK", "is-IS", "Iceland", ["Reykjavik"], [], "royal red sky", "Halló!"],
  ["🇨🇿", "CZK", "cs-CZ", "Czech Republic", ["Prague"], ["czechia"], "royal red sky", "Ahoj!"],
  ["🇵🇱", "PLN", "pl-PL", "Poland", ["Warsaw", "Kraków", "Gdańsk"], [], "crimson darkred coral", "Cześć!"],
  ["🇭🇺", "HUF", "hu-HU", "Hungary", ["Budapest"], [], "darkgreen red mint", "Szia!"],
  ["🇭🇷", "EUR", "hr-HR", "Croatia", ["Dubrovnik", "Split", "Zagreb", "Hvar"], [], "royal red sky", "Bok!"],
  ["🇸🇮", "EUR", "en-GB", "Slovenia", ["Ljubljana", "Lake Bled"], [], "royal red sky", "Živjo!"],
  ["🇷🇴", "RON", "en-GB", "Romania", ["Bucharest"], [], "royal red yellow", "Bună!"],
  ["🇧🇬", "BGN", "en-GB", "Bulgaria", ["Sofia"], [], "green red mint", "Здравей!"],
  ["🇬🇪", "GEL", "en-GB", "Georgia (country)", ["Tbilisi"], [], "red darkred coral", "გამარჯობა!"],
]

// Lowercase and strip accents so "São Paulo", "sao paulo" and "SAO PAULO" match.
const plain = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// Every pickable place, cities labeled with where they are. `keys` are the
// spellings that find it; other spellings ("CDMX", "St Barts") lead to the
// country or state itself.
const PLACES = DESTINATIONS.flatMap(([emoji, currency, language, name, cities, aliases, colors, hello, region]) => {
  const locale = { emoji, currency, language, hello, place: name, colors }
  return [
    { label: region ? `${name}, ${region}` : name, keys: [name, ...aliases].map(plain), ...locale },
    ...cities.map((city) => ({ label: `${city}, ${name}`, keys: [plain(city.replace(/ \(.*\)$/, ''))], ...locale })),
  ]
})

// What the rest of the app gets for a recognized place.
const describe = ({ label, emoji, currency, language, hello, place, colors }) => ({
  label, emoji, currency, language, hello, place, skin: skinFromNames(colors),
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
  return best && describe(best)
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
    .map(describe)
}
