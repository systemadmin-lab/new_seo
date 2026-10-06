const defaultSiteUrl = "https://musecool.com/page/uk";

function normalizeSiteUrl(value: string) {
  const url = new URL(value.trim());

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL.");
  }

  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/+$/g, "");
}

const googleReviewsUrl =
  "https://www.google.com/maps/place/MuseCool+-+The+Music+School/@51.5272385,-0.0912481,736m/data=!3m2!1e3!5s0x4875cee4157f1139:0xd249cf37df391616!4m18!1m9!3m8!1s0x4876105effa33451:0xd8b10307ec790a28!2sMuseCool+-+The+Music+School!8m2!3d51.5272385!4d-0.0886732!9m1!1b1!16s%2Fg%2F11dx94hggr!3m7!1s0x4876105effa33451:0xd8b10307ec790a28!8m2!3d51.5272385!4d-0.0886732!9m1!1b1!16s%2Fg%2F11dx94hggr?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D";

export const siteConfig = {
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl),
  name: "MuseCool",
  telephone: "+442035820699",
  displayTelephone: "0203 582 0699",
  email: "info@musecool.com",
  locale: "en_GB",
  address: {
    streetAddress: "124 City Road",
    addressLocality: "London",
    addressRegion: "Greater London",
    postalCode: "EC1V 2NX",
    addressCountry: "GB",
  },
  geo: {
    latitude: 51.5267,
    longitude: -0.0886,
  },
  googleReviewsUrl,
  sameAs: [
    "https://musecool.com/uk/",
    "https://www.instagram.com/musecool",
    googleReviewsUrl,
  ],
  aggregateRating: {
    ratingValue: "4.5",
    reviewCount: "214",
    bestRating: "5",
  },
} as const;

export function absoluteSiteUrl(value: string) {
  return /^https?:\/\//.test(value)
    ? new URL(value).toString()
    : new URL(value.replace(/^\/+/, ""), `${siteConfig.url}/`).toString();
}
