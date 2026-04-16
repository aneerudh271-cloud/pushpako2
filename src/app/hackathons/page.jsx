import HackathonList from '@/components/Pages/Public/Hackathons/HackathonList';
import { connectDB } from '@/lib/db/connectDB';
import Hackathon from '@/lib/models/Hackathon';
import Investor from '@/lib/models/Investor'; // Ensure model is registered for populate

export async function generateMetadata() {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';
    const title = 'Explore Hackathons - Join, Compete & Win';
    const description = 'Discover upcoming and live hackathons on Pushpak O2. Join innovative competitions, build amazing projects, collaborate with talented developers, and win exciting prizes. Browse all hackathon events now!';

    return {
        title: title,
        description: description,
        keywords: 'hackathons, coding competitions, tech events, developer events, programming contests, innovation challenges, hackathon list, online hackathons',
        authors: [{ name: 'Pushpak O2 Team' }],

        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: `${baseUrl}/hackathons`,
            title: title,
            description: description,
            siteName: 'Pushpak O2',
            images: [
                {
                    url: `${baseUrl}/og-hackathons.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Pushpak O2 Hackathons',
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [`${baseUrl}/og-hackathons.png`],
            creator: '@pushpako2',
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        alternates: {
            canonical: `${baseUrl}/hackathons`,
        },
    };
}

export const dynamic = 'force-dynamic';

export default async function HackathonsPage() {
    await connectDB();

    // Fetch published hackathons directly
    let hackathons = [];
    try {
        const docs = await Hackathon.find({ isPublished: { $ne: false } })
            .populate('createdBy', 'name email')
            .sort({ updatedAt: -1 })
            .lean();

        // Serializable
        hackathons = docs.map(doc => {
            const hackathon = {
                ...doc,
                _id: doc._id.toString(),
                createdBy: doc.createdBy ? {
                    name: doc.createdBy.name || 'Admin',
                    email: doc.createdBy.email || '',
                    _id: doc.createdBy._id?.toString() || ''
                } : null,
                timeline: {
                    startDate: doc.timeline?.startDate?.toISOString(),
                    endDate: doc.timeline?.endDate?.toISOString(),
                    registrationDeadline: doc.timeline?.registrationDeadline?.toISOString(),
                    submissionDeadline: doc.timeline?.submissionDeadline?.toISOString()
                },
                judgingCriteria: doc.judgingCriteria?.map(item => ({
                    ...item,
                    _id: item._id ? item._id.toString() : undefined
                })),
                resourceLinks: doc.resourceLinks?.map(item => ({
                    ...item,
                    _id: item._id ? item._id.toString() : undefined
                })),
                prizes: doc.prizes ? {
                    ...doc.prizes,
                    additionalPrizes: doc.prizes.additionalPrizes?.map(item => ({
                        ...item,
                        _id: item._id ? item._id.toString() : undefined
                    }))
                } : {},
                structure: doc.structure?.map(round => ({
                    ...round,
                    _id: round._id?.toString(),
                    judgingCriteria: round.judgingCriteria?.map(c => ({
                        ...c,
                        _id: c._id?.toString()
                    }))
                })),
                createdAt: doc.createdAt?.toISOString(),
                updatedAt: doc.updatedAt?.toISOString()
            };
            return hackathon;
        });
    } catch (error) {
        console.error("Error fetching hackathons:", error);
    }

    // Generate ItemList structured data for SEO
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Hackathons on Pushpak O2",
        "description": "List of all available hackathons",
        "numberOfItems": hackathons.length,
        "itemListElement": hackathons.slice(0, 10).map((hackathon, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Event",
                "@id": `${baseUrl}/hackathons/${hackathon.slug}`,
                "name": hackathon.title,
                "description": hackathon.overview || hackathon.description,
                "url": `${baseUrl}/hackathons/${hackathon.slug}`,
                "image": hackathon.bannerImage,
                "startDate": hackathon.timeline?.startDate,
                "endDate": hackathon.timeline?.endDate,
                "eventStatus": hackathon.status === 'LIVE' ? "https://schema.org/EventScheduled" :
                    hackathon.status === 'ENDED' ? "https://schema.org/EventCancelled" :
                        "https://schema.org/EventPostponed",
                "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
                "organizer": {
                    "@type": "Organization",
                    "name": "Pushpak O2"
                }
            }
        }))
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <main>
                <HackathonList initialHackathons={hackathons} />
            </main>
        </>
    );
}
