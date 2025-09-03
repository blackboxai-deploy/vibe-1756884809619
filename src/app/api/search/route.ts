import { NextRequest, NextResponse } from 'next/server';
import { mockSchedules, mockRoutes, mockBuses } from '@/data/mockData';
import { SearchResult, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const travelDate = searchParams.get('travelDate');
    const passengers = parseInt(searchParams.get('passengers') || '1');

    // Validation
    if (!origin || !destination || !travelDate) {
      return NextResponse.json(
        { success: false, error: 'Origin, destination, and travel date are required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (passengers < 1 || passengers > 6) {
      return NextResponse.json(
        { success: false, error: 'Number of passengers must be between 1 and 6' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find matching routes
    const matchingRoutes = mockRoutes.filter(
      route => 
        route.origin.toLowerCase() === origin.toLowerCase() && 
        route.destination.toLowerCase() === destination.toLowerCase() &&
        route.isActive
    );

    if (matchingRoutes.length === 0) {
      return NextResponse.json([] as SearchResult[], { status: 200 });
    }

    // Find schedules for matching routes
    const results: SearchResult[] = [];

    for (const route of matchingRoutes) {
      const routeSchedules = mockSchedules.filter(
        schedule => 
          schedule.routeId === route.id && 
          schedule.isActive
      );

      for (const schedule of routeSchedules) {
        const bus = mockBuses.find(b => b.id === schedule.busId && b.isActive);
        if (!bus) continue;

        // Generate mock booked seats (random for demo)
        const bookedSeats: string[] = [];
        const randomBookedCount = Math.floor(Math.random() * (bus.totalSeats * 0.3)); // Up to 30% booked
        for (let i = 0; i < randomBookedCount; i++) {
          const seatNum = Math.floor(Math.random() * bus.totalSeats) + 1;
          const seatStr = seatNum.toString().padStart(2, '0');
          if (!bookedSeats.includes(seatStr)) {
            bookedSeats.push(seatStr);
          }
        }

        const availableSeats = bus.totalSeats - bookedSeats.length;

        // Check if enough seats available for passengers
        if (availableSeats >= passengers) {
          // Calculate estimated arrival time (for display purposes)
          const [depHours, depMinutes] = schedule.departureTime.split(':').map(Number);
          const departureMinutes = depHours * 60 + depMinutes;
          const arrivalMinutes = departureMinutes + route.duration;
          const arrivalHours = Math.floor(arrivalMinutes / 60) % 24;
          const arrivalMins = arrivalMinutes % 60;
          const estimatedArrival = `${arrivalHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')}`;

          const searchResult: SearchResult = {
            ...schedule,
            route,
            bus,
            availableSeats,
            estimatedArrival,
          };

          results.push(searchResult);
        }
      }
    }

    // Sort by departure time
    results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}