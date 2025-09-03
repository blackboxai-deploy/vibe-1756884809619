'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchResult, SearchParams } from '@/types';
import { formatTime, formatDuration, formatCurrency, formatDate } from '@/lib/utils';
import { amenitiesIcons } from '@/data/mockData';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<SearchParams>({
    origin: '',
    destination: '',
    travelDate: '',
    passengers: 1,
  });

  useEffect(() => {
    // Get search parameters from URL
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const travelDate = searchParams.get('travelDate') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1');

    const newSearchData = { origin, destination, travelDate, passengers };
    setSearchData(newSearchData);

    if (origin && destination && travelDate) {
      searchBuses(newSearchData);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const searchBuses = async (params: SearchParams) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        travelDate: params.travelDate,
        passengers: params.passengers.toString(),
      });

      const response = await fetch(`/api/search?${query}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Search failed');
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (scheduleId: string) => {
    const bookingParams = new URLSearchParams({
      scheduleId,
      passengers: searchData.passengers.toString(),
      travelDate: searchData.travelDate,
    });
    router.push(`/booking?${bookingParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for the best buses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!searchData.origin || !searchData.destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Search</h2>
            <p className="text-gray-600 mb-6">Please go back to the homepage and try again.</p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchData.origin} → {searchData.destination}
              </h1>
              <p className="text-gray-600">
                {formatDate(new Date(searchData.travelDate))} • {searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
            >
              Modify Search
            </Button>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🚌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No buses found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn&apos;t find any buses for your selected route and date.
            </p>
            <Button onClick={() => router.push('/')}>
              Try Different Route
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Found {results.length} bus{results.length > 1 ? 'es' : ''} for your journey
              </p>
            </div>

            {results.map((bus) => (
              <Card key={bus.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Bus Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Time and Route */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">
                                {formatTime(bus.departureTime)}
                              </p>
                              <p className="text-sm text-gray-600">{searchData.origin}</p>
                            </div>
                            <div className="flex-1 px-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">
                                  {formatDuration(bus.route?.duration || 0)}
                                </p>
                                <div className="w-full h-0.5 bg-gray-300 relative">
                                  <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-600 rounded-full -translate-y-1/2"></div>
                                  <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-600 rounded-full -translate-y-1/2"></div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">
                                {formatTime(bus.arrivalTime)}
                              </p>
                              <p className="text-sm text-gray-600">{searchData.destination}</p>
                            </div>
                          </div>

                          {/* Bus Details */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary">
                              {bus.bus?.busNumber}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {bus.bus?.type}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              {bus.availableSeats} seats available
                            </Badge>
                          </div>

                          {/* Amenities */}
                          {bus.bus?.amenities && bus.bus.amenities.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              {bus.bus.amenities.map((amenity) => (
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
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator orientation="vertical" className="hidden lg:block" />

                    {/* Pricing and Booking */}
                    <div className="lg:w-64 p-6 bg-gray-50 lg:bg-white">
                      <div className="text-center lg:text-right">
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {formatCurrency(bus.price)}
                        </p>
                        <p className="text-sm text-gray-600 mb-6">per person</p>
                        
                        <Button 
                          className="w-full lg:w-auto"
                          onClick={() => handleBookNow(bus.id)}
                        >
                          Select Seats
                        </Button>

                        {searchData.passengers > 1 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Total: {formatCurrency(bus.price * searchData.passengers)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}