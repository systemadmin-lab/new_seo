import Image from "next/image";
import {
  MapPin,
  Music2,
  Star,
} from "lucide-react";
import MeetTutorButton from "./MeetTutorButton";
import { getStartingPrice } from "../config/pricing";
import { siteConfig } from "../config/site";

type HeroIntroContent = {
  badgeText: string;
  titleLocation: string;
  subtitle: string;
};

const heroImage = {
  src: "/images/hero/wapping-piano-hero.jpg",
  alt: "Young piano student smiling during a lesson",
  className: "object-cover object-[58%_54%]",
};

const publicAssetPrefix =
  process.env.NEXT_PUBLIC_PROXY_PREFIX?.replace(/\/$/, "") ?? "";

const defaultContent: HeroIntroContent = {
  badgeText: "Piano tutors in Tower Hamlets, E1W",
  titleLocation: "Wapping",
  subtitle:
    "Meet recommended piano tutors in Wapping, Tower Hamlets (E1W), helping beginners and advanced learners alike.",
};

function getHeroBenefits() {
  return [
    "1-to-1 lessons - home or online",
    "Free instrument for the first month",
    `From ${getStartingPrice("online")} online / ${getStartingPrice("inPerson")} in person`,
    "DBS-checked, professional tutors",
  ];
}

function getRatingStarFillWidths() {
  const rating = Number(siteConfig.aggregateRating.ratingValue);
  const maxStars = Number(siteConfig.aggregateRating.bestRating);
  const boundedRating = Number.isFinite(rating)
    ? Math.min(maxStars, Math.max(0, rating))
    : 0;

  return Array.from({ length: maxStars }, (_, index) => {
    const fillRatio = Math.min(1, Math.max(0, boundedRating - index));

    return `${Math.round(fillRatio * 100)}%`;
  });
}

function GoogleRatingStars() {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[#ff8900]"
      aria-label={`${siteConfig.aggregateRating.ratingValue} out of 5 star rating`}
    >
      {getRatingStarFillWidths().map((fillWidth, index) => (
        <span
          key={index}
          className="relative inline-flex h-4 w-4 text-[#d8c7ae] sm:h-4 sm:w-4"
        >
          <Star className="h-full w-full fill-current" aria-hidden="true" />
          <span
            className="absolute inset-0 overflow-hidden text-[#ff8900]"
            style={{ width: fillWidth }}
          >
            <Star className="h-4 w-4 fill-current sm:h-4 sm:w-4" aria-hidden="true" />
          </span>
        </span>
      ))}
    </span>
  );
}

export default function HeroIntro({
  content = defaultContent,
}: {
  content?: HeroIntroContent;
}) {
  const heroBenefits = getHeroBenefits();

  return (
    <section
      id="find-tutor"
      aria-labelledby="hero-title"
      aria-describedby="hero-description"
      className="relative z-10 scroll-mt-16 overflow-hidden bg-[#fbf8f6] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14"
    >
      <div className="mx-auto grid min-h-[min(760px,calc(100svh-4rem))] max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative z-10 order-2 flex max-w-2xl flex-col items-start text-left lg:order-1">
          <header>
            <p className="inline-flex items-center gap-2 rounded-md border border-[#bceffa] bg-[#ecfbff]/85 px-3 py-2 text-sm font-bold text-[#07546f] shadow-sm backdrop-blur">
              <MapPin className="h-4 w-4 text-[#006184]" aria-hidden="true" />
              {content.badgeText}
            </p>

            <h1
              id="hero-title"
              className="type-display mt-8 max-w-[720px] font-bold text-[#2a2c2f] sm:mt-10"
            >
              Piano Lessons near{" "}
              <span className="text-[#0e92ba]">{content.titleLocation}</span>
            </h1>

            <p id="hero-description" className="mt-5 max-w-[60ch] text-base leading-relaxed text-[#4d4d4f] sm:text-lg">
              {content.subtitle}
            </p>
          </header>

          <ul aria-label="Piano lesson benefits" className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            {heroBenefits.map((benefit) => (
              <li
                key={benefit}
                className="grid grid-cols-[2rem_1fr] items-start gap-2 text-xl font-semibold leading-8 text-[#2a2c2f] sm:grid-cols-[2.25rem_1fr] sm:text-2xl"
              >
                <Music2
                  className="mt-1 h-6 w-6 text-[#0e92ba] sm:h-7 sm:w-7"
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex w-full max-w-xl flex-col items-center justify-start gap-3 sm:mt-10 sm:items-start">
            <MeetTutorButton label="Meet Your Recommended Tutor" />
            <a
              href={siteConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See MuseCool reviews on Google"
              className="mt-4 inline-flex h-14 items-center justify-start gap-3 rounded-full border border-white bg-white px-4 py-2 text-base font-black text-[#2a2c2f] shadow-[0_18px_45px_rgba(25,25,27,0.12)] transition hover:border-[#F47800] hover:shadow-[0_20px_48px_rgba(244,120,0,0.16)] sm:mt-6 sm:px-5"
            >
              <Image
                src={`${publicAssetPrefix}/images/hero/google-icon-logo-svgrepo-com.svg`}
                alt=""
                width={40}
                height={40}
                aria-hidden="true"
                className="h-10 w-10 object-contain"
              />
              <span className="flex flex-col gap-1 leading-none">
                <span className="inline-flex items-center gap-2">
                  <span className="text-xl font-black leading-none text-[#ff8900]">
                    {siteConfig.aggregateRating.ratingValue}
                  </span>
                  <GoogleRatingStars />
                </span>
                <span className="text-sm font-extrabold leading-none text-[#2a2c2f]">
                  {siteConfig.aggregateRating.reviewCount} reviews
                </span>
              </span>
            </a>
          </div>

        </div>

        <figure className="relative order-1 min-h-[330px] w-full sm:min-h-[430px] lg:order-2 lg:min-h-[640px]">
          <div className="absolute inset-y-0 left-0 right-0 overflow-hidden rounded-[2rem] border border-white/70 bg-[#f2eee9] shadow-[0_32px_90px_rgba(25,25,27,0.18)] sm:rounded-[2.75rem] lg:left-5">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              preload
              sizes="(min-width: 1344px) 596px, (min-width: 1024px) calc((100vw - 112px) / 2 - 20px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              className={heroImage.className}
            />
          </div>

          <div className="absolute left-8 top-4 w-[21.6%] max-w-[5.2rem] overflow-hidden rounded-md border border-white/70 bg-white shadow-[0_18px_45px_rgba(25,25,27,0.14)] lg:bottom-5 lg:left-10 lg:top-auto lg:w-[8.65rem] lg:max-w-none xl:w-[10.45rem]">
            <Image
              src="/images/hero/kidsafe-badge.jpeg"
              alt="Kidsafe certification"
              width={1600}
              height={704}
              sizes="(min-width: 1280px) 168px, (min-width: 1024px) 139px, 84px"
              className="h-auto w-full"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
