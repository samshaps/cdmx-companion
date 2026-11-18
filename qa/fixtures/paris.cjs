// A deliberately different trip (other city, currency and language) used to
// prove the app has no destination hardcoded.
// Dates are placeholders: the demo loader shifts them so today is day 2.
module.exports = {
  trip: {
    name: 'Paris Long Weekend',
    emoji: '🇫🇷',
    destination: 'Paris',
    dates: { start: '2026-05-01', end: '2026-05-03' },
    currency: { home: 'GBP', local: 'EUR' },
    language: { code: 'fr-FR', name: 'French' },
    stay: {
      name: 'Le Petit Marais Flat',
      address: '2e étage, 10 Rue Exemple, 75004 Paris',
      navigationAddress: '10 Rue Exemple, 75004 Paris',
      lat: 48.8566,
      lng: 2.3522,
      photo: '/images/demo-stay.svg',
      wifi: { network: 'MaraisGuest', password: 'croissant-2026' },
      checkIn: '4:00 PM',
      checkOut: '11:00 AM',
      manual: [{ title: 'Keys', body: 'Lockbox by the door.\nCode: 2468' }],
    },
  },
  itinerary: [
    { date: '2026-05-01', dayTitle: 'Arrive', events: [{ time: '19:30', name: 'Dinner: Bistrot Exemple', category: 'meal', address: '5 Rue Exemple, Paris', notes: 'Booked for four.', personalNote: '' }] },
    { date: '2026-05-02', dayTitle: 'Museums', events: [{ time: '10:00', name: 'Louvre', category: 'activity', address: '', notes: 'Timed tickets.', personalNote: '' }] },
    { date: '2026-05-03', dayTitle: 'Home', events: [{ time: '12:00', name: 'Train to London', category: 'transit', address: 'Gare du Nord, Paris', notes: '', personalNote: '' }] },
  ],
  places: [
    { name: 'Du Pain et des Idées', category: 'eat', lat: 48.8713, lng: 2.3626, address: '10e', note: 'Go early for the escargot pastry.' },
    { name: 'Musée d’Orsay', category: 'see', lat: 48.86, lng: 2.3266, address: '7e', note: '' },
  ],
  phrases: [
    { category: 'basics', english: 'Hello', translation: 'Bonjour', phonetic: 'bon-ZHOOR' },
    { category: 'basics', english: 'Thank you', translation: 'Merci', phonetic: 'mehr-SEE' },
    { category: 'café', english: 'A coffee, please', translation: 'Un café, s’il vous plaît', phonetic: 'uhn ka-FAY seel voo PLEH' },
  ],
}
