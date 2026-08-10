import type { Metadata } from "next";
import "./globals.css";
import "./brand-assets.css";

export const metadata: Metadata = {
  title: "Mosaic — Businesses That Work Beautifully",
  description: "Mosaic brings ideas, systems, and experiences together so your business can work beautifully.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
