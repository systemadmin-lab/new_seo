import type { Metadata } from "next";
import { getOverallStartingPrice, getStartingPrice } from "./pricing";
import { absoluteSiteUrl, siteConfig } from "./site";

const title = `Piano Lessons in Wapping, E1W from ${getOverallStartingPrice()}`;
const description =
  "Find piano tutors in Wapping, Tower Hamlets (E1W). DBS-checked tutors, lessons at home or online, and a free instrument for your first month.";
const canonicalUrl = absoluteSiteUrl("/");
const imageUrl = absoluteSiteUrl("/images/hero/wapping-piano-hero.jpg");
const organizationId = "https://musecool.com/uk/#organization";

export const homeMetadata: Metadata = {
  title: { absolute: `${title} | ${siteConfig.name}` },
  description,
  alternates: { canonical: canonicalUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    title: `${title} | ${siteConfig.name}`,
    description,
    url: canonicalUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{
      url: imageUrl,
      width: 3466,
      height: 5192,
      alt: "Young piano student smiling during a lesson",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    images: [{ url: imageUrl, alt: "Young piano student smiling during a lesson" }],
  },
};

// Describe the visible service and provider; do not mark up self-serving ratings.
export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: "https://musecool.com/uk/",
      logo: absoluteSiteUrl("/images/brand/musecool-logo.webp"),
      telephone: siteConfig.telephone,
      email: siteConfig.email,
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: `${title} | ${siteConfig.name}`,
      description,
      inLanguage: "en-GB",
      primaryImageOfPage: { "@type": "ImageObject", url: imageUrl },
      publisher: { "@id": organizationId },
      mainEntity: { "@id": `${canonicalUrl}#piano-lessons` },
    },
    {
      "@type": "Service",
      "@id": `${canonicalUrl}#piano-lessons`,
      name: "Piano lessons in Wapping, E1W",
      serviceType: "One-to-one piano lessons at home or online",
      description,
      url: canonicalUrl,
      image: imageUrl,
      provider: { "@id": organizationId },
      areaServed: { "@type": "Place", name: "Wapping, Tower Hamlets, London E1W" },
      offers: [
        {
          "@type": "Offer",
          name: "Online piano lessons",
          url: canonicalUrl,
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: getStartingPrice("online", "schema"),
            priceCurrency: "GBP",
          },
        },
        {
          "@type": "Offer",
          name: "At-home piano lessons",
          url: canonicalUrl,
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: getStartingPrice("inPerson", "schema"),
            priceCurrency: "GBP",
          },
        },
      ],
    },
  ],
};
