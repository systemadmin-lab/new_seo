import Image from "next/image";

const publications = [
  {
    name: "Forbes",
    src: "/images/featured/forbes.svg",
    width: 200,
    height: 54,
  },
  {
    name: "BBC Radio London",
    src: "/images/featured/bbc-radio-london.png",
    width: 1920,
    height: 634,
  },
  {
    name: "Classic FM",
    src: "/images/featured/classic-fm.svg",
    width: 472,
    height: 107,
  },
  {
    name: "Tech.eu",
    src: "/images/featured/tech-eu.svg",
    width: 250,
    height: 187,
  },
] as const;

export default function FeaturedOn() {
  return (
    <section
      id="featured-on"
      aria-labelledby="featured-title"
      className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <h2
        id="featured-title"
        className="text-center text-3xl font-bold leading-[1.15] text-[#2a2c2f] sm:text-4xl lg:text-5xl"
      >
        As Featured On
      </h2>

      <ul className="mx-auto mt-6 grid max-w-[880px] grid-cols-2 items-center gap-x-8 gap-y-6 sm:mt-8 md:grid-cols-4 md:gap-x-12 lg:gap-x-16">
        {publications.map((publication) => (
          <li
            key={publication.name}
            className="flex min-h-24 items-center justify-center sm:min-h-30"
          >
            <Image
              src={publication.src}
              alt={publication.name}
              width={publication.width}
              height={publication.height}
              sizes="(min-width: 640px) 160px, 120px"
              className="h-auto w-full max-w-[120px] object-contain sm:max-w-[160px]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
