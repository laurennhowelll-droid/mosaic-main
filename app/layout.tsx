import type { Metadata } from "next";
import "./globals.css";
import "./brand-assets.css";

export const metadata: Metadata = {
  title: "Mosaic — Businesses That Work Beautifully",
  description: "Mosaic brings ideas, systems, and experiences together so your business can work beautifully.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MHZQ736ZDN" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-MHZQ736ZDN');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
