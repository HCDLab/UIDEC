import './globals.css'
import 'react-fontpicker-ts/dist/index.css'
import "./Sidebar/fontselector.module.css"

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import QueryProvider from './lib/QueryProvider'
import { Toaster } from './components/Toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'UIDEC.',
	description: 'Design & Inspiration tool.',
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
