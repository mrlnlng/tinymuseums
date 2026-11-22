import WalletProvider from '@/features/economy/components/WalletProvider'
import MuseumStage from '@/features/rooms/MuseumStage'
import '../../styles/museum.css'

export default function MuseumLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <MuseumStage>{children}</MuseumStage>
    </WalletProvider>
  )
}
