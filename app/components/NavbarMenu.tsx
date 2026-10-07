"use client";

import Image from "next/image";
import { UserRound, X } from "lucide-react";
import { useEffect, useRef } from "react";

type NavbarMenuProps = {
  isHidden?: boolean;
  isClosing?: boolean;
  loginUrl: string;
  onClose: () => void;
  selectedVersion?: MenuVersion;
};

type MenuVersion = "uk" | "us";

const publicAssetPrefix =
  process.env.NEXT_PUBLIC_PROXY_PREFIX?.replace(/\/$/, "") ?? "";

const menuVersions = {
  uk: {
    label: "UK",
    href: "https://musecool.com/uk/",
    flagSrc: `${publicAssetPrefix}/images/hero/flag-for-flag-united-kingdom-svgrepo-com.svg`,
  },
  us: {
    label: "US",
    href: "https://musecool.com/us/",
    flagSrc: `${publicAssetPrefix}/images/hero/usa.svg`,
  },
} as const satisfies Record<
  MenuVersion,
  { label: string; href: string; flagSrc: string }
>;

const menuColumns = [
  {
    title: "About Us",
    links: [
      { label: "About Us", path: "about-us" },
      { label: "Why Music is Important", path: "why-music-is-important" },
      { label: "Our Tutors", path: "our-tutors" },
      { label: "FAQ", path: "faq" },
      { label: "Prices", path: "prices" },
      { label: "Testimonials", path: "testimonials" },
      { label: "Teach with Us", path: "teach-with-us" },
      { label: "MusicOnWheels", path: "musiconwheels" },
    ],
  },
  {
    title: "What We Do",
    links: [
      { label: "What We Do", path: "what-we-do" },
      { label: "The Muse for Tutors", path: "https://musecool.com/the-muse/" },
      { label: "Private Lessons at Home", path: "private-lessons-at-home" },
      { label: "Private Lessons Online", path: "private-lessons-online" },
      {
        label: "Live Workshops & Concerts",
        path: "live-workshops-and-concerts",
      },
      { label: "Online Group Courses", path: "online-group-courses" },
      { label: "ABRSM Exam Training", path: "abrsm-exam-training" },
      { label: "Events Gallery", path: "events-gallery" },
    ],
  },
  {
    title: "Blog",
    links: [
      { label: "Our Blog", path: "blog" },
      { label: "Glossary", path: "glossary" },
      { label: "Podcasts", path: "podcasts" },
    ],
  },
] as const;

function getMenuLinkHref(selectedVersion: MenuVersion, path: string) {
  if (path.startsWith("https://")) {
    return path;
  }

  return `${menuVersions[selectedVersion].href}${path}/`;
}

function getMenuSectionId(title: string) {
  return `navbar-menu-${title.toLowerCase().replaceAll(" ", "-")}`;
}

function MenuColumn({
  title,
  links,
  selectedVersion,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; path: string }>;
  selectedVersion: MenuVersion;
}) {
  const sectionId = getMenuSectionId(title);

  return (
    <section aria-labelledby={sectionId}>
      <h2
        id={sectionId}
        className="border-b border-[#e4d8c7] pb-3 text-base font-bold text-[#2f95bd]"
      >
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <a
              href={getMenuLinkHref(selectedVersion, link.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold leading-6 text-[#2a2c2f] transition hover:text-[#f47800]"
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function NavbarMenu({
  isHidden = false,
  isClosing = false,
  loginUrl,
  onClose,
  selectedVersion = "uk",
}: NavbarMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHidden || isClosing) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isHidden, isClosing]);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      id="expanded-navigation-menu"
      hidden={isHidden}
      inert={isClosing}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded navigation menu"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }

        if (event.key !== "Tab") return;

        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        )).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      className={`navbar-menu-panel fixed inset-x-0 top-0 z-[60] max-h-[100svh] overflow-y-auto rounded-b-[1.75rem] border-b border-[#eddcc5] bg-[#f7ead8] shadow-[0_26px_70px_rgba(45,38,31,0.18)] ${
        isClosing ? "navbar-menu-panel-closing" : ""
      }`}
    >
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center gap-3 sm:gap-4">
          <a href={`${publicAssetPrefix}/#find-tutor`} aria-label="MuseCool home" onClick={onClose}>
            <Image
              src="/images/brand/musecool-logo.webp"
              alt="MuseCool"
              width={387}
              height={120}
              sizes="(max-width: 640px) 90px, 154px"
              className="h-7 w-auto sm:h-12"
            />
          </a>

          <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-4">
            <a
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Log in to MuseCool (opens in a new tab)"
              className="hidden h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#4d4d4f] shadow-[0_7px_18px_rgba(45,38,31,0.08)] transition hover:-translate-y-0.5 hover:text-[#21190f] focus:outline-none focus:ring-2 focus:ring-[#f47800]/35 sm:inline-flex"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">Log In</span>
            </a>

            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#4d4d4f] transition hover:bg-white/60 hover:text-[#21190f] focus:outline-none focus:ring-2 focus:ring-[#f47800]/35 sm:h-12 sm:w-12"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 pb-14 pt-8 sm:grid-cols-2 lg:grid-cols-[0.7fr_0.95fr_1.15fr_0.7fr] lg:gap-20 lg:pb-16 lg:pt-12">
        <section aria-labelledby="navbar-menu-versions">
          <h2
            id="navbar-menu-versions"
            className="border-b border-[#e4d8c7] pb-3 text-base font-bold text-[#2f95bd]"
          >
            Versions
          </h2>
          <div
            className="mt-4 inline-flex rounded-full border border-[#f5c690] bg-white p-1 shadow-[0_8px_22px_rgba(45,38,31,0.1)]"
            aria-label="Site versions"
          >
            {Object.entries(menuVersions).map(([version, config]) => {
              const isSelected = version === selectedVersion;

              return (
                <a
                  key={version}
                  href={config.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${config.label} site (opens in a new tab)`}
                  aria-current={isSelected ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:text-[#f47800] ${
                    isSelected
                      ? "bg-[#ffd4a1] font-black text-[#f47800]"
                      : "font-bold text-[#777b82]"
                  }`}
                >
                  <Image
                    src={config.flagSrc}
                    alt=""
                    width={18}
                    height={18}
                    unoptimized
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span>{config.label}</span>
                </a>
              );
            })}
          </div>
        </section>

        {menuColumns.map((column) => (
          <MenuColumn
            key={column.title}
            title={column.title}
            links={column.links}
            selectedVersion={selectedVersion}
          />
        ))}
      </div>
    </div>
  );
}
