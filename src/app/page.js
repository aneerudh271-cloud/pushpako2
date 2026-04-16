import Home from "@/components/Pages/Homepage/Index";
import { connectDB } from "@/lib/db/connectDB";
import Team from "@/lib/models/Team";
import { leadershipTeam } from "@/lib/data/companyData";

import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "PushpakO2 | Indian Aerospace & Aviation Innovation | Bhopal",
  description: "PushpakO2 is India's premier indigenous aerospace company in Bhopal. Leading manufacturer of intelligent aerial systems, unmanned drones, UAV/UAS platforms. AI-enabled aviation technology for surveillance, agriculture, mapping & defense.",
  keywords: [
    "PushpakO2", "Pushpak O2", "pushpako2 bhopal", "pushpk o2",
    "Indian Aerospace", "Indigenous Aviation", "Autonomous Drones India",
    "Aerial Intelligence", "aerospace company bhopal", "drone manufacturer india",
    "UAV india", "UAS systems", "made in india drones"
  ],
  path: "/"
});

const jsonLdWebsite = generateSchema('WebSite', {
  "name": "PushpakO2",
  "url": "https://pushpako2.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pushpako2.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});


export default async function page() {
  let teamData = [];
  try {
    await connectDB();
    const dbMembers = await Team.find({}).sort({ order: 1 }).lean();
    if (dbMembers && dbMembers.length > 0) {
      teamData = JSON.parse(JSON.stringify(dbMembers));
    } else {
      teamData = leadershipTeam;
    }
  } catch (error) {
    console.error("Error fetching team data for home:", error);
    teamData = leadershipTeam;
  }

  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <Home teamData={teamData} />
    </div>
  )
}
