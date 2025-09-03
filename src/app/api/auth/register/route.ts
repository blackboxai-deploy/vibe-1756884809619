import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockData';
import { User, AuthUser, ApiResponse } from '@/types';
import { validateEmail, validatePhone } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid phone number' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      name,
      role: 'customer',
      phone: phone || undefined,
      createdAt: new Date(),
    };

    // In a real app, you would save to database here
    // For demo, we'll add to mock data (note: this won't persist across server restarts)
    mockUsers.push(newUser);

    // Generate a simple token (in real app, use JWT)
    const token = `token_${newUser.id}_${Date.now()}`;

    const authResponse: AuthUser = {
      user: newUser,
      token,
    };

    return NextResponse.json(authResponse, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}