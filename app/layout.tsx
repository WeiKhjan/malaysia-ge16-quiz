import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "GE16 Voter Compass — Which Party Matches You?",
  description:
    "Take a 10-question pixel-art quiz to find out which Malaysian coalition (PH / BN / PN) matches your views for GE16. No login. No data collected.",
  openGraph: {
    title: "GE16 Voter Compass",
    description: "Find your political match for Malaysia's next general election.",
    type: "website",
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
