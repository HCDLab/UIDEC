import './globals.css'
import {  } from '@tanstack/react-query'
import {  } from '@tanstack/react-query-devtools'

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import QueryProvider from './lib/QueryProvider'
import { Toaster } from './components/Toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Inspiration.',
	description: 'Design Inspiration creation tool.',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<QueryProvider>
				<TooltipProvider>
				<body className={inter.className}>{children}</body>
				</TooltipProvider>
			</QueryProvider>
			<Toaster />
		</html>
	)
}
