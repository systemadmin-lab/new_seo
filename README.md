This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font/local` to serve MuseCool's Inter body font and Oswald heading/button font. The matching WOFF2 files are from MuseCool's public UK site; their SIL Open Font Licenses are included in `app/fonts`.

## SEO configuration

Set `NEXT_PUBLIC_SITE_URL` to the final public URL of this app before building (see `.env.example`). Include any deployment subpath, such as `/page/uk`. Canonical links, Open Graph metadata, JSON-LD, and the sitemap all use this value. The current default is `https://musecool.com/page/uk/`.

Page-specific metadata and visible-service structured data live in `app/config/seo.ts`. The current sitemap lists only the implemented homepage; add real routes when creating more pages. For a deployment under a subpath, the main domain's root `robots.txt` must reference this app's sitemap, because crawlers read robots rules from the domain root. Submit that sitemap to Search Console after deployment.

Font sources: [Inter](https://musecool.com/uk/wp-content/uploads/al_opt_content/FONT/6639126daa31fa81af9919ce7e120f74.woff2), [Oswald](https://musecool.com/uk/wp-content/uploads/al_opt_content/FONT/cd20cc40854c820d01a18308431d5d8f.woff2). The icon assets are MuseCool's published UK site icons. SEO implementation follows [Google's developer guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers).

## Suggested tutor profiles

The two lesson sections fetch names and photo URLs on the server from
`https://api.musecool.com/tutor/seo-list`, the same public feed used by the original
MuseCool teacher carousel. Responses revalidate hourly; the selected IDs live in
`app/lib/suggestedTutors.ts` so reordering the feed does not switch the profiles.
The descriptive copy is authored in `PianoLessonFormats.tsx` and does not import
biographical or qualification claims from the API.

Requests time out after eight seconds. Missing or invalid selected records and
API failures use verified name/photo snapshots. If a remote portrait fails to
load, `TutorPortrait` switches to the saved photo for that same tutor. Source URLs
are recorded in `public/images/tutors/SOURCES.txt`. Refresh these snapshots when
changing the selected tutors. The feed contains no location or availability
data, so the copy directs enquiries to the team to confirm these details.

Run the loader and fallback checks with `node --test tests/suggestedTutors.test.mjs`.

The in-person and online sections include the corresponding 30-, 45- and
60-minute rates from `app/config/pricing.ts`, with the 10-lesson bundle condition
and a link to MuseCool's payment terms. Prices and lesson arrangements were
checked against MuseCool's live UK prices, at-home and online lesson pages on
6 October 2026. Personal progress plans are described as part of MuseCool's
service; individual tutor qualifications, travel areas and availability remain
subject to confirmation rather than being invented from the name/photo feed.

## Piano lesson FAQs and tutor discovery

`app/components/PianoLessonFaqs.tsx` adds eight FAQs below the tutor sections.
Native `details`/`summary` elements support keyboard use and work without
JavaScript; every answer is included in the server-rendered HTML. Prices use
the shared pricing configuration and disclose the 10-lesson bundle condition.
Service terms were checked against the live [MuseCool UK FAQ](https://musecool.com/uk/faq/)
on 6 October 2026. Recheck instrument and cancellation terms when updating copy.

The FAQ follows the supplied SEO brief's focus on practical booking questions,
postcode coverage, instrument access and matching. It does not add FAQ rich-result
markup: [Google retired that search feature in May 2026](https://developers.google.com/search/updates#may-2026).

Both selected tutor names appear in search-accessible content on an existing
[MuseCool page](https://musecool.com/page/us/savannah/tybee-island), checked on
6 October 2026. Here, their names, descriptions and image alt text are
server-rendered. This app does not yet have individual tutor profile URLs, and
the API supplies no verified qualifications, instruments, service areas or
availability. A name appearing in search results does not verify those details.
Substantive profiles require that additional tutor data; do not infer it from
unrelated people with the same name. Localhost is not publicly indexable;
after deployment, verify the final canonical URL and indexing in Search Console.

## Static footer

The footer is adapted from `/Users/macbook/muse_seo/app/components/Footer.tsx`
and sits after the main content. It keeps the source logo, social links, app
download links and legal links. Music-note decorations, hover movement and
transitions are removed. Footer typography is scoped in `app/globals.css`.
`app/config/storeLinks.ts` holds the two app destinations. The App Store and
Google Play buttons sit below “Available on iOS and Android” and link directly
to their respective listings, without device detection or client-side code.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
