// PushpakO2 Company Profile - Hardcoded Data Configuration
// This data serves as fallback when database data is not available

export const companyProfile = {
    companyName: "PushpakO2 Private Initiative",
    brandName: "PushpakO2",
    tagline: "Redefining the Future of Indian Aviation & Aerospace Systems",

    about: `PushpakO2 is an Indian aerospace and advanced engineering company focused on the design, development, and deployment of indigenous aviation platforms and intelligent aerial systems. The company is built on the philosophy of complete in-house development, ensuring full control over design, IP, manufacturing processes, and system integration.

PushpakO2 aims to position India as a self-reliant global aviation innovator, delivering scalable, sustainable, and mission-ready solutions across civil aviation, unmanned systems, environmental monitoring, and advanced mobility.`,

    vision: "To establish India as a global leader in next-generation aviation and aerial intelligence systems, fully designed, engineered, and manufactured within the country.",

    mission: [
        "To develop 100% indigenous aviation platforms with zero dependency on foreign core technologies",
        "To deliver safe, scalable, and commercially viable aerial systems",
        "To integrate advanced avionics, propulsion, AI-enabled sensing, and data intelligence into aviation",
        "To support national priorities including sustainability, surveillance, environmental protection, and smart infrastructure"
    ],

    corePhilosophy: [
        "Make in India – From Scratch",
        "Design First, Manufacture Next",
        "IP Ownership Over Assembly",
        "Safety, Compliance & Scalability",
        "Long-term Aviation Ecosystem Building"
    ],

    keyDomains: [
        {
            id: "aviation-platforms",
            title: "Aviation Platforms",
            description: "Fixed-wing and hybrid aircraft concepts, commercial and utility-focused aviation designs, modular and scalable aircraft architectures",
            items: [
                "Fixed-wing and hybrid aircraft concepts",
                "Commercial and utility-focused aviation designs",
                "Modular, scalable aircraft architectures"
            ],
            icon: "Plane"
        },
        {
            id: "unmanned-aerial-systems",
            title: "Unmanned Aerial Systems (UAS)",
            description: "Surveillance & reconnaissance drones, environmental monitoring & pollution reconnaissance drones, custom mission-specific aerial platforms",
            items: [
                "Surveillance & reconnaissance drones",
                "Environmental monitoring & pollution reconnaissance drones",
                "Custom mission-specific aerial platforms"
            ],
            icon: "Drone"
        },
        {
            id: "advanced-engineering",
            title: "Advanced Engineering & Design",
            description: "Aircraft structural design, aerodynamics & systems integration, avionics architecture & electronic systems, ground control systems & telemetry",
            items: [
                "Aircraft structural design (CAD/CAE)",
                "Aerodynamics & systems integration",
                "Avionics architecture & electronic systems",
                "Ground control systems & telemetry"
            ],
            icon: "Cog"
        },
        {
            id: "environmental-solutions",
            title: "Environmental & Governance Solutions",
            description: "Automated pollution data acquisition, drone-based compliance and reporting systems, data-driven decision platforms for regulators",
            items: [
                "Automated pollution data acquisition",
                "Drone-based compliance and reporting systems",
                "Data-driven decision platforms for regulators"
            ],
            icon: "Leaf"
        }
    ],

    technologyCapabilities: [
        "End-to-end in-house design & prototyping",
        "Advanced CAD (CATIA, AutoCAD, simulation tools)",
        "Embedded electronics & avionics systems",
        "AI-enabled data capture & analytics",
        "Secure data management & compliance frameworks",
        "Modular payload & mission architecture"
    ],

    makeInIndiaCommitment: {
        title: "Make-in-India Commitment",
        description: "PushpakO2 follows a true Make-in-India approach, ensuring strategic autonomy, cost control, and export readiness.",
        points: [
            "Core designs are conceived and engineered in India",
            "Critical systems are developed in-house",
            "Intellectual property is owned, protected, and retained",
            "Manufacturing is structured to scale domestically",
            "Dependency on imported black-box systems is minimized"
        ]
    },

    regulatoryCompliance: {
        title: "Regulatory & Compliance Orientation",
        description: "PushpakO2 is structured to align with national and international aviation standards.",
        standards: [
            "DGCA regulations (India)",
            "Civil aviation safety norms",
            "UAS & drone policy frameworks",
            "Environmental and data compliance standards",
            "Corporate governance & audit-ready operations"
        ]
    }
};

export const leadershipTeam = [
    {
        id: "aneerudh-kumar",
        name: "Mr. Aneerudh Kumar",
        role: "Co-Founder & Technology Lead",
        department: "Technology",
        image: "/team/aneerudh-kumar.jpg",
        bio: `Mr. Aneerudh Kumar is the Co-Founder and Technology Lead of PushpakO2 and is the principal architect behind the company's core engineering and technology stack. He leads the end-to-end development of PushpakO2's aviation and unmanned aerial systems, spanning concept design, system architecture, detailed engineering, prototyping, testing, and validation.`
    },
    // {
    //     id: "aditya-shrivastava",
    //     name: "Mr. Aditya Shrivastava",
    //     role: "President & Co-Founder",
    //     department: "Executive",
    //     image: "/team/aditya-shrivastava.jpg",
    //     bio: `Mr. Aditya Shrivastava is the President and Co-Founder of PushpakO2 and provides overall strategic leadership, governance oversight, and long-term vision for the organization. He is responsible for shaping the company's direction across regulatory alignment, institutional partnerships, organizational structure, compliance frameworks, and national positioning.`
    // }
];

export const foundingLeadershipApproach = {
    title: "Founding Leadership Approach",
    description: "PushpakO2 is led by a balanced founding team, where technology leadership drives depth, reliability, and innovation while strategic leadership ensures compliance, scalability, and national alignment.",
    points: [
        "Technology leadership drives depth, reliability, and innovation",
        "Strategic leadership ensures compliance, scalability, and national alignment"
    ],
    conclusion: "This dual-leadership model allows PushpakO2 to simultaneously pursue engineering excellence and institutional credibility, a combination essential for success in regulated aviation and aerospace domains."
};

// About Us page specific data with fallback
export const aboutUsPageData = {
    hero: {
        id: "hero",
        title: "Redefining the Future of",
        subtitle: "Indian Aviation & Aerospace",
        description: "PushpakO2 is an Indian aerospace and advanced engineering company focused on the design, development, and deployment of indigenous aviation platforms and intelligent aerial systems.",
        backgroundImage: "/hero-aircraft.jpg",
        ctaText: "Explore Our Solutions",
        ctaLink: "/services"
    },
    vision: {
        id: "vision",
        title: "Our Vision",
        content: "To establish India as a global leader in next-generation aviation and aerial intelligence systems, fully designed, engineered, and manufactured within the country.",
        extendedContent: "PushpakO2 aims to position India as a self-reliant global aviation innovator, delivering scalable, sustainable, and mission-ready solutions across civil aviation, unmanned systems, environmental monitoring, and advanced mobility.",
        image: "/hero-drone-video.gif"
    },
    mission: {
        id: "mission",
        title: "Our Mission",
        items: [
            "To develop 100% indigenous aviation platforms with zero dependency on foreign core technologies",
            "To deliver safe, scalable, and commercially viable aerial systems",
            "To integrate advanced avionics, propulsion, AI-enabled sensing, and data intelligence into aviation",
            "To support national priorities including sustainability, surveillance, environmental protection, and smart infrastructure"
        ]
    },
    values: [
        {
            id: "make-in-india",
            title: "Make in India",
            description: "Complete in-house development ensuring full control over design, IP, manufacturing processes, and system integration.",
            icon: "Flag"
        },
        {
            id: "innovation",
            title: "Innovation",
            description: "Pioneering indigenous aviation platforms with advanced avionics, propulsion, and AI-enabled systems.",
            icon: "Lightbulb"
        },
        {
            id: "safety",
            title: "Safety & Compliance",
            description: "Adhering to DGCA regulations, civil aviation safety norms, and international aerospace standards.",
            icon: "Shield"
        }
    ],
    corePhilosophy: [
        {
            id: "philosophy-1",
            title: "Make in India – From Scratch",
            description: "Every component designed and developed indigenously"
        },
        {
            id: "philosophy-2",
            title: "Design First, Manufacture Next",
            description: "Thorough engineering before production"
        },
        {
            id: "philosophy-3",
            title: "IP Ownership Over Assembly",
            description: "Owning intellectual property rather than assembling imported parts"
        },
        {
            id: "philosophy-4",
            title: "Safety, Compliance & Scalability",
            description: "Building for certification and growth"
        },
        {
            id: "philosophy-5",
            title: "Long-term Aviation Ecosystem Building",
            description: "Creating sustainable aviation infrastructure"
        }
    ],
    stats: [
        { id: "stat-1", label: "Indigenous Design", value: "100", suffix: "%" },
        { id: "stat-2", label: "Key Domains", value: "4", suffix: "+" },
        { id: "stat-3", label: "Technology Areas", value: "6", suffix: "+" },
        { id: "stat-4", label: "Compliance Standards", value: "5", suffix: "+" }
    ]
};

// Homepage specific data
export const homepageData = {
    hero: {
        title: "PushpakO2",
        subtitle: "Redefining the Future of Indian Aviation & Aerospace Systems",
        description: "Indigenous aviation platforms and intelligent aerial systems designed, engineered, and manufactured in India.",
        ctaText: "Explore Our Solutions",
        ctaLink: "/services"
    },
    about: {
        title: "About PushpakO2",
        subtitle: "Indian Aerospace & Advanced Engineering",
        description: "PushpakO2 is an Indian aerospace and advanced engineering company focused on the design, development, and deployment of indigenous aviation platforms and intelligent aerial systems.",
        highlights: [
            {
                icon: "Flag",
                label: "100% Indigenous",
                description: "Complete in-house development"
            },
            {
                icon: "Plane",
                label: "Aviation Platforms",
                description: "Fixed-wing and hybrid aircraft"
            },
            {
                icon: "Drone",
                label: "UAS Systems",
                description: "Surveillance & monitoring drones"
            },
            {
                icon: "Shield",
                label: "Compliance Ready",
                description: "DGCA & safety standards aligned"
            }
        ]
    }
};

// Team page specific data
export const teamPageData = {
    title: "Our Leadership",
    subtitle: "A balanced founding team combining technology leadership with strategic vision to drive India's aviation innovation.",
    leadershipApproach: foundingLeadershipApproach,
    members: leadershipTeam
};

export default {
    companyProfile,
    leadershipTeam,
    foundingLeadershipApproach,
    aboutUsPageData,
    homepageData,
    teamPageData
};
