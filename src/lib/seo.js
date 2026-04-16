/**
 * SEO Utility Functions for Pushpak O2 Platform
 * Centralized meta tags and structured data generation
 */

/**
 * Generate default meta tags for pages
 */
export function generateDefaultMetadata({
    title,
    description,
    path = '',
    image,
    type = 'website',
    noIndex = false,
}) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';
    const fullUrl = `${baseUrl}${path}`;
    const defaultImage = `${baseUrl}/og-image.png`;
    const finalImage = image || defaultImage;

    return {
        title: `${title} | Pushpak O2`,
        description: description || 'Pushpak O2 - Premier hackathon platform for developers, innovators, and tech enthusiasts. Discover, participate, and win!',
        keywords: 'hackathon, coding competition, tech events, developer platform, innovation, programming contests',
        authors: [{ name: 'Pushpak O2 Team' }],
        creator: 'Pushpak O2',
        publisher: 'Pushpak O2',

        openGraph: {
            type: type,
            locale: 'en_US',
            url: fullUrl,
            title: title,
            description: description,
            siteName: 'Pushpak O2',
            images: [
                {
                    url: finalImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [finalImage],
            creator: '@pushpako2',
            site: '@pushpako2',
        },

        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        alternates: {
            canonical: fullUrl,
        },
    };
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Pushpak O2",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Premier hackathon platform connecting developers, innovators, and organizations",
        "sameAs": [
            "https://twitter.com/pushpako2",
            "https://linkedin.com/company/pushpako2",
            "https://github.com/pushpako2"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "support@pushpako2.com"
        }
    };
}

/**
 * Generate WebSite JSON-LD with Search Action
 */
export function generateWebsiteSchema() {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Pushpak O2",
        "url": baseUrl,
        "description": "Premier hackathon platform for developers and innovators",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/hackathons?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${baseUrl}${item.path}`
        }))
    };
}

/**
 * Generate Event JSON-LD for Hackathons
 */
export function generateEventSchema(hackathon) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": hackathon.title,
        "description": hackathon.description || hackathon.overview,
        "image": hackathon.bannerImage || `${baseUrl}/og-image.png`,
        "url": `${baseUrl}/hackathons/${hackathon.slug}`,
        "startDate": hackathon.timeline?.startDate,
        "endDate": hackathon.timeline?.endDate,
        "eventStatus": getEventStatus(hackathon.status),
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
        }
    };
}

/**
 * Helper function to get event status schema
 */
function getEventStatus(status) {
    switch (status) {
        case 'LIVE':
            return "https://schema.org/EventScheduled";
        case 'ENDED':
            return "https://schema.org/EventCancelled";
        case 'UPCOMING':
            return "https://schema.org/EventPostponed";
        default:
            return "https://schema.org/EventScheduled";
    }
}

/**
 * Generate ItemList JSON-LD for hackathon listings
 */
export function generateHackathonListSchema(hackathons) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": hackathons.map((hackathon, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${baseUrl}/hackathons/${hackathon.slug}`,
            "name": hackathon.title,
            "description": hackathon.overview || hackathon.description
        }))
    };
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

/**
 * Generate Article JSON-LD for blog posts
 */
export function generateArticleSchema(article) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pushpako2.com';

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.coverImage || `${baseUrl}/og-image.png`,
        "author": {
            "@type": "Person",
            "name": article.author || "Pushpak O2 Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Pushpak O2",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        },
        "datePublished": article.publishedAt,
        "dateModified": article.updatedAt || article.publishedAt
    };
}
