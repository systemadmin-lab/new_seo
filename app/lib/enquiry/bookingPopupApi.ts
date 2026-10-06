import { formatBookingDate } from "./bookingDate";

export type StudentDetails = {
  name: string;
  age: string;
  postCode: string;
  phoneNumber: string;
};

type SourceKeyStorage = Pick<Storage, "getItem" | "setItem">;

const sourceKeyStorageKey = "musecool_enquiry_source_key";
const defaultFallbackGoal = "Find the right MuseCool tutor";

export function getAnalyticsIdFromCookie(
  cookieString = typeof document === "undefined" ? "" : document.cookie,
) {
  const analyticsCookie = cookieString
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("_ga="));

  if (!analyticsCookie) {
    return "";
  }

  return decodeURIComponent(analyticsCookie.slice("_ga=".length));
}

function createSourceKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getBrowserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function getOrCreateSourceKey(
  storage: SourceKeyStorage | null = getBrowserStorage(),
  createId: () => string = createSourceKey,
) {
  if (!storage) {
    return createId();
  }

  const existingSourceKey = storage.getItem(sourceKeyStorageKey);

  if (existingSourceKey) {
    return existingSourceKey;
  }

  const nextSourceKey = createId();
  storage.setItem(sourceKeyStorageKey, nextSourceKey);

  return nextSourceKey;
}

function mapLessonFor(selectedStudent: string) {
  return selectedStudent === "For myself" ? "myself" : "child";
}

function mapLessonType(selectedLesson: string) {
  if (selectedLesson === "Online") {
    return "online";
  }

  if (selectedLesson === "Not sure yet") {
    return "not_sure";
  }

  return "home";
}

function mapExperience(selectedExperience: string) {
  const experienceMap: Record<string, string> = {
    "No experience": "beginner",
    "Early beginner": "early_beginner",
    Intermediate: "intermediate",
    Proficient: "advanced",
  };

  return experienceMap[selectedExperience] ?? selectedExperience.toLowerCase();
}

function getInstrumentName(selectedInstrument: string, selectedOtherInstrument: string) {
  if (selectedInstrument === "Other") {
    return selectedOtherInstrument.trim();
  }

  return selectedInstrument.trim();
}

export function createInitialEnquiryPayload({
  email,
  selectedStudent,
  selectedLesson,
  analyticsId,
  formOpenId,
}: {
  email: string;
  selectedStudent: string;
  selectedLesson: string;
  analyticsId: string;
  formOpenId: string;
}) {
  return {
    email: email.trim(),
    lessonFor: mapLessonFor(selectedStudent),
    lessonType: mapLessonType(selectedLesson),
    analyticsId,
    formOpenId,
  };
}

export function createChildEnquiryPayload({
  studentId,
  studentDetails,
  selectedExperience,
  selectedInstrument,
  selectedOtherInstrument,
  selectedInstrumentOwnership,
}: {
  studentId: string;
  studentDetails: StudentDetails;
  selectedExperience: string;
  selectedInstrument: string;
  selectedOtherInstrument: string;
  selectedInstrumentOwnership: string;
}) {
  return {
    studentId,
    childrens: [
      {
        name: studentDetails.name.trim(),
        age: studentDetails.age.trim(),
        experience: mapExperience(selectedExperience),
        postCode: studentDetails.postCode.trim().toUpperCase(),
        hasInstrument: selectedInstrumentOwnership === "Already have one",
        instrument: getInstrumentName(selectedInstrument, selectedOtherInstrument),
        phoneNumber: studentDetails.phoneNumber.trim(),
      },
    ],
  };
}

export function createFinalEnquiryPayload({
  studentId,
  selectedMusicalDream,
  message,
  preferredStartDate = "",
  preferredEndDate = "",
}: {
  studentId: string;
  selectedMusicalDream: string;
  message: string;
  preferredStartDate?: string;
  preferredEndDate?: string;
}) {
  const trimmedMusicalDream = selectedMusicalDream.trim();
  const formattedDate = formatBookingDate(preferredStartDate);
  const formattedEndDate = formatBookingDate(preferredEndDate);
  // The enquiry API stores free-form notes; keep the preference in that
  // supported field rather than sending an undocumented scheduling property.
  const dateNote = formattedDate
    ? formattedEndDate
      ? `Preferred lesson start dates: ${formattedDate} to ${formattedEndDate}`
      : `Preferred lesson start date: ${formattedDate}`
    : "";

  return {
    studentId,
    preferredGoal: trimmedMusicalDream || defaultFallbackGoal,
    preferredMusicalDream: trimmedMusicalDream,
    message: [dateNote, message.trim()].filter(Boolean).join("\n\n"),
  };
}
