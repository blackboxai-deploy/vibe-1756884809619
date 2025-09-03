'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search Buses' },
  ];

  const userNavItems = [
    { href: '/profile', label: 'My Bookings' },
    { href: '/profile', label: 'Profile' },
  ];

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/routes', label: 'Manage Routes' },
    { href: '/admin/bookings', label: 'Manage Bookings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BT</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BusTicket</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-blue-100">
                  <span className="text-blue-600 font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNavItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Admin</DropdownMenuLabel>
                    {adminNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-4 h-0.5 bg-gray-600 mb-1"></div>
                <div className="w-4 h-0.5 bg-gray-600"></div>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-2">Welcome, {user?.name}</p>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-lg text-gray-700 hover:text-blue-600 transition-colors mb-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <>
                        <p className="text-sm text-gray-500 mb-2 mt-4">Admin</p>
                        {adminNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-lg text-gray-700 hover:text-blue-600 transition-colors mb-2"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </>
                    )}
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      className="w-full mt-4"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}