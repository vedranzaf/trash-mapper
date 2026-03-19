import "./globals.css";

export const metadata = {
  title: "TrashMapper — Report & Map Illegal Dumping",
  description: "Help keep your community clean. Report illegally dumped trash.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#06080d",
};

export default function RootLayout({ children }) {
  return children;
}
