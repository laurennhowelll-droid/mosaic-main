import type { Metadata } from "next";
import "./globals.css";
import "./brand-assets.css";
import "./mosaic-theme.css";

export const metadata: Metadata = {
  title: "Mosaic | CRMs, Dashboards & Growth Systems for Service Businesses",
  description:
    "Mosaic builds custom CRMs, dashboards, automations, websites, and marketing systems that help growing service businesses capture leads, improve follow-up, and understand what drives revenue.",
  openGraph: {
    title: "Mosaic | CRMs, Dashboards & Growth Systems for Service Businesses",
    description:
      "Custom CRMs, dashboards, automations, websites, and marketing systems for growing service businesses.",
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
