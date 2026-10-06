import { getFormattedPrice, lessonPricing } from "../config/pricing";
import { getSuggestedTutors } from "../lib/suggestedTutors";
import MeetTutorButton from "./MeetTutorButton";
import TutorPortrait from "./TutorPortrait";

function LessonRates({ format }: { format: "inPerson" | "online" }) {
  const rates = lessonPricing[format].rows
    .map(({ duration, price }) =>
      `${getFormattedPrice(price)} for ${duration.replace("min", " minutes")}`,
    )
    .join(", ");

  return (
    <p>
      <strong className="font-semibold text-[#2a2c2f]">
        {format === "inPerson" ? "At-home lesson prices: " : "Online lesson prices: "}
      </strong>
      {rates}. These are per-lesson rates with a 10-lesson bundle; pay-as-you-go
      prices may differ.{" "}
      <a
        href="https://musecool.com/uk/prices/"
        className="font-semibold text-[#07546f] hover:text-[#06445b]"
      >
        View pricing and payment terms
      </a>
      .
    </p>
  );
}

export default async function PianoLessonFormats() {
  const [inPersonTutor, onlineTutor] = await getSuggestedTutors();

  return (
    <>
      <section
        id="piano-tutors"
        aria-labelledby="piano-tutors-title"
        className="lesson-format-section scroll-mt-16 bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <figure className="mx-auto w-full max-w-[480px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f2eee9]">
              <TutorPortrait tutor={inPersonTutor} />
            </div>
            <figcaption className="mt-3 text-center text-sm leading-6 text-[#4d4d4f]">
              {inPersonTutor.name} · MuseCool tutor
            </figcaption>
          </figure>

          <div className="min-w-0">
            <h2
              id="piano-tutors-title"
              className="text-balance text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
            >
              Meet {inPersonTutor.name}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-7 text-[#4d4d4f] sm:text-lg sm:leading-8">
              <p>
                {inPersonTutor.name} is one of our suggested tutors for your
                piano lesson enquiry. MuseCool offers one-to-one teaching for
                children and adults, including complete beginners and returning
                players. Lessons follow your level, musical interests and goals,
                with a personal progress plan developed after your first session.
              </p>
              <p>
                For home piano lessons in St Katharine’s and Wapping, share your
                E1W postcode and preferred times. You can request weekly or less
                frequent sessions. We’ll confirm {inPersonTutor.name}’s travel
                area, available times and teaching background before arranging
                your lessons. Studio options need to be checked separately.
              </p>
              <LessonRates format="inPerson" />
              <p>
                Preparing for an ABRSM Practical Grade? Tell us your grade and
                target date so we can match the exam support you need, including
                pieces, scales and arpeggios, sight-reading and aural skills.
                You can also ask about MuseCool’s mock exams or learn purely
                for enjoyment.
              </p>
            </div>

            <div className="mt-8 flex justify-center sm:justify-start">
              <MeetTutorButton />
            </div>
          </div>
        </div>
      </section>

      <section
        id="online-piano-lessons"
        aria-labelledby="online-piano-lessons-title"
        className="lesson-format-section scroll-mt-16 bg-[#fbf8f6] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <h2
              id="online-piano-lessons-title"
              className="text-balance text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
            >
              Online Lessons with {onlineTutor.name}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-7 text-[#4d4d4f] sm:text-lg sm:leading-8">
              <p>
                Interested in online piano lessons with {onlineTutor.name}?
                MuseCool’s one-to-one video lessons welcome children and adult
                learners, from complete beginners to more experienced players.
                Your tutor develops a personal progress plan after the first
                session, based on the music you enjoy and the skills you want
                to build.
              </p>
              <p>
                Learn from Wapping or anywhere with a reliable internet
                connection. Have a piano or keyboard and a phone, tablet or
                computer with a camera and microphone ready. Position the camera
                to show your hands and keyboard. Share your preferred times so
                we can confirm {onlineTutor.name}’s availability and suitability.
              </p>
              <LessonRates format="online" />
              <p>
                Working towards ABRSM Performance Grades? Ask about support with
                programme preparation, musical interpretation and recording your
                performance. Share your grade and any music theory goals when
                enquiring so we can check the right teaching support. You are
                equally welcome to build confidence and enjoy playing without
                taking exams.
              </p>
            </div>

            <div className="mt-8 flex justify-center sm:justify-start">
              <MeetTutorButton label="Meet Your Online Tutor" />
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[480px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f2eee9]">
              <TutorPortrait tutor={onlineTutor} />
            </div>
            <figcaption className="mt-3 text-center text-sm leading-6 text-[#4d4d4f]">
              {onlineTutor.name} · MuseCool tutor
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
