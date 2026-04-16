import HackathonDetails from '@/components/Pages/Public/Hackathons/HackathonDetails';
import { getAuthUser } from '@/lib/getAuthUser';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/connectDB';
import Hackathon from '@/lib/models/Hackathon';
import Participation from '@/lib/models/Participation';
import HackathonUser from '@/lib/models/HackathonUser';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    // Fetch hackathon data directly for metadata
    let hackathon = null;
    try {
        await connectDB();
        hackathon = await Hackathon.findOne({ slug: slug }).lean();
    } catch (e) {
        console.error("Error fetching hackathon for metadata:", e);
    }

    if (!hackathon) {
        return {
            title: 'Hackathon Not Found | Pushpak O2',
        };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';
    const title = `${hackathon.title} - Hackathon | Pushpak O2`;
    const description = hackathon.overview || hackathon.description?.substring(0, 160) || 'Join this exciting hackathon and showcase your skills. Register now!';
    const imageUrl = hackathon.bannerImage || `${baseUrl}/og-image.png`;
    const url = `${baseUrl}/hackathons/${hackathon.slug}`;

    // Format dates for rich snippets
    const startDate = hackathon.timeline?.startDate ? new Date(hackathon.timeline.startDate).toISOString() : null;
    const endDate = hackathon.timeline?.endDate ? new Date(hackathon.timeline.endDate).toISOString() : null;
    const registrationDeadline = hackathon.timeline?.registrationDeadline ? new Date(hackathon.timeline.registrationDeadline).toISOString() : null;

    return {
        title: title,
        description: description,
        keywords: `hackathon, ${hackathon.title}, coding competition, tech event, innovation, ${hackathon.status}, programming contest, developer event`,
        authors: [{ name: 'Pushpak O2 Team' }],
        creator: 'Pushpak O2',
        publisher: 'Pushpak O2',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: url,
            title: title,
            description: description,
            siteName: 'Pushpak O2 - Hackathon Platform',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: hackathon.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
            creator: '@pushpako2',
            site: '@pushpako2',
        },
        robots: {
            index: hackathon.isPublished !== false,
            follow: true,
            googleBot: {
                index: hackathon.isPublished !== false,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: url,
        },
        other: {
            'event:status': hackathon.status,
            'event:start_time': startDate,
            'event:end_time': endDate,
            'event:registration_deadline': registrationDeadline,
        },
    };
}

export default async function HackathonPage({ params }) {
    const { slug } = await params;
    const user = await getAuthUser();

    // 1. Fetch Hackathon
    let hackathon = null;
    try {
        await connectDB();
        const doc = await Hackathon.findOne({ slug: slug })
            .populate('createdBy', 'name email')
            .lean();

        if (doc) {
            // Serializable
            hackathon = {
                ...doc,
                _id: doc._id.toString(),
                createdBy: doc.createdBy ? {
                    ...doc.createdBy,
                    _id: doc.createdBy._id.toString()
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
        }
    } catch (e) {
        console.error("Error fetching hackathon details:", e);
    }

    if (!hackathon) {
        return notFound();
    }

    // 2. Fetch Participation Status (if user is logged in)
    let participationStatus = { registered: false, status: null };
    if (user) {
        try {
            await connectDB();
            const hUser = await HackathonUser.findOne({ email: user.email }).lean();
            if (hUser) {
                const part = await Participation.findOne({
                    user: hUser._id,
                    hackathon: hackathon._id
                }).lean();
                if (part) {
                    participationStatus = {
                        registered: true,
                        status: part.status,
                        participationId: part._id.toString(),
                        participationCode: part.participationCode
                    };
                }
            }
        } catch (e) {
            console.error("Error fetching participation status:", e);
        }
    }

    // 3. Generate JSON-LD Structured Data for SEO
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": hackathon.title,
        "description": hackathon.description || hackathon.overview,
        "image": hackathon.bannerImage || `${baseUrl}/og-image.png`,
        "url": `${baseUrl}/hackathons/${hackathon.slug}`,
        "startDate": hackathon.timeline?.startDate,
        "endDate": hackathon.timeline?.endDate,
        "eventStatus": hackathon.status === 'LIVE' ? "https://schema.org/EventScheduled" :
            hackathon.status === 'ENDED' ? "https://schema.org/EventCancelled" :
                "https://schema.org/EventPostponed",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "location": {
            "@type": "VirtualLocation",
            "url": `${baseUrl}/hackathons/${hackathon.slug}`
        },
        "organizer": {
            "@type": "Organization",
            "name": "Pushpak O2",
            "url": baseUrl
        },
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/hackathons/${hackathon.slug}`,
            "price": "0",
            "priceCurrency": "INR",
            "availability": hackathon.status === 'LIVE' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "validFrom": hackathon.timeline?.startDate
        },
        "performer": {
            "@type": "Organization",
            "name": "Pushpak O2"
        }
    };

    if (hackathon.prizes?.totalPrizePool) {
        structuredData.offers.prizePool = {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": hackathon.prizes.totalPrizePool
        };
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <HackathonDetails
                hackathon={hackathon}
                user={user ? { ...user, id: user.id.toString() } : null} // Serializable user
                initialStatus={participationStatus}
            />
        </>
    );
}
