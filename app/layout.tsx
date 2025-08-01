import './globals.css'
import type { Metadata } from 'next'
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'RDR2 Nexus Intro',
  description: 'Red Dead Redemption 2 tarzı etkileşimli intro animasyonu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
