export const suggestedTutorsApi = "https://api.musecool.com/tutor/seo-list";

export type SuggestedTutor = {
  id: string;
  name: string;
  picture: string;
  fallbackPicture: string;
};

// Verified API snapshots keep names and portraits paired during an outage.
// These IDs pin the editorial selections even if the API changes its order.
export const savedSuggestedTutors: readonly SuggestedTutor[] = [
  {
    id: "f02c4de8-ed06-4c1a-abef-cfcfa5b85425",
    name: "Anastasia Boiko",
    picture:
      "https://musecooldevstorage.blob.core.windows.net/files/https%3A//musecooldevstorage.blob.core.windows.net/files/f02c4de8-ed06-4c1a-abef-cfcfa5b85425.jpg.jpg",
    fallbackPicture: "/images/tutors/anastasia-boiko.jpg",
  },
  {
    id: "854844d3-7e92-4c5d-aa5f-0c58bef9dc55",
    name: "Anna Mozolevych",
    picture:
      "https://musecooldevstorage.blob.core.windows.net/files/854844d3-7e92-4c5d-aa5f-0c58bef9dc55.jpg",
    fallbackPicture: "/images/tutors/anna-mozolevych.jpg",
  },
];

function isValidPicture(picture: unknown): picture is string {
  if (typeof picture !== "string") return false;

  try {
    const url = new URL(picture);
    return (
      url.origin === "https://musecooldevstorage.blob.core.windows.net" &&
      url.pathname.startsWith("/files/") &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export function selectSuggestedTutors(payload: unknown): SuggestedTutor[] {
  const records: unknown[] = Array.isArray(payload) ? payload : [];

  return savedSuggestedTutors.map((saved) => {
    const matches = records.filter(
      (record): record is Record<string, unknown> =>
        typeof record === "object" && record !== null &&
        "id" in record && record.id === saved.id,
    );
    const record = matches.length === 1 ? matches[0] : undefined;

    if (
      record &&
      typeof record.name === "string" &&
      record.name.trim() &&
      isValidPicture(record.picture)
    ) {
      return {
        ...saved,
        name: record.name.trim(),
        // Some Azure object names contain encoded URLs. Keep the API value intact.
        picture: record.picture,
      };
    }

    return { ...saved, picture: saved.fallbackPicture };
  });
}

export async function getSuggestedTutors(
  fetchImpl: typeof fetch = fetch,
): Promise<SuggestedTutor[]> {
  try {
    const response = await fetchImpl(suggestedTutorsApi, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Tutor API returned ${response.status}`);
    return selectSuggestedTutors(await response.json());
  } catch {
    console.warn("Tutor API unavailable; using the saved tutor profiles.");
    return selectSuggestedTutors(null);
  }
}
