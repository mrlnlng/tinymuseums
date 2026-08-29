import type { Metadata } from 'next'
import { BRAND } from '@tiny/core'
import ScreenChrome from '@/components/ScreenChrome'
import SoundProvider from '@/components/SoundProvider'
import './globals.css'

export const metadata: Metadata = {
  title: BRAND,
  description:
    'A tiny museum you can walk through. Every artist gets a wall; every wall is worth stopping at.',
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
        {/*
          The audio element lives here, above the screen, so walking from the
          landing page into the hall does not restart the track.
        */}
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
