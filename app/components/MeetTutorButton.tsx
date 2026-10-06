import BookingPopup from "./BookingPopup";

export default function MeetTutorButton({
  label = "Meet Your Tutor",
}: {
  label?: string;
}) {
  return (
    <BookingPopup
      triggerLabel={label}
      className="button-effect-11 inline-flex h-12 self-center items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-black shadow-lg shadow-[#F47800]/20 focus:outline-none focus:ring-2 focus:ring-[#ffb36b] focus:ring-offset-2 sm:h-14 sm:self-start sm:px-8 sm:py-3 sm:text-base"
    />
  );
}
