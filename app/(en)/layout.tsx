import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { EmergencyBanner } from "@/components/ui/EmergencyBanner";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { organizationSchema } from "@/lib/seo";
import { getDictionary } from "@/i18n/dictionaries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "optional",
});

export const metadata: Metadata = {
  title: "AccidentPath — Your Path to Recovery Starts Here",
  description:
    "Clear guidance after an accident, smart next steps, and help finding the right attorney. Educational resources for injured people in California and Arizona.",
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "es": "/es/",
      "x-default": "/",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dict = await getDictionary('en')

  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface-page">
        <SchemaOrg schema={organizationSchema()} id="org-schema" />
        <EmergencyBanner />
        {/* Desktop header */}
        <div className="hidden lg:block sticky top-0 z-50">
          <Header locale="en" />
        </div>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-50 bg-surface-card border-b border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/" aria-label="AccidentPath home">
              <span className="text-lg font-bold text-primary-700 font-sans">
                Accident<span className="text-amber-500">Path</span>
              </span>
            </Link>
            <MobileNav locale="en" />
          </div>
        </div>
        {/* Main content — pb-20 on mobile reserves space above fixed CTA bar */}
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer locale="en" dict={dict} />
      </body>
    </html>
  );
}
