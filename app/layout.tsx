import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SupabaseAppProvider } from "@/lib/supabase-app-context"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Aguulahiin Udirlgiin System",
  description: "Aguulahiin udirlgal ba holboltiin system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full flex flex-col">
        <SupabaseAppProvider>
          {children}
        </SupabaseAppProvider>
      </body>
    </html>
  )
}