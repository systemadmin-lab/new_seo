import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "./config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteSiteUrl("/") }];
}
