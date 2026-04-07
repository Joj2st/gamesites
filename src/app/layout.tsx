import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Geometry Dash Online - Play Free Platformer Game",
  description: "Play Geometry Dash Online - A fast-paced rhythm-based platformer game. Jump, fly, and flip your way through dangerous passages and spiky obstacles.",
  keywords: "Geometry Dash, online game, platformer, rhythm game, free game",
  authors: [{ name: "GameStation" }],
  creator: "GameStation",
  publisher: "GameStation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://geometrydashgame.online/",
    siteName: "Geometry Dash Online",
    title: "Geometry Dash Online - Play Free Platformer Game",
    description: "Play Geometry Dash Online - A fast-paced rhythm-based platformer game. Jump, fly, and flip your way through dangerous passages and spiky obstacles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geometry Dash Online - Play Free Platformer Game",
    description: "Play Geometry Dash Online - A fast-paced rhythm-based platformer game. Jump, fly, and flip your way through dangerous passages and spiky obstacles.",
  },
  alternates: {
    canonical: "https://geometrydashgame.online/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://geometrydashgame.online/" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
