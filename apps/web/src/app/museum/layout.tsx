import { publishedDoors } from '@tiny/core'
import WalletProvider from '@/features/economy/components/WalletProvider'
import MuseumDoors from '@/features/rooms/MuseumDoors'
import MuseumStage from '@/features/rooms/MuseumStage'
import '../../styles/museum.css'

export default async function MuseumLayout({ children }: { children: React.ReactNode }) {
  return (
    <MuseumDoors doors={await publishedDoors()}>
      <WalletProvider>
        <MuseumStage>{children}</MuseumStage>
      </WalletProvider>
    </MuseumDoors>
  )
}
