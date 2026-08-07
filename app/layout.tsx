import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosaic — Made for what’s next",
  description: "A considered digital experience, built to move your business forward.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
