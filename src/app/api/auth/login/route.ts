import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockData';
import { AuthUser, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Simple password validation (in real app, use proper hashing)
    // For demo: admin@busticket.com / admin123, john.doe@email.com / password123
    const validPassword = 
      (user.email === 'admin@busticket.com' && password === 'admin123') ||
      (user.email === 'john.doe@email.com' && password === 'password123') ||
      (user.email === 'jane.smith@email.com' && password === 'password123');

    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Generate a simple token (in real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    const authResponse: AuthUser = {
      user,
      token,
    };

    return NextResponse.json(authResponse, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}