import { NextRequest, NextResponse } from 'next/server';

import pb from '@/client/pocketBase';

export async function middleware(req: NextRequest) {
  const authCookie = req.cookies.get('pb_auth');

  if (!authCookie || !authCookie.value) {
    return NextResponse.redirect('/login');
  }

  try {
 
    pb.authStore.loadFromCookie(authCookie.value);

    if (!pb.authStore.isValid) {
      return NextResponse.redirect('/login');
    }
  } catch (error) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
