import type { Metadata, Viewport } from 'next'
import { BRAND } from '@tiny/core'
import ScreenChrome from '@/shared/components/ScreenChrome'
import SoundProvider from '@/features/sound/components/SoundProvider'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: BRAND,
  description:
    'A tiny museum you can walk through. Every artist gets a wall; every wall is worth stopping at.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff1d2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Beth+Ellen&family=Noto+Sans:wght@400;600&family=Sniglet:wght@400;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SoundProvider>
          <div className="screen">
            {children}
            <ScreenChrome />
          </div>
        </SoundProvider>
      </body>
    </html>
  )
}
