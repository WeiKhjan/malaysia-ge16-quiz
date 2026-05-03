import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const SITE_URL = "https://quiz.malaysiage16.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GE16 Voter Compass — Which Party Matches You?",
  description:
    "Take a 10-question pixel-art quiz to find out which Malaysian coalition (PH / BN / PN) matches your views for GE16. No login. No data collected.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "GE16 Voter Compass — Which Party Matches You?",
    description:
      "10 questions. 3 parties. Find your political match for Malaysia's next general election.",
    url: SITE_URL,
    siteName: "GE16 Voter Compass",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GE16 Voter Compass",
    description:
      "10 questions. 3 parties. Find your political match for Malaysia's next general election.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e27",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
