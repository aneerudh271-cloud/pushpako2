"use client"
import { motion } from "framer-motion"
import { teamPageData, foundingLeadershipApproach, leadershipTeam } from "@/lib/data/companyData"
import TeamHeader from "./components/TeamHeader"
import LeadershipApproach from "./components/LeadershipApproach"
import JoinMission from "./components/JoinMission"
import TeamCarousel from "./components/TeamCarousel"

export default function TeamPage({ members: membersData }) {
  // Use database data if available, otherwise use hardcoded data
  const members = membersData && membersData.length > 0 ? membersData : leadershipTeam

  return (
    <section className="py-24 text-white bg-background-darker relative overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Header */}
        <TeamHeader
          title={teamPageData.title}
          subtitle={teamPageData.subtitle}
        />

        {/* Leadership Cards Carousel */}
        {members.length > 0 ? (
          <TeamCarousel members={members} />
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">No team members found</h3>
            <p className="text-gray-500">Team members will be displayed here once added.</p>
          </motion.div>
        )}

        {/* Leadership Approach Section */}
        <LeadershipApproach data={foundingLeadershipApproach} />

        {/* CTA */}
        <JoinMission />
      </div>
    </section>
  )
}

