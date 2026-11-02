import WalletProvider from '@/features/economy/components/WalletProvider'

export default function MuseumLayout({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
