export const metadata = {
  title: "Privacy Policy | PushpakO2 Private Limited",
  description:
    "Privacy Policy of PushpakO2 Private Limited outlining data protection, security, lawful processing, and regulatory compliance under Indian law."
}

const privacyContent = {
  title: "Privacy Policy",
  sections: [
    {
      heading: "Foundational Commitment",
      content: [
        "PushpakO2 Private Limited (“PushpakO2”, “Company”, “We”, “Us”, or “Our”) operates in domains involving critical technology, environmental intelligence, unmanned aerial systems, and regulatory-facing deployments.",
        "Accordingly, PushpakO2 adopts a privacy-by-design and security-first doctrine where data is treated as critical infrastructure, collection is an exception and not a norm, access is privilege-based, and minimization is the default behavior.",
        "This Privacy Policy reflects PushpakO2’s zero-tolerance stance toward misuse, leakage, or over-collection of information."
      ]
    },
    {
      heading: "Legal & Regulatory Alignment",
      content: [
        "This Policy is framed in consonance with the Digital Personal Data Protection Act, 2023 (India), the Information Technology Act, 2000, CERT-In directions, and aviation-adjacent regulatory frameworks including DGCA and MoCA guidelines.",
        "Where sector-specific or project-specific regulations apply, those provisions shall prevail over this general policy."
      ]
    },
    {
      heading: "Scope of Applicability",
      content: [
        "This Policy applies to all interactions including website visits, demonstrations, pilots, proof-of-concepts, environmental monitoring operations, contractual engagements, vendor and employee data handling, and hardware-software interfaces.",
        "Engagement with PushpakO2 constitutes explicit acknowledgment and acceptance of this Policy."
      ]
    },
    {
      heading: "Data Classification Framework",
      content: [
        "Personal Data is collected strictly on a need-to-know basis and may include official identification details only when legally mandated.",
        "PushpakO2 does not collect biometric identifiers, personal lifestyle data, or behavioral profiling information.",
        "Technical and access data such as IP addresses, session logs, and system audit logs are generated automatically for security, compliance, and forensics.",
        "Operational, sensor, and environmental data generated during missions is treated as non-personal intelligence and is often owned by the commissioning authority."
      ]
    },
    {
      heading: "Purpose Limitation Doctrine",
      content: [
        "Data is processed strictly for contractual delivery, statutory compliance, environmental analysis, system validation, R&D improvement, and security audits.",
        "Under no circumstances is data used for advertising, resale, cross-project analytics without consent, or training third-party AI systems."
      ]
    },
    {
      heading: "Consent & Lawful Processing",
      content: [
        "Processing is based on explicit consent, contractual necessity, legal obligation, regulatory directive, or legitimate interest aligned with public and environmental good.",
        "Implied or ambiguous consent is not relied upon for sensitive data processing."
      ]
    },
    {
      heading: "Data Retention & Lifecycle Management",
      content: [
        "Data is retained only for the duration necessary based on contractual, statutory, or audit requirements.",
        "Upon completion, data is securely erased, anonymized, or archived in encrypted cold storage where legally mandated."
      ]
    },
    {
      heading: "Data Sovereignty & Localization",
      content: [
        "Core infrastructure prioritizes India-based servers.",
        "Cross-border data transfers are exceptional, legally vetted, and contractually protected."
      ]
    },
    {
      heading: "Information Security Architecture",
      content: [
        "PushpakO2 implements encryption at rest and in transit, zero-trust principles, multi-factor authentication, continuous monitoring, and hardware-level safeguards.",
        "Unauthorized access or data exfiltration attempts are treated as serious security breaches."
      ]
    },
    {
      heading: "Data Sharing & Disclosure",
      content: [
        "PushpakO2 does not sell, rent, or commercially exploit data.",
        "Limited disclosure may occur only to government authorities, regulators, courts, or contractually bound service providers under strict NDAs."
      ]
    },
    {
      heading: "Government & Strategic Projects",
      content: [
        "For sensitive deployments, the client retains ownership of mission data.",
        "PushpakO2 acts strictly as a data processor unless otherwise contractually agreed."
      ]
    },
    {
      heading: "Rights of Data Principals",
      content: [
        "Subject to applicable law, individuals may request access, rectification, erasure, or restriction of processing.",
        "Requests conflicting with national security, regulatory obligations, or active investigations may be lawfully refused with justification."
      ]
    },
    {
      heading: "Cookies & Digital Footprint",
      content: [
        "Only essential functional cookies are used.",
        "No third-party advertising trackers or behavioral profiling mechanisms are deployed."
      ]
    },
    {
      heading: "Third-Party Interfaces",
      content: [
        "PushpakO2 is not responsible for privacy practices of third-party platforms linked through its systems."
      ]
    },
    {
      heading: "Breach Response & Incident Management",
      content: [
        "In the event of a security incident, PushpakO2 follows immediate containment, forensic assessment, regulatory notification if required, and stakeholder communication as per law."
      ]
    },
    {
      heading: "Policy Revisions",
      content: [
        "This Policy may be updated to reflect legal, regulatory, or technological changes.",
        "Continued engagement constitutes acceptance of revised terms."
      ]
    },
    {
      heading: "Governing Law & Jurisdiction",
      content: [
        "This Policy is governed by the laws of India.",
        "Exclusive jurisdiction lies with Indian courts."
      ]
    },
    {
      heading: "Contact & Grievance Redressal",
      content: [
        "PushpakO2 Private Limited",
        "Email: legal@pushpako2.com",
        "Website: www.pushpako2.com"
      ]
    },
    {
      heading: "Final Declaration",
      content: [
        "PushpakO2 does not treat privacy as a compliance checkbox.",
        "It is a design constraint, ethical boundary, and strategic obligation."
      ]
    }
  ]
}

export default function Page() {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-bold mb-12">
          {privacyContent.title}
        </h1>

        <div className="space-y-10">
          {privacyContent.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mb-4">
                {section.heading}
              </h2>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                {section.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
