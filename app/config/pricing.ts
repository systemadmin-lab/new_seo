const currencySymbol = "£";
type LessonType = "online" | "inPerson";

function formatPrice(price: number) {
  return `${currencySymbol}${price}`;
}

export const lessonPricing = {
  currency: "GBP",
  currencySymbol,
  online: {
    label: "Online",
    offerName: "Online piano lessons",
    image: "/images/pricing/online-lessons.png",
    imageAlt: "Student taking an online piano lesson at home",
    imageClass: "object-cover object-center",
    rows: [
      { duration: "30min", price: 17 },
      { duration: "45min", price: 22 },
      { duration: "60min", price: 28 },
    ],
  },
  inPerson: {
    label: "Offline at your home",
    offerName: "At-home piano lessons",
    image: "/images/pricing/in-person-lessons.jpg",
    imageAlt: "In-person piano lesson at home",
    imageClass: "object-cover object-center",
    rows: [
      { duration: "30min", price: 44 },
      { duration: "45min", price: 52 },
      { duration: "60min", price: 59 },
    ],
  },
} as const;

export function getFormattedPrice(price: number) {
  return formatPrice(price);
}

export function getStartingPrice(
  lessonType: LessonType,
  format: "display" | "schema" = "display",
) {
  const price = lessonPricing[lessonType].rows[0].price;

  return format === "schema" ? String(price) : formatPrice(price);
}

function getPrices(lessonType?: LessonType) {
  const pricingGroups = lessonType
    ? [lessonPricing[lessonType]]
    : [lessonPricing.online, lessonPricing.inPerson];

  return pricingGroups.flatMap((group) => group.rows.map((row) => row.price));
}

export function getOverallStartingPrice(
  format: "display" | "schema" = "display",
) {
  const price = Math.min(...getPrices());

  return format === "schema" ? String(price) : formatPrice(price);
}

export function getPriceRange(lessonType: LessonType) {
  const prices = getPrices(lessonType);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

export function getOverallPriceRange() {
  const prices = getPrices();
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}
