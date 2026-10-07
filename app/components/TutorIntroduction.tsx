import MeetTutorButton from "./MeetTutorButton";

export default function TutorIntroduction() {
  return (
    <section
      id="our-tutors"
      aria-labelledby="our-tutors-title"
      className="scroll-mt-16 bg-[#fbf8f6] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="our-tutors-title"
          className="text-balance text-center text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
        >
          Learn with Our Network of 2,000 Tutors
        </h2>

        <div className="mx-auto mt-8 max-w-[70ch] space-y-6 text-base leading-7 text-[#4d4d4f] sm:mt-10 sm:text-lg sm:leading-8">
          <p>
            MuseCool’s network of 2,000 tutors helps learners find music tuition
            that suits their interests, experience and goals. If you’re looking
            for a piano teacher in St Katharine’s and Wapping, we can help you
            explore one-to-one lessons for children aged four and above,
            teenagers and adults, from first-time beginners to more advanced
            pianists.
          </p>

          <p>
            Our wider tutor network includes musicians trained at the{" "}
            <a
              href="https://www.ram.ac.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#07546f] hover:text-[#06445b]"
            >
              Royal Academy of Music
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            and the{" "}
            <a
              href="https://www.rcm.ac.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#07546f] hover:text-[#06445b]"
            >
              Royal College of Music
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            . Share your learning goals and any teacher qualification preferences
            when you enquire, so we can help you find a suitable match.
          </p>

          <p>
            Your lessons can be shaped around the music you want to play, whether
            that means learning classical pieces, building a pop and rock
            repertoire or returning to the piano after a break. Beginners can
            work on reading music, rhythm and coordination, while developing
            players can focus on technique, interpretation and a more confident
            performance.
          </p>

          <p>
            Working towards ABRSM piano exams? We can help you look for a tutor
            suited to your grade and preferred exam route. Tell us whether you’re
            preparing for Practical Grades or Performance Grades, and share any
            music theory or audition goals when you enquire.
          </p>

          <p>
            Choose between online tuition and in-person piano lessons, with home
            visits or studio lessons depending on your tutor’s location and
            availability. Share your preferred times, lesson format and access to
            a piano when you enquire. This helps us recommend a teacher whose
            approach and schedule work for you, with room to build skills and
            enjoy making music at your own pace.
          </p>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
          <MeetTutorButton />
        </div>
      </div>
    </section>
  );
}
