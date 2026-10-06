import FeaturedOn from "./components/FeaturedOn";
import Footer from "./components/Footer";
import HeroIntro from "./components/HeroIntro";
import LessonLocation from "./components/LessonLocation";
import Navbar from "./components/Navbar";
import PianoLessonFaqs from "./components/PianoLessonFaqs";
import PianoLessonFormats from "./components/PianoLessonFormats";
import StudentReviews from "./components/StudentReviews";
import TutorIntroduction from "./components/TutorIntroduction";
import { homeMetadata, homeStructuredData } from "./config/seo";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="relative isolate min-h-screen overflow-hidden bg-[#fbf8f6] pt-16 text-[#2a2c2f]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <HeroIntro />
        <FeaturedOn />
        <LessonLocation />
        <TutorIntroduction />
        <PianoLessonFormats />
        <StudentReviews />
        <PianoLessonFaqs />
      </main>
      <Footer />
    </>
  );
}
