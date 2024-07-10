import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pb from '@/client/pocketBase'

export async function middleware(request: NextRequest) {
	const response = NextResponse.next()

	const cookieStore = cookies()
	const cookie = cookieStore.get('pb_auth')

  if (cookie) {
		try {
			pb.authStore.loadFromCookie([cookie.name, cookie.value].join('='))
		} catch (error) {
			pb.authStore.clear()
			response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }))
		}
	}

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		pb.authStore.isValid && (await pb.collection("users").authRefresh())
	} catch (err) {
		// clear the auth store on failed refresh
		pb.authStore.clear()
		response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }))
	}

	if (!pb.authStore.model && (!request.nextUrl.pathname.startsWith('/signin') || !request.nextUrl.pathname.startsWith('/signup'))) {
		const redirect_to = new URL('/signin', request.url)
		return NextResponse.redirect(redirect_to)
	}

	if (
		pb.authStore.model &&
		(request.nextUrl.pathname.startsWith('/signin') ||
		request.nextUrl.pathname.startsWith('/signup'))
	) {
		const redirect_to = new URL(`/dashboard`, request.url)
		return NextResponse.redirect(redirect_to)
	}

	return response
}

