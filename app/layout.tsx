import type { Metadata } from "next";
import "./globals.css";
import "./brand-assets.css";
import "./mosaic-theme.css";

export const metadata: Metadata = {
  title: "Custom CRM & Client Systems for Service Businesses | Mosaic",
  description:
    "Mosaic builds custom client systems that connect leads, follow-up, booking, payments, and reporting for growing service businesses.",
  openGraph: {
    title: "Custom CRM & Client Systems for Service Businesses | Mosaic",
    description:
      "Custom client systems that connect leads, follow-up, booking, payments, and reporting for growing service businesses.",
    url: "https://buildwithmosaic.co",
    siteName: "Mosaic",
    type: "website",
  },
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
