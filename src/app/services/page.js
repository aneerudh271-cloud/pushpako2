import { connectDB } from "@/lib/db/connectDB";
import Service from "@/lib/models/Service";
import ServicesClient from "@/components/Pages/Services/Index";
import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "Aviation & Aerospace Services | Drone Solutions | PushpakO2",
  description: "PushpakO2 offers specialized aerospace services: UAV/Drone systems, intelligent aerial platforms, surveillance solutions, agricultural drones, mapping & survey, infrastructure inspection, and environmental monitoring across India.",
  keywords: [
    "drone services india", "UAV services", "aerial survey", "drone surveillance",
    "Aviation Platform Design", "Intelligent Aerial Systems",
    "Unmanned & Autonomous Systems", "Environmental Monitoring Drones",
    "Advanced Mobility", "agricultural drones", "mapping drones",
    "inspection drones", "commercial drone solutions"
  ],
  path: "/services"
});

export default async function page() {
  let services = [];
  let serviceSchema = {};

  try {
    await connectDB();
    services = await Service.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
    services = JSON.parse(JSON.stringify(services));

    // Generate ItemList Schema for Services
    const serviceItems = services.map((service, index) => ({
      "@type": "Service",
      "position": index + 1,
      "name": service.title,
      "description": service.description,
      "url": `https://pushpako2.com/services#${service._id}` // Assuming anchor links or similar
    }));

    serviceSchema = generateSchema('ItemList', {
      "itemListElement": serviceItems
    });

  } catch (error) {
    console.error("Error fetching services:", error);
  }

  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicesClient services={services} />
    </div>
  );
}
