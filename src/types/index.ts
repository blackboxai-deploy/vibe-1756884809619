// Core type definitions for the Bus Ticket Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  createdAt: Date;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number; // in km
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
}

export interface Bus {
  id: string;
  busNumber: string;
  type: 'sleeper' | 'semi-sleeper' | 'ac' | 'non-ac';
  totalSeats: number;
  amenities: string[];
  isActive: boolean;
  seatLayout: {
    rows: number;
    seatsPerRow: number;
    layout: ('seat' | 'aisle' | 'empty')[][];
  };
}

export interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  departureTime: string; // HH:MM format
  arrivalTime: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'specific'; // how often this schedule runs
  price: number;
  isActive: boolean;
  route?: Route;
  bus?: Bus;
}

export interface Seat {
  id: string;
  scheduleId: string;
  seatNumber: string;
  row: number;
  column: number;
  type: 'window' | 'aisle' | 'middle';
  isBooked: boolean;
  bookingId?: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  passengers: Passenger[];
  seatNumbers: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDate: Date;
  travelDate: Date;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentId?: string;
  user?: User;
  schedule?: Schedule;
  seats?: Seat[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  travelDate: string;
  passengers: number;
}

export interface SearchResult extends Schedule {
  availableSeats: number;
  estimatedArrival: string;
}

export interface BookingSession {
  searchParams: SearchParams;
  selectedSchedule?: Schedule;
  selectedSeats: string[];
  passengers: Passenger[];
  totalAmount: number;
  step: 'search' | 'select' | 'details' | 'payment' | 'confirmation';
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeRoutes: number;
  activeBuses: number;
  todayBookings: number;
  occupancyRate: number;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'unavailable';