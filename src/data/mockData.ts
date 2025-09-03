import { User, Route, Bus, Schedule, Booking, Seat } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@busticket.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'john.doe@email.com',
    name: 'John Doe',
    role: 'customer',
    phone: '+1234567891',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    email: 'jane.smith@email.com',
    name: 'Jane Smith',
    role: 'customer',
    phone: '+1234567892',
    createdAt: new Date('2024-02-01'),
  },
];

// Mock Routes
export const mockRoutes: Route[] = [
  {
    id: 'r1',
    origin: 'New York',
    destination: 'Boston',
    distance: 215,
    duration: 240, // 4 hours
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r2',
    origin: 'Boston',
    destination: 'New York',
    distance: 215,
    duration: 240,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r3',
    origin: 'New York',
    destination: 'Philadelphia',
    distance: 95,
    duration: 120, // 2 hours
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r4',
    origin: 'Philadelphia',
    destination: 'New York',
    distance: 95,
    duration: 120,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r5',
    origin: 'New York',
    destination: 'Washington DC',
    distance: 225,
    duration: 270, // 4.5 hours
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'r6',
    origin: 'Washington DC',
    destination: 'New York',
    distance: 225,
    duration: 270,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

// Mock Buses
export const mockBuses: Bus[] = [
  {
    id: 'b1',
    busNumber: 'BUS-001',
    type: 'ac',
    totalSeats: 40,
    amenities: ['WiFi', 'AC', 'Charging Ports', 'Water Bottle'],
    isActive: true,
    seatLayout: {
      rows: 10,
      seatsPerRow: 4,
      layout: Array(10).fill(['seat', 'seat', 'aisle', 'seat', 'seat']),
    },
  },
  {
    id: 'b2',
    busNumber: 'BUS-002',
    type: 'sleeper',
    totalSeats: 36,
    amenities: ['WiFi', 'AC', 'Blanket', 'Pillow', 'Reading Light'],
    isActive: true,
    seatLayout: {
      rows: 12,
      seatsPerRow: 3,
      layout: Array(12).fill(['seat', 'aisle', 'seat', 'seat']),
    },
  },
  {
    id: 'b3',
    busNumber: 'BUS-003',
    type: 'semi-sleeper',
    totalSeats: 44,
    amenities: ['WiFi', 'AC', 'Charging Ports'],
    isActive: true,
    seatLayout: {
      rows: 11,
      seatsPerRow: 4,
      layout: Array(11).fill(['seat', 'seat', 'aisle', 'seat', 'seat']),
    },
  },
  {
    id: 'b4',
    busNumber: 'BUS-004',
    type: 'non-ac',
    totalSeats: 48,
    amenities: ['Charging Ports', 'Water Bottle'],
    isActive: true,
    seatLayout: {
      rows: 12,
      seatsPerRow: 4,
      layout: Array(12).fill(['seat', 'seat', 'aisle', 'seat', 'seat']),
    },
  },
];

// Mock Schedules
export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    routeId: 'r1', // NY to Boston
    busId: 'b1',
    departureTime: '08:00',
    arrivalTime: '12:00',
    frequency: 'daily',
    price: 45,
    isActive: true,
  },
  {
    id: 's2',
    routeId: 'r1', // NY to Boston
    busId: 'b2',
    departureTime: '14:30',
    arrivalTime: '18:30',
    frequency: 'daily',
    price: 65,
    isActive: true,
  },
  {
    id: 's3',
    routeId: 'r2', // Boston to NY
    busId: 'b1',
    departureTime: '09:15',
    arrivalTime: '13:15',
    frequency: 'daily',
    price: 45,
    isActive: true,
  },
  {
    id: 's4',
    routeId: 'r3', // NY to Philadelphia
    busId: 'b3',
    departureTime: '10:00',
    arrivalTime: '12:00',
    frequency: 'daily',
    price: 25,
    isActive: true,
  },
  {
    id: 's5',
    routeId: 'r3', // NY to Philadelphia
    busId: 'b4',
    departureTime: '16:00',
    arrivalTime: '18:00',
    frequency: 'daily',
    price: 20,
    isActive: true,
  },
  {
    id: 's6',
    routeId: 'r5', // NY to Washington DC
    busId: 'b2',
    departureTime: '07:30',
    arrivalTime: '12:00',
    frequency: 'daily',
    price: 55,
    isActive: true,
  },
];

// Mock Seats (generated for each schedule)
export const generateMockSeats = (scheduleId: string, bus: Bus, bookedSeats: string[] = []): Seat[] => {
  const seats: Seat[] = [];
  let seatNumber = 1;

  for (let row = 0; row < bus.seatLayout.rows; row++) {
    for (let col = 0; col < bus.seatLayout.layout[row].length; col++) {
      if (bus.seatLayout.layout[row][col] === 'seat') {
        const seatId = `${scheduleId}-${seatNumber}`;
        const seatNum = seatNumber.toString().padStart(2, '0');
        
        seats.push({
          id: seatId,
          scheduleId,
          seatNumber: seatNum,
          row: row + 1,
          column: col + 1,
          type: col === 0 || col === bus.seatLayout.layout[row].length - 1 ? 'window' : 'aisle',
          isBooked: bookedSeats.includes(seatNum),
          bookingId: bookedSeats.includes(seatNum) ? `booking-${Math.random().toString(36).substr(2, 9)}` : undefined,
        });
        seatNumber++;
      }
    }
  }

  return seats;
};

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: '2',
    scheduleId: 's1',
    passengers: [
      {
        name: 'John Doe',
        age: 30,
        gender: 'male',
        phone: '+1234567891',
        email: 'john.doe@email.com',
      },
    ],
    seatNumbers: ['01', '02'],
    totalAmount: 90,
    status: 'confirmed',
    bookingDate: new Date('2024-01-20'),
    travelDate: new Date('2024-02-15'),
    paymentStatus: 'paid',
    paymentId: 'pay-123456',
  },
  {
    id: 'booking-2',
    userId: '3',
    scheduleId: 's2',
    passengers: [
      {
        name: 'Jane Smith',
        age: 28,
        gender: 'female',
        phone: '+1234567892',
        email: 'jane.smith@email.com',
      },
      {
        name: 'Bob Smith',
        age: 32,
        gender: 'male',
        phone: '+1234567892',
      },
    ],
    seatNumbers: ['15', '16'],
    totalAmount: 130,
    status: 'confirmed',
    bookingDate: new Date('2024-01-25'),
    travelDate: new Date('2024-02-20'),
    paymentStatus: 'paid',
    paymentId: 'pay-789012',
  },
];

// Popular cities for search suggestions
export const popularCities = [
  'New York',
  'Boston',
  'Philadelphia',
  'Washington DC',
  'Chicago',
  'Miami',
  'Los Angeles',
  'San Francisco',
  'Seattle',
  'Denver',
];

// Bus amenities mapping
export const amenitiesIcons: Record<string, string> = {
  'WiFi': '📶',
  'AC': '❄️',
  'Charging Ports': '🔌',
  'Water Bottle': '💧',
  'Blanket': '🛏️',
  'Pillow': '🛌',
  'Reading Light': '💡',
  'Entertainment': '📺',
  'Snacks': '🍪',
};