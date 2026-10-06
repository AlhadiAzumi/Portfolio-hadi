import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../styles/globals.css"
import PageLoader from "@/components/PageLoader"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://ryhar.my.id"),
  title: {
    default: "Alhadi Azumi | Portfolio",
    template: "%s | Alhadi Azumi Portfolio",
  },
  description: "Personal portfolio of Alhadi Azumi. Software Developer specializing in Next.js, Node.js, and modern web development.",
  keywords: ["Alhadi Azumi", "Portfolio", "Software Developer", "Web Development", "Backend", "Frontend", "Next.js", "React", "Node.js"],
  authors: [{ name: "Alhadi Azumi" }],
  creator: "Alhadi Azumi",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Alhadi Azumi | Portfolio",
    description: "Personal portfolio of Alhadi Azumi. Software Developer specializing in Next.js, Node.js, and modern web development.",
    siteName: "Alhadi Azumi Portfolio",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Alhadi Azumi Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alhadi Azumi | Portfolio",
    description: "Personal portfolio of Alhadi Azumi. Software Developer specializing in Next.js, Node.js, and modern web development.",
    images: ["/images/hero.jpg"],
    creator: "@AlhadiAzumi",
  },
  icons: {
    icon: "/images/hero.jpg",
    shortcut: "/images/hero.jpg",
    apple: "/images/hero.jpg",
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ZbLhiilDbtLDyIx5eH6Jeoe1jPkXNKId-LhXG1HhLWA",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PageLoader />
        {children}
      </body>
    </html>
  )
}

