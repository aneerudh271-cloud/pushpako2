
'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Beaker, Plane, CheckCircle2, Circle, AlertCircle, Award, Star, Flag } from 'lucide-react';

export default function RoadmapPage() {
  const roadmapData = [
    {
      phase: "Phase 1",
      year: "2024-25",
      title: "FOUNDATION & DESIGN",
      icon: <BadgeCheck className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />,
      items: [
        { text: "Conceptual Design Review", status: "completed" },
        { text: "Preliminary Safety Assessment", status: "completed" },
        { text: "Powertrain Bench Testing", status: "in-progress" },
      ]
    },
    {
      phase: "Phase 2",
      year: "2025-26",
      title: "VALIDATION & GROUND TEST",
      icon: <Beaker className="w-6 h-6 text-blue-400" />,
      items: [
        { text: "Detailed Design Review", status: "pending" },
        { text: "Component Qualification", status: "pending" },
        { text: "Ground Test Program", status: "pending" },
      ]
    },
    {
      phase: "Target",
      year: "2026-27",
      title: "FLIGHT & CERTIFICATION",
      icon: <Plane className="w-6 h-6 text-white" />,
      isTarget: true,
      items: [
        { text: "Flight Test Campaign", status: "pending" },
        { text: "Certification Evaluation", status: "pending" },
      ],
      milestone: {
        year: "2027 Milestone",
        text: "Type Certification + Commercial Ops Approval"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#060B18] text-white py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Certification Roadmap</h1>
            </div>
            <p className="text-lg text-gray-400 ml-1">Regulatory Path with DGCA + FAA Advisory Support</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Pushpak 02 Series A</span>
          </div>
        </motion.div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roadmapData.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 group
                        ${phase.isTarget
                  ? 'bg-[#0F1629] border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0F1629]/50 border-gray-800 hover:border-gray-700'
                }
                    `}
            >
              {/* Connection Line (Desktop) */}
              {index < roadmapData.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-10 w-12 h-[2px] bg-gray-800 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rounded-full" />
                </div>
              )}

              {/* Header Section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                                ${phase.isTarget ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}
                            `}>
                    {phase.phase}
                  </span>
                  <h2 className="text-4xl font-bold mb-2 text-white/90">{phase.year}</h2>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{phase.title}</h3>
                </div>
                <div className={`p-3 rounded-full ${phase.isTarget ? 'bg-blue-600' : 'bg-gray-800 group-hover:bg-gray-700 transition-colors'}`}>
                  {phase.icon}
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-800 mb-6" />

              {/* List Items */}
              <ul className="space-y-6">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    ) : item.status === 'in-progress' ? (
                      <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                        <div className="absolute w-full h-full bg-blue-500/20 rounded-full animate-ping" />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600 shrink-0" />
                    )}
                    <span className={`${item.status === 'completed' ? 'text-gray-300' : item.status === 'in-progress' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Milestone Box (Target Card Only) */}
              {phase.milestone && (
                <div className="mt-8 p-4 rounded-xl bg-blue-900/20 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2 text-white font-semibold">
                    <Flag className="w-4 h-4 fill-white" />
                    <span>{phase.milestone.year}</span>
                  </div>
                  <p className="text-sm text-blue-200/80 leading-relaxed">
                    {phase.milestone.text}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
