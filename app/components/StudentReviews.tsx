import { Quote } from "lucide-react";

// Replace these four placeholders with the final names and review text.
const reviews = [
  { id: "review-1", name: "Reviewer name", text: "Your review text goes here." },
  { id: "review-2", name: "Reviewer name", text: "Your review text goes here." },
  { id: "review-3", name: "Reviewer name", text: "Your review text goes here." },
  { id: "review-4", name: "Reviewer name", text: "Your review text goes here." },
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
          What Our Students Say
        </h2>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex min-h-60 min-w-0 flex-col rounded-xl border border-[#bceffa] bg-white p-6 sm:p-7"
            >
              <Quote className="h-8 w-8 text-[#07546f]" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 break-words text-base leading-7 text-[#4d4d4f]">
                <p>{review.text}</p>
              </blockquote>
              <figcaption className="mt-6 border-t border-[#e0e9eb] pt-4 text-base font-semibold text-[#2a2c2f]">
                {review.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
