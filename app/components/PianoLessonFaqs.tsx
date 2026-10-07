import { ChevronDown } from "lucide-react";
import { getStartingPrice } from "../config/pricing";

// Service terms checked against https://musecool.com/uk/faq/ on 6 October 2026.
// Keep prices shared with the hero and distinguish enquiries from confirmed availability.
const questions = [
  {
    id: "lesson-prices",
    question: "How much do piano lessons cost?",
    answer: `A 30-minute lesson starts at ${getStartingPrice("online")} online or ${getStartingPrice("inPerson")} at home when you book a 10-lesson bundle. Lessons also come in 45- and 60-minute sessions. Pay-as-you-go prices may differ; confirm your package before booking.`,
  },
  {
    id: "beginners",
    question: "Can children and adult beginners learn with MuseCool?",
    answer:
      "Yes. Lessons can be tailored to children, teenagers and adults, including complete beginners. Share the student’s age and experience so we can recommend a suitable tutor and lesson length.",
  },
  {
    id: "home-lessons",
    question: "Can a piano teacher come to my home in Wapping?",
    answer:
      "You can request home lessons in Wapping and St Katharine’s. Send your E1W postcode and preferred times so our team can check which tutors cover your address. Home visits and studio options depend on the individual teacher’s location and availability.",
  },
  {
    id: "choosing-a-tutor",
    question: "Can I request one of the suggested tutors?",
    answer:
      "Yes. Mention the tutor’s name when you enquire, along with your level, goals and preferred lesson format. We’ll check their availability and suitability before arranging lessons. If the match does not work for you, contact our team to discuss alternatives.",
  },
  {
    id: "piano-or-keyboard",
    question: "Do I need to buy a piano before starting?",
    answer:
      "You need access to a piano or keyboard for home or online lessons. MuseCool offers selected instruments free for the first month, on request. You can return the instrument during that month or pay its value in three interest-free monthly instalments if you keep it. Ask about availability before your first lesson.",
  },
  {
    id: "online-setup",
    question: "What do I need for online piano lessons?",
    answer:
      "Have your piano or keyboard, a reliable internet connection and a phone, tablet or computer with a camera and microphone ready. Your tutor should be able to see your hands and keyboard. Test the setup before the lesson.",
  },
  {
    id: "piano-exams",
    question: "Can lessons help with ABRSM piano exams?",
    answer:
      "Yes. Tell us your grade, exam date and whether you are taking Practical Grades or Performance Grades. We can look for a tutor suited to your syllabus and preparation needs. You can also learn for enjoyment without taking exams.",
  },
  {
    id: "cancellations",
    question: "What happens if I need to cancel a lesson?",
    answer:
      "MuseCool has a 24-hour cancellation policy: cancellations within 24 hours of the lesson are charged in full. If your teacher needs to cancel, the team can help arrange a replacement or reschedule.",
  },
] as const;

export default function PianoLessonFaqs() {
  return (
    <section
      id="piano-lesson-faqs"
      aria-labelledby="piano-lesson-faqs-title"
      className="scroll-mt-16 bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="piano-lesson-faqs-title"
          className="text-balance text-center text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
        >
          Your Piano Lesson Questions, Answered
        </h2>
        <p className="mx-auto mt-5 max-w-[65ch] text-center text-base leading-7 text-[#4d4d4f] sm:text-lg sm:leading-8">
          From choosing a tutor to getting ready for your first lesson in Wapping
          or online.
        </p>

        <div className="mt-8 border-t border-[#d8d2cb] sm:mt-10">
          {questions.map(({ id, question, answer }) => (
            <details
              key={id}
              id={`faq-${id}`}
              className="group scroll-mt-20 border-b border-[#d8d2cb]"
            >
              <summary className="cursor-pointer list-none rounded-sm py-5 text-[#2a2c2f] hover:text-[#07546f] sm:py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="flex items-center justify-between gap-5 text-xl leading-snug sm:text-2xl">
                  <span>{question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    focusable="false"
                    className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </h3>
              </summary>
              <p className="max-w-[70ch] pb-6 text-base leading-7 text-[#4d4d4f] sm:text-lg sm:leading-8">
                {answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-base leading-7 text-[#4d4d4f]">
          Still have a question? Read the{" "}
          <a
            href="https://musecool.com/uk/faq/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#07546f] hover:text-[#06445b]"
          >
            full MuseCool FAQs
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </section>
  );
}
