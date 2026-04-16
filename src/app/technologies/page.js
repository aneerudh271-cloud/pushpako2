import { connectDB } from "@/lib/db/connectDB";
import Technology from "@/lib/models/Technology";
import TechnologiesClient from "@/components/Pages/Technology/Index";
import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "Advanced Aerospace Technologies | PushpakO2",
  description: "Discover our cutting-edge capabilities in Advanced Avionics, AI-Enabled Sensing, Propulsion Systems, and Indigenous System Integration.",
  keywords: ["Advanced avionics", "AI-enabled sensing", "Propulsion systems", "Data intelligence platforms", "System integration & manufacturing"],
  path: "/technologies"
});

export default async function page() {
  let technologies = [];
  let techSchema = {};

  try {
    await connectDB();
    technologies = await Technology.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
    technologies = JSON.parse(JSON.stringify(technologies));

    // Generate ItemList Schema for Technologies
    const techItems = technologies.map((tech, index) => ({
      "@type": "Product", // or TechnicalArticle or similar
      "name": tech.title,
      "description": tech.description,
      "url": `https://pushpako2.com/technologies#${tech._id}`
    }));

    techSchema = generateSchema('ItemList', {
      "itemListElement": techItems
    });

  } catch (error) {
    console.error("Error fetching technologies:", error);
  }

  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techSchema) }}
      />
      <TechnologiesClient technologies={technologies} />
    </div>
  );
}
