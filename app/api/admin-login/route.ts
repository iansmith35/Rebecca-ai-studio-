import { NextRequest, NextResponse } from 'next/server';
import { getAdminPasscode } from '@/lib/getAdminPasscode';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    
    if (!passcode) {
      return NextResponse.json(
        { success: false, error: 'Passcode is required' },
        { status: 400 }
      );
    }

    const adminPasscode = await getAdminPasscode();
    
    if (passcode === adminPasscode) {
      // Admin login successful
      // TODO: Add session/cookie logic here if needed
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid passcode' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}