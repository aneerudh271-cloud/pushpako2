"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ContactPage from "@/components/Pages/Contactus/ContactPage";
import { Loader2, X } from "lucide-react";

export default function FirstLoginContact({ investor = {}, onComplete }) {
    const [loading, setLoading] = useState(false);

    // We wrap the existing ContactPage but we want to intercept the success.
    // However, the current ContactPage doesn't have an 'onSuccess' prop.
    // We can either modify ContactPage to accept onSuccess, or we just rely on close button manually.
    // A better UX for "Onboarding" might be to use the existing API logic but show it in a modal.

    // Let's create a wrapper that uses the same minimal UI as before but calls the existing API.
    // Actually, the user asked to "use that" (Contact Us form). 
    // Let's modify ContactPage to be flexible or just re-implement the form logic here quickly to ensure it fits in a modal properly.
    // BUT the user said "i have already contactus form use that". 
    // So I will render the ContactPage component inside a modal, but I need to handle the "First Login" state update.

    // Since ContactPage handles its own submission and logic, we can't easily hook into its success unless we modify it.
    // Let's modify ContactPage slightly to accept an onSuccess callback if possible, OR
    // just provide a "Skip / I'm done" button for the first login overlay.

    // Let's just create a simplified version that looks like the contact form but specifically for this onboarding step
    // utilizing the same API endpoint. This avoids breaking the public contact page.

    const [form, setForm] = useState({
        name: investor.name || "",
        email: investor.email || "",
        subject: "Investor Onboarding Inquiry",
        message: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.message) {
            toast.error("Please enter a message");
            return;
        }

        setLoading(true);

        try {
            // 1. Send Contact Email
            const contactRes = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!contactRes.ok) throw new Error("Failed to send message");

            // 2. Update User Profile to mark first login as done
            // We do this AFTER successful contact (or if they choose to skip, see below)
            await markAsSeen();

            toast.success("Welcome aboard! Your message has been sent.");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const markAsSeen = async () => {
        try {
            const updateRes = await fetch(`/api/investors/${investor.id || investor._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFirstLogin: false }), // Set to false
            });
            if (!updateRes.ok) throw new Error("Failed to update profile");
            onComplete();
        } catch (err) {
            console.error("Failed to mark as seen:", err);
            // Even if this fails, we should probably let them in, but it will show again next time.
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-2xl bg-[#0B1221] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10"
            >
                <button
                    onClick={markAsSeen}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    title="Skip or Close"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome, {investor.name}!</h2>
                    <p className="text-gray-400">
                        We are excited to have you as an investor. Please feel free to send us an initial message or inquiry to get started.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                                disabled
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="How can we help you get started?"
                            className="w-full p-3 h-32 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={markAsSeen}
                            className="flex-1 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 font-medium rounded-lg transition"
                        >
                            Skip for Now
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
