'use client';

import { Badge } from '@/components/ui/badge';
import { Bus, SeatStatus } from '@/types';
import { cn } from '@/lib/utils';

interface SeatMapProps {
  bus: Bus;
  bookedSeats: string[];
  selectedSeats: string[];
  onSeatSelect: (seatNumber: string) => void;
  maxSeats: number;
  className?: string;
}

export default function SeatMap({ 
  bus, 
  bookedSeats, 
  selectedSeats, 
  onSeatSelect, 
  maxSeats,
  className 
}: SeatMapProps) {
  const getSeatStatus = (seatNumber: string): SeatStatus => {
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const getSeatColor = (status: SeatStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800';
      case 'selected':
        return 'bg-blue-500 text-white border-blue-600';
      case 'booked':
        return 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const handleSeatClick = (seatNumber: string) => {
    const status = getSeatStatus(seatNumber);
    if (status === 'booked') return;
    
    if (status === 'selected') {
      onSeatSelect(seatNumber);
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect(seatNumber);
    }
  };

  const renderSeatLayout = () => {
    let seatNumber = 1;
    const rows = [];

    for (let row = 0; row < bus.seatLayout.rows; row++) {
      const rowSeats = [];
      
      for (let col = 0; col < bus.seatLayout.layout[row].length; col++) {
        const cellType = bus.seatLayout.layout[row][col];
        
        if (cellType === 'seat') {
          const seatNum = seatNumber.toString().padStart(2, '0');
          const status = getSeatStatus(seatNum);
          const isClickable = status !== 'booked';
          
          rowSeats.push(
            <button
              key={`${row}-${col}`}
              className={cn(
                'w-10 h-10 border-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center',
                getSeatColor(status),
                isClickable && 'hover:shadow-md'
              )}
              onClick={() => handleSeatClick(seatNum)}
              disabled={status === 'booked'}
              title={`Seat ${seatNum} - ${status}`}
            >
              {seatNum}
            </button>
          );
          seatNumber++;
        } else if (cellType === 'aisle') {
          rowSeats.push(
            <div 
              key={`${row}-${col}`}
              className="w-4 h-10 flex items-center justify-center"
            >
              <div className="w-0.5 h-8 bg-gray-200"></div>
            </div>
          );
        } else {
          rowSeats.push(
            <div key={`${row}-${col}`} className="w-10 h-10"></div>
          );
        }
      }
      
      rows.push(
        <div key={row} className="flex items-center justify-center gap-1 mb-2">
          <span className="text-xs text-gray-500 w-6 text-center">
            {(row + 1).toString().padStart(2, '0')}
          </span>
          {rowSeats}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className={cn('bg-white rounded-lg p-6', className)}>
      {/* Bus Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-4">
          <div className="text-2xl">🚌</div>
          <div>
            <p className="font-semibold">{bus.busNumber}</p>
            <p className="text-sm text-gray-600 capitalize">{bus.type}</p>
          </div>
        </div>
      </div>

      {/* Driver Section */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs">
          Driver
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="border rounded-lg p-4 bg-gray-50">
        {renderSeatLayout()}
      </div>

      {/* Selection Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Selected Seats: {selectedSeats.length}/{maxSeats}
            </p>
            {selectedSeats.length > 0 && (
              <p className="text-sm font-medium text-blue-700">
                {selectedSeats.join(', ')}
              </p>
            )}
          </div>
          {selectedSeats.length === maxSeats && (
            <Badge variant="default" className="bg-green-500">
              Ready to Continue
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}