export const metadata = {
  title: "Press | Pushpak O2",
  description: "Latest media coverage and announcements."
}
const pressData = {
  title: "Press & Media",
  articles: [
    { title: "Pushpak O2 Raises ₹200 Cr Series A", source: "Economic Times", year: "2025" },
    { title: "Hydrogen Aviation Disrupts Urban Mobility", source: "TechCrunch", year: "2025" },
    { title: "India’s First Hydrogen Drone Platform", source: "Aviation Today", year: "2024" }
  ]
}

export default function page() {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold mb-12">{pressData.title}</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {pressData.articles.map((a) => (
            <div key={a.title} className="p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all">
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <p className="text-gray-300">{a.source}</p>
              <p className="text-gray-300">{a.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
