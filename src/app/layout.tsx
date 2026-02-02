import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Countdown Timer - Gratis nedtælling til din store dag | CountdownTimer.dk",
  description: "Gratis dansk countdown timer. Tæl ned til bryllup, fødselsdag, ferie eller nytår. Del nemt med venner og familie via link.",
  keywords: "countdown timer, nedtælling, bryllup countdown, fødselsdag countdown, nytår countdown, gratis timer, dansk countdown",
  authors: [{ name: "CountdownTimer.dk" }],
  openGraph: {
    title: "Countdown Timer - Tæl ned til din store dag",
    description: "Gratis countdown timer til bryllup, fødselsdag, ferie og mere. Del med venner!",
    type: "website",
    locale: "da_DK",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <head>
        <link rel="canonical" href="https://countdowntimer.dk" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Countdown Timer",
              "description": "Gratis dansk countdown timer til bryllup, fødselsdag og events",
              "url": "https://countdowntimer.dk",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "DKK"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
