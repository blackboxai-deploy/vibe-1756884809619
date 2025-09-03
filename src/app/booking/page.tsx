'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SeatMap from '@/components/SeatMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Schedule, Passenger } from '@/types';
import { formatTime, formatDuration, formatCurrency, formatDate, validateEmail, validatePhone } from '@/lib/utils';
import { amenitiesIcons } from '@/data/mockData';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'seats' | 'details' | 'payment'>('seats');
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [error, setError] = useState('');
  const [totalPassengers, setTotalPassengers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const scheduleId = searchParams.get('scheduleId');
    const passengersCount = parseInt(searchParams.get('passengers') || '1');
    const date = searchParams.get('travelDate') || '';

    if (!scheduleId || !date) {
      router.push('/search');
      return;
    }

    setTotalPassengers(passengersCount);
    setTravelDate(date);
    
    // Initialize passengers array
    setPassengers(Array(passengersCount).fill({
      name: '',
      age: 0,
      gender: 'male',
      phone: '',
      email: '',
    }));

    fetchScheduleDetails(scheduleId, date);
  }, [searchParams, isAuthenticated, router]);

  const fetchScheduleDetails = async (scheduleId: string, date: string) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule);
        setBookedSeats(data.bookedSeats || []);
      } else {
        setError('Failed to load bus details');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load bus details');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
  };

  const validatePassengerDetails = (): boolean => {
    setError('');
    
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      
      if (!passenger.name.trim()) {
        setError(`Please enter name for passenger ${i + 1}`);
        return false;
      }
      
      if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
        setError(`Please enter a valid age for passenger ${i + 1}`);
        return false;
      }
      
      if (!passenger.gender) {
        setError(`Please select gender for passenger ${i + 1}`);
        return false;
      }

      if (passenger.email && !validateEmail(passenger.email)) {
        setError(`Please enter a valid email for passenger ${i + 1}`);
        return false;
      }

      if (passenger.phone && !validatePhone(passenger.phone)) {
        setError(`Please enter a valid phone number for passenger ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 'seats') {
      if (selectedSeats.length !== totalPassengers) {
        setError(`Please select exactly ${totalPassengers} seat${totalPassengers > 1 ? 's' : ''}`);
        return;
      }
      setStep('details');
      setError('');
    } else if (step === 'details') {
      if (validatePassengerDetails()) {
        setStep('payment');
        setError('');
      }
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('seats');
    } else if (step === 'payment') {
      setStep('details');
    }
    setError('');
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      
      const bookingData = {
        scheduleId: schedule?.id,
        passengers,
        seatNumbers: selectedSeats,
        travelDate,
        totalAmount: (schedule?.price || 0) * totalPassengers,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const booking = await response.json();
        router.push(`/booking/confirmation/${booking.id}`);
      } else {
        const error = await response.json();
        setError(error.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The requested bus schedule could not be found.</p>
            <Button onClick={() => router.push('/search')}>Go to Search</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalAmount = (schedule.price || 0) * totalPassengers;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'seats' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'seats' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>1</div>
              <span className="ml-2 hidden sm:block">Select Seats</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>2</div>
              <span className="ml-2 hidden sm:block">Passenger Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200"></div>
            <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>3</div>
              <span className="ml-2 hidden sm:block">Payment</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'seats' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h2>
                {schedule.bus && (
                  <SeatMap
                    bus={schedule.bus}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    maxSeats={totalPassengers}
                  />
                )}
              </div>
            )}

            {step === 'details' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Details</h2>
                <div className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Passenger {index + 1} - Seat {selectedSeats[index]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>Full Name *</Label>
                            <Input
                              id={`name-${index}`}
                              placeholder="Enter full name"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`age-${index}`}>Age *</Label>
                            <Input
                              id={`age-${index}`}
                              type="number"
                              min="1"
                              max="120"
                              placeholder="Enter age"
                              value={passenger.age || ''}
                              onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`gender-${index}`}>Gender *</Label>
                            <Select
                              value={passenger.gender}
                              onValueChange={(value) => handlePassengerChange(index, 'gender', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`phone-${index}`}>Phone</Label>
                            <Input
                              id={`phone-${index}`}
                              placeholder="Phone number (optional)"
                              value={passenger.phone || ''}
                              onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`email-${index}`}>Email</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              placeholder="Email (optional)"
                              value={passenger.email || ''}
                              onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Confirmation</h2>
                
                {/* Booking Summary */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Journey</span>
                        <span className="font-medium">
                          {schedule.route?.origin} → {schedule.route?.destination}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span className="font-medium">{formatDate(new Date(travelDate))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Departure</span>
                        <span className="font-medium">{formatTime(schedule.departureTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seats</span>
                        <span className="font-medium">{selectedSeats.join(', ')}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details (Demo)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 text-sm mb-2">
                        🔒 This is a demo application. Your booking will be confirmed instantly.
                      </p>
                      <p className="text-blue-700 text-sm">
                        In a real application, this would integrate with payment gateways like Stripe, PayPal, or local payment providers.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Journey Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route Info */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(schedule.departureTime)}
                  </p>
                  <p className="text-sm text-gray-600">{schedule.route?.origin}</p>
                  <div className="my-3 flex items-center justify-center">
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <div className="mx-3 text-xs text-gray-500">
                      {formatDuration(schedule.route?.duration || 0)}
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(schedule.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-600">{schedule.route?.destination}</p>
                </div>

                <Separator />

                {/* Bus Info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Bus</span>
                    <span className="font-medium">{schedule.bus?.busNumber}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge variant="outline" className="capitalize">
                      {schedule.bus?.type}
                    </Badge>
                  </div>
                </div>

                {/* Amenities */}
                {schedule.bus?.amenities && schedule.bus.amenities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {schedule.bus.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1"
                          >
                            <span className="mr-1">
                              {amenitiesIcons[amenity] || '•'}
                            </span>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Pricing */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Price per seat</span>
                    <span className="font-medium">{formatCurrency(schedule.price)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Passengers</span>
                    <span className="font-medium">{totalPassengers}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  {step !== 'seats' && (
                    <Button variant="outline" className="w-full" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {step !== 'payment' ? (
                    <Button className="w-full" onClick={handleNext}>
                      Continue
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleBooking}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}