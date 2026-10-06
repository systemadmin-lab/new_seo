import MeetTutorButton from "./MeetTutorButton";

const lessonDetails = [
  "Teaches in person and online",
  "Lessons at the teacher’s studio or at students’ homes",
  "High-quality Yamaha B3 upright piano",
  "Specialises in classical piano",
  "Styles: Classical, Advanced Classical, Pop/Rock",
  "Accepts students aged 4 and above",
  "Other instruments and subjects: Suzuki",
  "Exam preparation: ABRSM, Trinity, Rockschool, RCM, Audition Preparation",
  "Languages: English",
] as const;

// The page's service area is used until a specific studio address is provided.
const mapLocation = "Wapping, London E1W";
// Wapping's area centre, from OpenStreetMap; this is not a studio address.
const mapQuery = encodeURIComponent("51.5071316,-0.0620152");
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&z=13&hl=en&output=embed`;
const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export default function LessonLocation() {
  return (
    <section
      id="lesson-location"
      aria-labelledby="lesson-location-title"
      className="scroll-mt-16 bg-white px-4 pb-14 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-20 lg:pt-8"
    >
      <h2
        id="lesson-location-title"
        className="mx-auto mb-8 max-w-7xl text-balance text-center text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:mb-10 sm:text-4xl lg:mb-12 lg:text-5xl"
      >
        Piano Lessons in Wapping
      </h2>

      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <figure className="min-w-0">
          <div className="relative aspect-[3/2] min-h-[280px] w-full overflow-hidden bg-[#f2f2f2]">
            <iframe
              title={`Map of ${mapLocation}`}
              src={mapEmbedUrl}
              width="800"
              height="533"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm leading-6 text-[#4d4d4f]">
            <span>{mapLocation}</span>
            <a
              href={mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#07546f] underline underline-offset-4 transition-colors hover:text-[#0e92ba]"
              aria-label={`Open ${mapLocation} in Google Maps (opens in a new tab)`}
            >
              Open in Google Maps
            </a>
          </figcaption>
        </figure>

        <ul className="min-w-0 list-disc space-y-4 pl-6 text-base leading-7 text-[#2a2c2f] marker:text-[#2a2c2f] sm:text-lg sm:leading-8 lg:space-y-5 lg:text-xl lg:leading-9 xl:text-2xl xl:leading-10">
          {lessonDetails.map((detail) => (
            <li key={detail} className="pl-1 sm:pl-2">
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
        <MeetTutorButton />
      </div>
    </section>
  );
}
