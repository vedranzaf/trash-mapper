import "../globals.css";
import { locales } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEnglish = locale === 'en';

  return {
    title: isEnglish
      ? "TrashMapper — Report & Map Illegal Dumping"
      : "ТрешМапер — Пријави и Мапирај Нелегално Фрлање",
    description: isEnglish
      ? "Help keep your community clean. Report illegally dumped trash by snapping photos, pinning locations on a map, and describing the situation."
      : "Помогнете ја заедницата да биде чиста. Пријавете нелегално фрлен отпад со фотографии, локација на мапа и опис на ситуацијата.",
    keywords: isEnglish
      ? ["trash", "illegal dumping", "cleanup", "community", "environment", "map", "report"]
      : ["отпад", "нелегално фрлање", "чистење", "заедница", "животна средина", "мапа", "пријава"],
    authors: [{ name: isEnglish ? "TrashMapper" : "ТрешМапер" }],
    openGraph: {
      title: isEnglish
        ? "TrashMapper — Report & Map Illegal Dumping"
        : "ТрешМапер — Пријави и Мапирај Нелегално Фрлање",
      description: isEnglish
        ? "Snap photos. Drop a pin. Report illegal trash. Help organize community cleanups."
        : "Сликај. Постави пин. Пријави отпад. Помогни во организирање на чистење.",
      type: "website",
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#06080d",
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  );
}
