export const CROPS = [
  { id: 'wheat', titleHindi: 'गेहूँ', titleEng: 'Wheat', icon: '🌾' },
  { id: 'paddy', titleHindi: 'धान', titleEng: 'Paddy', icon: '🌾' },
  { id: 'maize', titleHindi: 'मक्का', titleEng: 'Maize', icon: '🌽' },
];

export const MANDIS = [
  {
    id: 'sehore',
    titleHindi: 'सीहोर खरीद केंद्र',
    titleEng: 'Sehore Procurement Centre',
    distance: '12 km away',
    slotsOpen: '15 slots open',
    recommended: true,
    available: true,
  },
  {
    id: 'ashta',
    titleHindi: 'आष्टा कृषि उपज मंडी',
    titleEng: 'Ashta Krishi Upaj Mandi',
    distance: '35 km away',
    slotsOpen: '42 slots open',
    recommended: false,
    available: true,
  },
  {
    id: 'ichhawar',
    titleHindi: 'इच्छावर मंडी',
    titleEng: 'Ichhawar Mandi',
    distance: '28 km away',
    slotsOpen: '0 slots open',
    recommended: false,
    available: false,
  },
];

export const DATES = [
  { id: 'today', label: 'Today', day: '12', month: 'Nov', active: true },
  { id: 'tomorrow', label: 'Tomorrow', day: '13', month: 'Nov', active: false },
  { id: 'thu', label: 'Thu', day: '14', month: 'Nov', active: false },
];

export const SLOTS = [
  {
    id: 'slot1',
    timeEng: '10:00 - 11:00 AM',
    timeHindi: 'सुबह १० से ११ बजे',
    status: 'available',
    statusText: 'Available (24 spots)',
  },
  {
    id: 'slot2',
    timeEng: '11:00 - 12:00 PM',
    timeHindi: 'सुबह ११ से दोपहर १२ बजे',
    status: 'few',
    statusText: 'Few left (3 spots)',
  },
  {
    id: 'slot3',
    timeEng: '12:00 - 01:00 PM',
    timeHindi: 'दोपहर १२ से १ बजे',
    status: 'full',
    statusText: 'Full / भरा हुआ',
  },
];

export const STAGES = [
  { id: '1', title: 'Booked', desc: 'Slot confirmed for 01 Sep', done: true },
  { id: '2', title: 'Arrived', desc: 'Gate entry verified', done: true },
  { id: '3', title: 'In Queue', desc: 'Position #4 in weighbridge queue', active: true },
  { id: '4', title: 'Procured', desc: 'Quality grade & weight entry', done: false },
  { id: '5', title: 'Paid', desc: 'PFMS DBT payment credited', done: false },
];
