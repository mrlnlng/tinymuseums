import type { Metadata, Viewport } from 'next'
import { Beth_Ellen, Noto_Sans, Sniglet } from 'next/font/google'
import localFont from 'next/font/local'
import { BRAND } from '@tiny/core'
import ScreenChrome from '@/shared/components/ScreenChrome'
import SoundProvider from '@/features/sound/components/SoundProvider'
import '../styles/globals.css'

const inspiratiq = localFont({
  src: '../../public/fonts/Inspiratiq_tiny_museum-Regular.otf',
  weight: '400',
  display: 'swap',
  variable: '--font-inspiratiq',
})

const sniglet = Sniglet({
  weight: ['400', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sniglet',
})

const bethEllen = Beth_Ellen({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-beth-ellen',
})

const notoSans = Noto_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-sans',
})

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
    <html lang="en" className={`${inspiratiq.variable} ${sniglet.variable} ${bethEllen.variable} ${notoSans.variable}`}>
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
