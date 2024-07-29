import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import pb from '@/client/pocketBase'

export function middleware(request: NextRequest) {
	const response = NextResponse.next()

	const authCookie = request.cookies.get('pb_auth')
	if (authCookie) {
		pb.authStore.loadFromCookie('pb_auth=' + authCookie.value)
		if (pb.authStore.isValid) {
			// Update the cookie with the latest session data
			const newCookie = pb.authStore.exportToCookie({ httpOnly: false })
			response.headers.set('Set-Cookie', newCookie)
		}
	}
	return response
}

export const config = {
	matcher: '/dashboard',
}
