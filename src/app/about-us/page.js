import AboutUS from "@/components/Pages/AboutUs/Index";

import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "About PushpakO2 | Indigenous Aerospace Company Bhopal, India",
  description: "PushpakO2 is a 100% indigenous Indian aerospace and advanced engineering company based in Bhopal, MP. We develop self-reliant aviation platforms, intelligent aerial systems, and unmanned drones for India and the world.",
  keywords: [
    "about pushpako2", "pushpak o2 company", "aerospace company bhopal",
    "indigenous aviation platforms", "self-reliant Indian aerospace",
    "global aviation innovator from India", "PushpakO2 leadership",
    "Make in India Aerospace", "atmanirbhar aerospace", "indian drone company"
  ],
  path: "/about-us"
});

const jsonLdAbout = generateSchema('AboutPage', {
  "name": "About PushpakO2",
  "description": "PushpakO2 is an Indian aerospace and advanced engineering company focused on the design, development, and deployment of indigenous aviation platforms and intelligent aerial systems.",
  "mainEntity": {
    "@type": "Organization",
    "name": "PushpakO2",
    "foundingDate": "2024", // Update if known
    "founder": [
      {
        "@type": "Person",
        "name": "Aneerudh Kumar",
        "jobTitle": "Co-Founder & Technology Lead"
      },
      {
        "@type": "Person",
        "name": "Aditya Shrivastava",
        "jobTitle": "President & Co-Founder"
      }
    ]
  }
});

export default function page() {
  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />
      <AboutUS />
    </div>
  )
}
