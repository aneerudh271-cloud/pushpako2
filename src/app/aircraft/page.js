


export const metadata = {
  title: "Aircraft | Pushpak O2",
  description: "Explore Pushpak O2 hydrogen-electric aircraft lineup."
}


const aircraftData = {
  title: "Aircraft Portfolio",
  models: [
    {
      name: "Pushpak O2 Ambulance",
      range: "300 km",
      payload: "400 kg",
      usage: "Air ambulance and emergency medical services"
    },
    {
      name: "Pushpak O2 Airtaxi",
      range: "450 km",
      payload: "450 kg",
      usage: "Urban and regional air taxi transportation"
    },
    {
      name: "Pushpak O2 Personal",
      range: "500 km",
      payload: "500 kg",
      usage: "Personal, executive, and private air travel"
    }
  ]
}

export default function AircraftClient() {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold mb-14">{aircraftData.title}</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {aircraftData.models.map((m) => (
            <div key={m.name} className="p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all">
              <h3 className="text-xl font-semibold mb-3">{m.name}</h3>
              <p className="text-gray-300">Range: {m.range}</p>
              <p className="text-gray-300">Payload: {m.payload}</p>
              <p className="text-gray-300">Application: {m.usage}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
