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

/* `viewportFit: 'cover'` is what makes `env(safe-area-inset-*)` report real values on a phone. */
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
          href="https://fonts.googleapis.com/css2?family=Beth+Ellen&family=Sniglet:wght@400;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* The audio element lives here, above the screen, so walking from the
            landing page into the hall does not restart the track. */}
        <SoundProvider>
          {/* One frame for every route, so no screen sets its own size. */}
          <div className="screen">
            {children}
            <ScreenChrome />
          </div>
        </SoundProvider>
      </body>
    </html>
  )
}
