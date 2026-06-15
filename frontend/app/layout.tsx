import type { Metadata } from "next";
import {
  DM_Sans,
  Inter,
  Instrument_Serif,
  Poppins,
  Syne,
} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-family",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DAWN — Digital Agentic Workflow Navigator",
  description: "AI-powered pharmaceutical content library and campaign manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} ${poppins.variable} ${inter.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="dawn-theme font-sans antialiased h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
