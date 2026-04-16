import LayoutWrapper from "@/app/LayoutWrapper"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import Providers from "@/components/Providers"
import AnalyticsTracker from "@/components/AnalyticsTracker"

import { SEO_CONFIG, generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = {
  ...generateMetadata({
    title: "PushpakO2 | Indian Aerospace & Advanced Engineering Authority",
    description: "PushpakO2 is India's premier indigenous aerospace company in Bhopal. Redefining the future of aviation with AI-enabled intelligent aerial systems and specialized unmanned drones.",
    keywords: ["PushpakO2", "Aerospace Bhopal", "Indian Aviation", "Urban Air Mobility"],
    path: "/"
  }),

  // Web App Manifest
  manifest: '/manifest.json',

  // App-specific meta tags
  appleWebApp: {
    capable: true,
    title: 'Pushpak O2',
    statusBarStyle: 'black-translucent',
  },

  // Additional verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Additional meta tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'Pushpak O2',
    'apple-mobile-web-app-title': 'Pushpak O2',
    'theme-color': '#667eea',
    'msapplication-TileColor': '#667eea',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#667eea',
};

const jsonLdOrg = generateSchema('Organization');
const jsonLdLocal = generateSchema('LocalBusiness');


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen  text-white bg-[#060B18]" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocal) }}
        />
        <Providers>
          <AnalyticsTracker />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
