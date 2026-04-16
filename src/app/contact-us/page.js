import ContactUs from "@/components/Pages/Contactus/Index";
import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "Contact PushpakO2 | Aerospace & Aviation Company in Bhopal",
  description: "Connect with PushpakO2, Bhopal's leading aerospace and aviation company. For partnerships, investments, and drone technology inquiries in Madhya Pradesh.",
  keywords: ["PushpakO2 Bhopal", "Aerospace company near me", "Aviation startup in bhopal", "Contact PushpakO2", "Bhopal aviation industry"],
  path: "/contact-us"
});

const jsonLdContact = generateSchema('ContactPage', {
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "PushpakO2",
    "image": "https://pushpako2.com/pushpako2.png",
    "@id": "https://pushpako2.com/#localbusiness",
    "url": "https://pushpako2.com/contact-us",
    "telephone": "+91-8085613350",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pushpako2 Second Floor, 11, Aadi Parishar, Bagsewaniya",
      "addressLocality": "Bhopal",
      "addressRegion": "MP",
      "postalCode": "462026",
      "addressCountry": "IN"
    }
  }
});


export default function page() {
  return (
    <div className="min-h-screen text-white bg-[#060B18]  ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />
      <ContactUs />
    </div>
  )
}
