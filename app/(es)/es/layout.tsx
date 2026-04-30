import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Link from "next/link";
import "../../globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
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
  title: "AccidentPath | Guía de Accidentes en California",
  description:
    "Obtenga orientación clara después de un accidente. Conéctese con abogados calificados. Servicio gratuito, sin compromiso.",
  other: {
    google: "notranslate",
  },
  alternates: {
    canonical: "/es/",
    languages: {
      "en": "/",
      "es": "/es/",
      "x-default": "/",
    },
  },
};

export default async function EsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary("es");

  return (
    <html
      lang="es"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface-page">
        <SchemaOrg schema={organizationSchema()} id="org-schema" />
        <EmergencyBanner locale="es" />
        {/* Desktop header */}
        <div className="hidden lg:block sticky top-0 z-50">
          <Header locale="es" />
        </div>
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-50 bg-surface-card border-b border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/es/" aria-label="AccidentPath inicio">
              <span className="text-lg font-bold text-primary-700 font-sans">
                Accident<span className="text-amber-500">Path</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <MobileNav locale="es" />
            </div>
          </div>
        </div>
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer locale="es" dict={dict} />
      </body>
    </html>
  );
}
