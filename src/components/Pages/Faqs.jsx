export const metadata = {
  title: "Frequently Asked Questions (FAQ) | PushpakO2",
  description:
    "Detailed FAQs covering PushpakO2 technology, privacy, data governance, operations, compliance, and legal framework."
}

const faqContent = {
  title: "Frequently Asked Questions (FAQ)",
  sections: [
    {
      heading: "Organization & Philosophy",
      qa: [
        {
          q: "What is PushpakO2 and what problem does it solve?",
          a: "PushpakO2 is an Indian deep-technology company focused on autonomous aerospace systems, environmental intelligence, and automated pollution monitoring. The company addresses gaps in real-time environmental data collection, fragmented compliance mechanisms, and lack of auditable, tamper-resistant monitoring."
        },
        {
          q: "What differentiates PushpakO2 from other drone or monitoring companies?",
          a: "PushpakO2 operates with end-to-end in-house development, privacy-by-design architecture, government-grade governance frameworks, a zero data monetization policy, and an India-first data sovereignty approach. It does not operate as a consumer surveillance or advertising technology company."
        }
      ]
    },
    {
      heading: "Data Collection Principles",
      qa: [
        {
          q: "What is PushpakO2’s core data philosophy?",
          a: "PushpakO2 follows minimum collection, purpose isolation, controlled access, and finite retention. Data is treated as regulated infrastructure, not as a business asset for exploitation."
        },
        {
          q: "What categories of data does PushpakO2 collect?",
          a: "PushpakO2 may process limited personal data, technical and system data, and environmental or operational data strictly required for contractual, regulatory, or operational purposes."
        },
        {
          q: "Does PushpakO2 collect personal surveillance data?",
          a: "No. PushpakO2 systems are not designed for facial recognition, behavioral tracking, profiling, or personal surveillance. Any additional data collection occurs only when mandated by law."
        }
      ]
    },
    {
      heading: "Drones, Sensors & Field Operations",
      qa: [
        {
          q: "Do PushpakO2 drones capture images or videos of individuals?",
          a: "PushpakO2 platforms are configured for environmental sensing and diagnostics. Any visual capture is incidental, non-identifying, and not used for biometric or individual identification."
        },
        {
          q: "Is geolocation data treated as personal data?",
          a: "Environmental geolocation data is treated as non-personal by default. Where linkage to an identifiable individual is possible, enhanced safeguards are applied."
        }
      ]
    },
    {
      heading: "Consent & Legal Basis",
      qa: [
        {
          q: "On what legal basis does PushpakO2 process data?",
          a: "Processing is based on explicit consent, contractual necessity, legal obligation, government directive, or legitimate public interest. Implied consent is not relied upon."
        },
        {
          q: "Can consent be withdrawn?",
          a: "Yes, except where processing is required for statutory compliance, regulatory enforcement, government contracts, or legal retention obligations."
        }
      ]
    },
    {
      heading: "Data Usage & Restrictions",
      qa: [
        {
          q: "How does PushpakO2 use collected data?",
          a: "Data is used strictly for contractual execution, environmental analysis, system validation, compliance audits, and security or forensic purposes."
        },
        {
          q: "Does PushpakO2 use data to train AI models?",
          a: "Client or personal data is never used to train third-party AI systems. Any internal improvements rely on synthetic, anonymized, or explicitly approved datasets."
        },
        {
          q: "Is data reused across projects?",
          a: "No. Each project is logically and contractually isolated unless explicit written permission is obtained."
        }
      ]
    },
    {
      heading: "Data Storage, Retention & Security",
      qa: [
        {
          q: "Where is data stored?",
          a: "Data is primarily stored on secure India-based infrastructure. Cross-border storage is avoided unless legally unavoidable."
        },
        {
          q: "How long is data retained?",
          a: "Data is retained only for the duration required by contract or law, after which it is securely deleted, anonymized, or archived."
        },
        {
          q: "What security measures are in place?",
          a: "PushpakO2 employs encryption, zero-trust access control, multi-factor authentication, hardware-level protections, and continuous audit logging."
        }
      ]
    },
    {
      heading: "Data Sharing & Disclosure",
      qa: [
        {
          q: "Does PushpakO2 sell or monetize data?",
          a: "No. PushpakO2 does not sell, license, trade, or commercially exploit data."
        },
        {
          q: "Who can legally access the data?",
          a: "Access is limited to authorized personnel, regulators, courts, law enforcement, or contractually bound service providers under strict NDAs."
        }
      ]
    },
    {
      heading: "Government & Strategic Engagements",
      qa: [
        {
          q: "Who owns data in government projects?",
          a: "Typically, the commissioning authority owns the data. PushpakO2 acts as a data processor unless otherwise agreed contractually."
        },
        {
          q: "Are additional safeguards applied?",
          a: "Yes. Sensitive projects involve restricted access teams, enhanced confidentiality clauses, project-specific SOPs, and separate audit trails."
        }
      ]
    },
    {
      heading: "Rights Under DPDP Act, 2023",
      qa: [
        {
          q: "What rights do individuals have?",
          a: "Individuals may request access, correction, erasure, withdrawal of consent, and grievance redressal, subject to applicable law."
        },
        {
          q: "Can PushpakO2 refuse requests?",
          a: "Yes, where requests conflict with national security, regulatory mandates, active investigations, or legal retention requirements."
        }
      ]
    },
    {
      heading: "Grievance Redressal",
      qa: [
        {
          q: "How can a grievance be raised?",
          a: "Grievances must be submitted to legal@pushpako2.com to ensure traceability and compliance."
        },
        {
          q: "What is the resolution timeline?",
          a: "PushpakO2 aims to resolve grievances within 7 days, as mandated by law."
        }
      ]
    },
    {
      heading: "Breach & Incident Management",
      qa: [
        {
          q: "What happens in case of a data breach?",
          a: "PushpakO2 follows a formal protocol involving immediate containment, forensic investigation, regulatory notification if required, and stakeholder communication."
        }
      ]
    },
    {
      heading: "Governing Law & Updates",
      qa: [
        {
          q: "Which law governs PushpakO2’s data practices?",
          a: "All data practices are governed by Indian law, including the Digital Personal Data Protection Act, 2023."
        },
        {
          q: "Can this FAQ be updated?",
          a: "Yes. Updates may be made to reflect legal, regulatory, or technological changes."
        }
      ]
    }
  ]
}

export default function FAQs() {
  return (
    <section className="py-24 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-bold mb-12">
          {faqContent.title}
        </h1>

        <div className="space-y-12">
          {faqContent.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-semibold mb-6">
                {section.heading}
              </h2>

              <div className="space-y-6 text-gray-300">
                {section.qa.map((item, j) => (
                  <div key={j}>
                    <p className="font-semibold text-white">
                      {item.q}
                    </p>
                    <p className="mt-2 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
