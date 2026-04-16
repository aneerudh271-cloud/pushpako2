"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // State for dynamic contact info
  const [contactInfo, setContactInfo] = useState({
    email: "info@pushpako2.com",
    phone: "+91 90000 11111",
    address: "Bhopal, India",
  })
  const [loading, setLoading] = useState(false)

  // Fetch contact details on mount
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/about-us')
        if (response.ok) {
          const data = await response.json()
          // Extract company info from the footer section of the response if available
          const info = data?.footer?.companyInfo
          if (info) {
            setContactInfo({
              email: info.email || "info@pushpako2.com",
              phone: info.phone || "+91 80856 13350",
              address: info.address || "Bhopal, India",
            })
          }
        }
      } catch (error) {
        console.error('Error fetching contact details:', error)
      }
    }

    fetchContactData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔍 1. Console log submitted data
    console.log("📩 Contact Form Submitted:", form)

    // Basic frontend validation
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("API failed")

      // ✅ Success toast
      toast.success("Message sent successfully!")

      // 🧹 Clear form after success
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("❌ Contact submit error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Dynamic channels array based on fetching
  const channels = [
    { icon: Mail, label: "Email", value: contactInfo.email },
    { icon: Phone, label: "Phone", value: contactInfo.phone },
    { icon: MapPin, label: "Headquarters", value: contactInfo.address },
    { icon: Clock, label: "Working Hours", value: "Mon–Fri, 10AM–6PM IST" },
  ]

  return (
    <section className="min-h-screen py-24 text-white">
      <div className="container mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl font-bold mb-6">Contact Pushpak O2</h1>
          <p className="text-gray-300 mb-10 max-w-xl">
            Whether you are an investor, aviation partner, research institution, or future customer — our team is here to assist you.
          </p>

          <div className="space-y-6">
            {channels.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 border border-white/10 rounded-xl"
                >
                  <Icon />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-gray-300">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-10 border border-white/10 rounded-2xl space-y-6"
        >
          <h2 className="text-2xl font-semibold">Send Us a Message</h2>
          <p className="text-gray-300">Our specialists typically respond within 24 business hours.</p>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 bg-transparent border border-white/10 rounded-lg"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 bg-transparent border border-white/10 rounded-lg"
            required
          />

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full p-3 bg-transparent border border-white/10 rounded-lg"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full p-3 h-32 bg-transparent border border-white/10 rounded-lg"
            required
          />

          <button
            disabled={loading}
            className="w-full py-3 border border-white/10 rounded-lg hover:border-white/40 transition-all cursor-pointer"
          >
            {loading ? "Sending..." : "Submit Message"}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
