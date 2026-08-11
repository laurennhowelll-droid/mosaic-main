import type { Metadata } from "next";
import ClarityCheckPrompt from "./ClarityCheckPrompt";
import "./globals.css";
import "./brand-assets.css";

export const metadata: Metadata = {
  title: "Mosaic — Businesses That Work Beautifully",
  description: "Mosaic brings ideas, systems, and experiences together so your business can work beautifully.",
  icons: {
    icon: [{ url: "/brand-reference/main-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClarityCheckPrompt />
      </body>
    </html>
  );
}
