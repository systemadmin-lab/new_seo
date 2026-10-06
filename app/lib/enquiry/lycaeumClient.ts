import {
  buildLycaeumEnquiryUrl,
  lycaeumEnquiryConfig,
} from "../../config/lycaeum";

export type FormOpenResponse = {
  formOpenId?: string;
  studentId?: string;
};

export type InitialEnquiryResponse = {
  studentId?: string;
};

export type FinalEnquiryResponse = {
  redirectUrl?: string;
};

type EnquiryFetcher = (url: string, init: RequestInit) => Promise<Response>;

export const enquiryApiRoutes = {
  formOpen: buildLycaeumEnquiryUrl("formOpen"),
  main: buildLycaeumEnquiryUrl("main"),
  child: buildLycaeumEnquiryUrl("child"),
} as const;

export class EnquiryClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown,
  ) {
    super(message);
    this.name = "EnquiryClientError";
  }
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

function getErrorMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return "Enquiry request failed";
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function shouldAttachSource(url: string) {
  return url === enquiryApiRoutes.formOpen || url === enquiryApiRoutes.main;
}

function withLycaeumClientDefaults(url: string, payload: unknown) {
  if (!shouldAttachSource(url) || !isJsonRecord(payload)) {
    return payload;
  }

  const source =
    typeof payload.source === "string" && payload.source.trim() !== ""
      ? payload.source.trim()
      : lycaeumEnquiryConfig.source;

  return {
    ...payload,
    source,
  };
}

export async function postLycaeumEnquiryJson<TResponse>(
  url: string,
  payload: unknown,
  fetcher: EnquiryFetcher = fetch,
) {
  const response = await fetcher(url, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(withLycaeumClientDefaults(url, payload)),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new EnquiryClientError(getErrorMessage(data), response.status, data);
  }

  return data as TResponse;
}
