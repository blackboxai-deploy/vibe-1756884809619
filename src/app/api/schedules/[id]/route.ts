import { NextRequest, NextResponse } from 'next/server';
import { mockSchedules, mockRoutes, mockBuses } from '@/data/mockData';
import { ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleId = params.id;

    if (!scheduleId) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find the schedule
    const schedule = mockSchedules.find(s => s.id === scheduleId && s.isActive);
    if (!schedule) {
      return NextResponse.json(
        { success: false, error: 'Schedule not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Find associated route and bus
    const route = mockRoutes.find(r => r.id === schedule.routeId);
    const bus = mockBuses.find(b => b.id === schedule.busId);

    if (!route || !bus) {
      return NextResponse.json(
        { success: false, error: 'Associated route or bus not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Generate mock booked seats (simulate existing bookings)
    const bookedSeats: string[] = [];
    const randomBookedCount = Math.floor(Math.random() * (bus.totalSeats * 0.2)); // Up to 20% booked
    for (let i = 0; i < randomBookedCount; i++) {
      const seatNum = Math.floor(Math.random() * bus.totalSeats) + 1;
      const seatStr = seatNum.toString().padStart(2, '0');
      if (!bookedSeats.includes(seatStr)) {
        bookedSeats.push(seatStr);
      }
    }

    const scheduleWithDetails = {
      ...schedule,
      route,
      bus,
    };

    return NextResponse.json({
      schedule: scheduleWithDetails,
      bookedSeats,
      availableSeats: bus.totalSeats - bookedSeats.length,
    });

  } catch (error) {
    console.error('Schedule API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}