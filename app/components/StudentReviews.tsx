import { Quote } from "lucide-react";

// Short excerpts and summaries; names are preserved as published by MuseCool.
// Source checked on 7 October 2026. These are school-wide testimonials.
const reviewSourceUrl =
  "https://musecool.com/page/uk/greater-london/hackney/piano-lessons-hoxton-east-and-shoreditch";

const reviews = [
  {
    id: "review-1",
    name: "Anne T",
    excerpt: "looks forward to every lesson",
    text: "Anne says her daughter enjoys attending lessons and has become a more confident pianist.",
  },
  {
    id: "review-2",
    name: "Kateryna S",
    excerpt: "excellent value",
    text: "Kateryna appreciates the value of individual lessons together with the school’s additional courses and events.",
  },
  {
    id: "review-3",
    name: "Jane F",
    excerpt: "warm, interactive",
    text: "Jane highlights engaging online teaching for children and lesson summaries that help families know what to practise next.",
  },
  {
    id: "review-4",
    name: "Jeremy C",
    excerpt: "Our son came away smiling",
    text: "Jeremy describes his son’s enjoyment of classes and the guidance that supports practice between lessons.",
  },
] as const;

export default function StudentReviews() {
  return (
    <section
      id="student-reviews"
      aria-labelledby="student-reviews-title"
      className="scroll-mt-16 bg-[#e8f8fb] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="student-reviews-title"
          className="text-balance text-center text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
        >
          What MuseCool Families Say
        </h2>
        <p className="mx-auto mt-5 max-w-[65ch] text-center text-base leading-7 text-[#4d4d4f]">
          Excerpts and summaries of testimonials published by MuseCool, from
          families across the school.
        </p>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex min-h-60 min-w-0 flex-col rounded-xl border border-[#bceffa] bg-white p-6 sm:p-7"
            >
              <Quote className="h-8 w-8 text-[#07546f]" aria-hidden="true" />
              <blockquote cite={reviewSourceUrl} className="mt-5 break-words text-lg font-semibold leading-7 text-[#07546f]">
                <p>&ldquo;{review.excerpt}&rdquo;</p>
              </blockquote>
              <p className="mt-3 flex-1 break-words text-base leading-7 text-[#4d4d4f]">
                {review.text}
              </p>
              <figcaption className="mt-6 border-t border-[#e0e9eb] pt-4 text-base font-semibold text-[#2a2c2f]">
                {review.name}
                <a
                  href={reviewSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Read ${review.name}'s published testimonial on MuseCool (opens in a new tab)`}
                  className="mt-1 block w-fit py-2 text-sm font-medium text-[#07546f] underline-offset-4 hover:underline"
                >
                  Read published testimonial
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
