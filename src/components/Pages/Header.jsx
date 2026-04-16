"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Grip, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { data: session, status } = useSession()
  // console.log(session, "session")
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "/services" },
    { label: "Technology", href: "/technologies" },
    { label: "Our Team", href: "/our-team" },
    { label: "Blogs", href: "/blogs" },
    { label: "Hackathons", href: "/hackathons", badge: "Live" },
    { label: "Investors", href: session ? `/dashboards/investors/${session.user.id}` : "/sign-in", badge: "Series A" },
    { label: "Contact Us", href: "/contact-us" },
  ]

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (isMenuOpen) setIsMenuOpen(false)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMenuOpen])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-[#060B18]/50 backdrop-blur-xl border-b border-border shadow-lg"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className=" relative w-24 h-12 rounded-lg flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] ">

                <Image
                  src="/pushpako2.png"
                  alt="PushpakO2 (Pushpak O2) Logo"
                  fill
                  className="object-contain relative z-10"
                  size="40px"
                />
              </div>

              <div className="absolute inset-0 rounded-lg bg-[#07C5EB]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {/* <span className="font-heading font-bold text-lg tracking-wider text-white">
              PUSHPAK O2
            </span> */}
          </Link>

          {/* Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-black hover:bg-secondary rounded-lg transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Grip className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Vertical Menu */}
      {/* Right Side Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Drawer */}
            <motion.aside
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="
          fixed top-0 right-0 z-50 h-screen
          w-full md:w-1/3 lg:w-1/4
          bg-[#060B18]/90 backdrop-blur-xl
          border-l border-border
          flex flex-col
        "
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-end px-6 h-[70px] border-b border-border">
                {/* <span className="text-white font-semibold">Menu</span> */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-white hover:bg-secondary hover:text-black"
                >
                  <X className="w-5 h-5 self-end" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col gap-2 px-6 py-6 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-white hover:text-black hover:bg-secondary/80 rounded-lg transition"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Buttons */}
              <div className="px-6 pb-6 flex gap-3 items-center">
                {session ? (
                  <Button
                    className="w-1/2 bg-red-500 hover:bg-red-600 border border-white flex items-center gap-2"
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/sign-in" className="w-1/2">
                    <Button
                      className="w-full cursor-pointer bg-[#07c5ebd3] hover:bg-[#07c5eb81] border border-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </motion.header>
  )
}
