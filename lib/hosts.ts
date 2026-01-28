const env =
		process.env.NEXT_PUBLIC_ENV === 'production'
		? 'production': 'development'

export const LINK_HOST = {
	production: '1.bahati.dev',
	development: '127.0.0.1:3000',
}[env]

export const APP_HOST = {
	production: '1.bahati.dev',
	development: '127.0.0.1:3000',
}[env]

export const PROTOCOL = env === 'development' ? 'http://' : 'https://'
