'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { popularCities } from '@/data/mockData';
import { getDateString, addDays } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    travelDate: getDateString(new Date()),
    passengers: '1',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchData.origin || !searchData.destination) {
      alert('Please select both origin and destination cities');
      return;
    }
    
    if (searchData.origin === searchData.destination) {
      alert('Origin and destination cannot be the same');
      return;
    }

    // Navigate to search results page with search parameters
    const params = new URLSearchParams(searchData);
    router.push(`/search?${params.toString()}`);
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Travel Anywhere, Anytime
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Book your bus tickets online and travel comfortably across the country
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-900 text-center">Find Your Perfect Journey</CardTitle>
                <CardDescription className="text-center">
                  Search for buses and book your tickets in just a few clicks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Origin */}
                    <div className="space-y-2">
                      <Label htmlFor="origin" className="text-gray-700">From</Label>
                      <Select
                        value={searchData.origin}
                        onValueChange={(value) => setSearchData(prev => ({ ...prev, origin: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin city" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-gray-700">To</Label>
                      <Select
                        value={searchData.destination}
                        onValueChange={(value) => setSearchData(prev => ({ ...prev, destination: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination city" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularCities
                            .filter(city => city !== searchData.origin)
                            .map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Travel Date */}
                    <div className="space-y-2">
                      <Label htmlFor="travelDate" className="text-gray-700">Travel Date</Label>
                      <Input
                        id="travelDate"
                        type="date"
                        value={searchData.travelDate}
                        min={getDateString(new Date())}
                        onChange={(e) => setSearchData(prev => ({ ...prev, travelDate: e.target.value }))}
                        className="w-full"
                      />
                    </div>

                    {/* Passengers */}
                    <div className="space-y-2">
                      <Label htmlFor="passengers" className="text-gray-700">Passengers</Label>
                      <Select
                        value={searchData.passengers}
                        onValueChange={(value) => setSearchData(prev => ({ ...prev, passengers: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Passenger' : 'Passengers'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  >
                    Search Buses
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BusTicket?
            </h2>
            <p className="text-xl text-gray-600">
              We make your journey comfortable, safe, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold mb-3">Wide Network</h3>
                <p className="text-gray-600">
                  Travel to over 100+ destinations with our extensive bus network across the country
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💺</div>
                <h3 className="text-xl font-semibold mb-3">Comfortable Seats</h3>
                <p className="text-gray-600">
                  Choose from AC, non-AC, sleeper, and semi-sleeper buses for maximum comfort
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3">Secure Booking</h3>
                <p className="text-gray-600">
                  Safe and secure online payment with instant booking confirmation and e-tickets
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support for all your travel needs and queries
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
                <p className="text-gray-600">
                  Competitive pricing with regular discounts and offers for all routes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
                <p className="text-gray-600">
                  Simple and user-friendly interface for quick and easy ticket booking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSearchData(prev => ({ ...prev, origin: 'New York', destination: 'Boston' }))}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">New York → Boston</h3>
                    <p className="text-sm text-gray-600">4 hours • From $45</p>
                  </div>
                  <div className="text-blue-600">→</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSearchData(prev => ({ ...prev, origin: 'New York', destination: 'Philadelphia' }))}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">New York → Philadelphia</h3>
                    <p className="text-sm text-gray-600">2 hours • From $20</p>
                  </div>
                  <div className="text-blue-600">→</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSearchData(prev => ({ ...prev, origin: 'New York', destination: 'Washington DC' }))}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">New York → Washington DC</h3>
                    <p className="text-sm text-gray-600">4.5 hours • From $55</p>
                  </div>
                  <div className="text-blue-600">→</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}