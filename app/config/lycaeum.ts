export type LycaeumEnquiryEndpoint = "formOpen" | "main" | "child";

export const lycaeumEnquiryConfig = {
  apiKey: "SuperSecretKey",
  country: "uk",
  baseUrl: "https://api.lycaeumapp.com/inquiry/v4",
  source: "musecool.com/uk",
} as const;

export function buildLycaeumEnquiryUrl(
  endpoint: LycaeumEnquiryEndpoint,
  config = lycaeumEnquiryConfig,
) {
  const path =
    endpoint === "formOpen" ? "/formOpen" : endpoint === "child" ? "/child" : "";
  const url = new URL(`${config.baseUrl.replace(/\/$/, "")}${path}`);

  url.searchParams.set("key", config.apiKey);
  url.searchParams.set("country", config.country);

  return url.toString();
}
