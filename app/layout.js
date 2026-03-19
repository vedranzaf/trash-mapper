import "./globals.css";

export const metadata = {
  title: "TrashMapper — Report & Map Illegal Dumping",
  description:
    "Help keep your community clean. Report illegally dumped trash by snapping photos, pinning locations on a map, and describing the situation. Together we organize cleanups.",
  keywords: ["trash", "illegal dumping", "cleanup", "community", "environment", "map", "report"],
  authors: [{ name: "TrashMapper" }],
  openGraph: {
    title: "TrashMapper — Report & Map Illegal Dumping",
    description: "Snap photos. Drop a pin. Report illegal trash. Help organize community cleanups.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#06080d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
