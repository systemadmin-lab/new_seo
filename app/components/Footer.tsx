import Image from "next/image";
import { appStoreUrl, googlePlayUrl } from "../config/storeLinks";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.96 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.03 24 18.06 24 12.07Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M23.5 6.16a3 3 0 0 0-2.11-2.11C19.52 3.55 12 3.55 12 3.55s-7.52 0-9.39.5A3 3 0 0 0 .5 6.16C0 8.03 0 12 0 12s0 3.97.5 5.84a3 3 0 0 0 2.11 2.11c1.87.5 9.39.5 9.39.5s7.52 0 9.39-.5a3 3 0 0 0 2.11-2.11C24 15.97 24 12 24 12s0-3.97-.5-5.84ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83ZM15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.13.67-2.85 1.51-.62.73-1.16 1.87-1.01 2.98 1.1.09 2.18-.58 2.87-1.43Z" />
    </svg>
  );
}

function PlayStoreIcon() {
  return (
    <svg aria-hidden="true" className="size-4 fill-current" viewBox="0 0 24 24">
      <path d="M4.2 2.8 14.7 13.3l-3.2 3.2L4.2 2.8Zm11.2 11.2 3.4-3.4 3.1 1.8c.8.46.8 1.58 0 2.04l-3.1 1.8-3.4-3.4Zm-1.4.7 3.6 3.6L5.3 25.3c-.82.46-1.83-.13-1.83-1.07V6.05L14 16.55Zm2.9-5.4-3.6 3.6L3.47 3.07c0-.94 1.01-1.53 1.83-1.07l11.6 6.6Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="site-footer" className="site-footer w-full border-t border-[#bceffa]/70 bg-[#e8f8fb] px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] md:gap-10 lg:gap-14">
          <div className="flex flex-col justify-between gap-6 md:pr-6 lg:pr-8">
            <div>
              <Image
                src="/images/brand/musecool-logo.webp"
                alt="MuseCool"
                width={387}
                height={120}
                sizes="154px"
                className="h-12 w-auto"
              />

              <p className="type-body-sm mt-4 max-w-[340px] font-medium text-[#594338]">
                Built for families who want clearer practice, calmer lessons,
                and visible progress between every piano session.
              </p>

              <nav aria-label="MuseCool social links" className="mt-5 flex gap-2.5">
                <a
                  href="https://www.instagram.com/musecool"
                  aria-label="MuseCool on Instagram"
                  className="flex size-11 items-center justify-center rounded-full border border-[#bceffa] bg-white text-[#594338] hover:text-[#006184]"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/search/top?q=MuseCool"
                  aria-label="MuseCool on Facebook"
                  className="flex size-11 items-center justify-center rounded-full border border-[#bceffa] bg-white text-[#594338] hover:text-[#006184]"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.youtube.com/results?search_query=MuseCool"
                  aria-label="MuseCool on YouTube"
                  className="flex size-11 items-center justify-center rounded-full border border-[#bceffa] bg-white text-[#594338] hover:text-[#006184]"
                >
                  <YoutubeIcon />
                </a>
              </nav>
            </div>

            <div className="type-caption mt-auto border-t border-[#bceffa]/70 pt-4 font-semibold text-[#4a6670] md:border-t-0">
              &copy; 2026 MuseCool Ltd. All rights reserved.
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 md:border-l md:border-[#bceffa]/70 md:pl-8 lg:pl-10">
            <div className="flex flex-col gap-3">
              <h2 className="type-footer-title max-w-[26rem] font-extrabold text-[#2a2c2f]">
                Start using The Muse between lessons and make practice easier to
                support.
              </h2>

              <div className="mt-1 flex flex-col gap-2">
                <span className="type-label font-bold uppercase tracking-widest text-[#4a6670]">
                  Available on iOS and Android
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download MuseCool Tutor from the App Store"
                    className="flex min-h-11 items-center gap-2 rounded-lg bg-[#111111] px-3 py-1.5 text-white hover:bg-[#2a2a2a]"
                  >
                    <AppleIcon />
                    <div className="text-left leading-tight">
                      <div className="text-[0.6875rem] uppercase tracking-wider text-[#bceffa]">
                        Download on the
                      </div>
                      <div className="text-[0.8125rem] font-semibold">
                        App Store
                      </div>
                    </div>
                  </a>

                  <a
                    href={googlePlayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download MuseCool Tutor from Google Play"
                    className="flex min-h-11 items-center gap-2 rounded-lg bg-[#111111] px-3 py-1.5 text-white hover:bg-[#2a2a2a]"
                  >
                    <PlayStoreIcon />
                    <div className="text-left leading-tight">
                      <div className="text-[0.6875rem] uppercase tracking-wider text-[#bceffa]">
                        Get it on
                      </div>
                      <div className="text-[0.8125rem] font-semibold">
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <nav aria-label="Footer links" className="type-label mt-auto flex flex-wrap gap-x-4 border-t border-[#bceffa]/70 pt-4 font-bold uppercase tracking-widest text-[#4a6670]">
              <a
                href="https://musecool.com/uk/privacy-policy/"
                className="inline-flex min-h-11 items-center hover:text-[#006184]"
              >
                Privacy
              </a>
              <a
                href="https://musecool.com/uk/terms-and-conditions/"
                className="inline-flex min-h-11 items-center hover:text-[#006184]"
              >
                Terms
              </a>
              <a
                href="mailto:info@musecool.com"
                className="inline-flex min-h-11 items-center hover:text-[#006184]"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
