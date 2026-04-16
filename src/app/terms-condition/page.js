export const metadata = {
  title: "Terms & Conditions | PushpakO2",
  description:
    "Terms and Conditions governing the use of the PushpakO2 website and digital platforms.",
};

const termsContent = {
  title: "Terms & Conditions",
  sections: [
    {
      heading: "Introduction & Acceptance",
      text: `By accessing or using this website, you agree to be bound by these Terms and all applicable laws of India.`,
    },
    {
      heading: "Nature of the Website",
      text: `The website is intended solely for informational, corporate, and regulatory communication purposes and does not constitute a service platform or contractual offer.`,
    },
    {
      heading: "Intellectual Property Rights",
      text: `All content, designs, logos, and materials on this website are the intellectual property of PushpakO2 and may not be copied or exploited without prior written consent.`,
    },
    {
      heading: "Limitation of Liability",
      text: `To the maximum extent permitted by law, PushpakO2 shall not be liable for any direct or indirect damages arising from use of the website.`,
    },
    {
      heading: "Governing Law & Jurisdiction",
      text: `These Terms are governed by the laws of India, and disputes are subject to the exclusive jurisdiction of Indian courts.`,
    },
  ],
};

export default function TermsPage() {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-bold mb-12">
          {termsContent.title}
        </h1>

        <div className="space-y-10">
          {termsContent.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mb-4">
                {section.heading}
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
