import ServicesPage from "./ServicePage";

export default function ServicesClient({ services }) {
  return (
    <div className="min-h-screen text-white bg-[#060B18]">
      <main>
        <ServicesPage services={services} />
      </main>
    </div>
  )
}
