import { connectDB } from "@/lib/db/connectDB";
import Team from "@/lib/models/Team";
import TeamsClient from "@/components/Pages/Teams/Index";
import { leadershipTeam } from "@/lib/data/companyData";
import { generateMetadata, generateSchema } from "@/lib/seo-config";

export const metadata = generateMetadata({
  title: "Leadership Team | PushpakO2 - Aerospace Experts",
  description: "Meet the experts behind PushpakO2. Our leadership combines deep aviation technology experience with strategic vision for India's indigenous aerospace future.",
  keywords: ["PushpakO2 Founders", "Aerospace Engineers India", "Aneerudh Kumar", "Aditya Shrivastava", "Aviation Leadership"],
  path: "/our-team"
});

export default async function page() {
  let members = [];
  let teamSchema = {};


  try {
    await connectDB();
    const dbMembers = await Team.find({}).sort({ order: 1 }).lean();

    if (dbMembers && dbMembers.length > 0) {
      members = JSON.parse(JSON.stringify(dbMembers));
      console.log('Team members from database:', members.length);
    } else {
      // Use hardcoded leadership data as fallback
      console.log('No team members in database, using hardcoded data');
      members = leadershipTeam;
    }
  } catch (error) {
    console.error("Error fetching team:", error);
    members = leadershipTeam;
  }

  // Generate Schema for Team
  // We can create a collection of Person entities
  const personItems = members.map((member) => ({
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.role,
    "image": member.image,
    "description": member.bio,
    "worksFor": {
      "@type": "Organization",
      "name": "PushpakO2"
    }
  }));

  teamSchema = generateSchema('AboutPage', {
    "name": "PushpakO2 Leadership Team",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": personItems
    }
  });


  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <TeamsClient members={members} />
    </div>
  );
}
