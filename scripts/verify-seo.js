// SEO Verification and Testing Script
// Run this to verify all SEO elements are properly configured

console.log("=".repeat(60));
console.log("PushpakO2 SEO Configuration Verification");
console.log("=".repeat(60));
console.log("");

// Import SEO Config
import { SEO_CONFIG } from '../src/lib/seo-config.js';

// 1. Check Keywords Count
console.log("✓ KEYWORD ANALYSIS");
console.log("-".repeat(60));
console.log(`Total Keywords: ${SEO_CONFIG.keywords.length}`);
console.log("");

// 2. Check for critical typo variations
const criticalTypos = [
    "pushpk o2",
    "push pak o2",
    "pushpako2",
    "pushpak o2",
    "puspako2",
    "pushpak02"
];

console.log("✓ CRITICAL TYPO COVERAGE");
console.log("-".repeat(60));
criticalTypos.forEach(typo => {
    const found = SEO_CONFIG.keywords.includes(typo);
    const status = found ? "✅ FOUND" : "❌ MISSING";
    console.log(`${status}: "${typo}"`);
});
console.log("");

// 3. Check Location Keywords
const locationKeywords = [
    "bhopal",
    "madhya pradesh",
    "near me"
];

console.log("✓ LOCATION KEYWORD COVERAGE");
console.log("-".repeat(60));
locationKeywords.forEach(location => {
    const count = SEO_CONFIG.keywords.filter(k =>
        k.toLowerCase().includes(location.toLowerCase())
    ).length;
    console.log(`"${location}": ${count} variations found`);
});
console.log("");

// 4. Check Brand Variations in Description
console.log("✓ META DESCRIPTION ANALYSIS");
console.log("-".repeat(60));
const brandVariations = ["PushpakO2", "Pushpak O2"];
brandVariations.forEach(brand => {
    const found = SEO_CONFIG.description.includes(brand);
    const status = found ? "✅ INCLUDED" : "❌ NOT INCLUDED";
    console.log(`${status}: "${brand}" in description`);
});
console.log("");

// 5. Display keyword categories
console.log("✓ KEYWORD CATEGORIES");
console.log("-".repeat(60));

const categories = {
    "Brand Variations": SEO_CONFIG.keywords.filter(k =>
        k.toLowerCase().includes('pushpak') || k.toLowerCase().includes('puspak')
    ).length,
    "Location-Based": SEO_CONFIG.keywords.filter(k =>
        k.toLowerCase().includes('bhopal') ||
        k.toLowerCase().includes('india') ||
        k.toLowerCase().includes('near me')
    ).length,
    "Industry Terms": SEO_CONFIG.keywords.filter(k =>
        k.toLowerCase().includes('aerospace') ||
        k.toLowerCase().includes('aviation') ||
        k.toLowerCase().includes('drone') ||
        k.toLowerCase().includes('uav') ||
        k.toLowerCase().includes('uas')
    ).length,
    "Commercial Intent": SEO_CONFIG.keywords.filter(k =>
        k.toLowerCase().includes('buy') ||
        k.toLowerCase().includes('service') ||
        k.toLowerCase().includes('price') ||
        k.toLowerCase().includes('manufacturer')
    ).length
};

Object.entries(categories).forEach(([category, count]) => {
    console.log(`${category}: ${count} keywords`);
});
console.log("");

// 6. SEO Config Completeness
console.log("✓ SEO CONFIGURATION COMPLETENESS");
console.log("-".repeat(60));

const configChecks = {
    "Site Name": !!SEO_CONFIG.siteName,
    "Site URL": !!SEO_CONFIG.siteUrl,
    "Description": !!SEO_CONFIG.description,
    "Keywords": SEO_CONFIG.keywords.length > 0,
    "Authors": SEO_CONFIG.authors && SEO_CONFIG.authors.length > 0,
    "Social Links": !!SEO_CONFIG.social,
    "Location Data": !!SEO_CONFIG.location
};

Object.entries(configChecks).forEach(([check, passed]) => {
    const status = passed ? "✅ CONFIGURED" : "❌ MISSING";
    console.log(`${status}: ${check}`);
});
console.log("");

// 7. Recommendations
console.log("✓ RECOMMENDATIONS");
console.log("-".repeat(60));
console.log("1. Submit sitemap to Google Search Console");
console.log("   URL: https://pushpako2.com/sitemap.xml");
console.log("");
console.log("2. Verify robots.txt is accessible");
console.log("   URL: https://pushpako2.com/robots.txt");
console.log("");
console.log("3. Create Google Business Profile");
console.log("   Go to: https://business.google.com");
console.log("");
console.log("4. Generate and submit backlinks");
console.log("   - List on startup directories");
console.log("   - Get featured in aerospace blogs");
console.log("   - Partner with other companies");
console.log("");
console.log("5. Monitor with Google Search Console");
console.log("   Track keyword performance weekly");
console.log("");

// 8. Sample Search Queries to Test
console.log("✓ MANUAL TESTING QUERIES");
console.log("-".repeat(60));
const testQueries = [
    "pushpako2",
    "pushpk o2",
    "pushpak o2 bhopal",
    "aerospace company bhopal",
    "drone manufacturer india",
    "indigenous aviation india"
];

console.log("Test these searches on Google in 1-2 weeks:");
testQueries.forEach((query, i) => {
    console.log(`${i + 1}. "${query}"`);
});
console.log("");

console.log("=".repeat(60));
console.log("SEO Verification Complete");
console.log("Total Keywords Configured: " + SEO_CONFIG.keywords.length);
console.log("=".repeat(60));
