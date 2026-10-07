"use client";

import Image from "next/image";
import { Mail, Menu, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import BookingPopup from "./BookingPopup";
import NavbarMenu from "./NavbarMenu";
import { siteConfig } from "../config/site";

const loginUrl = "https://app.musecool.com/";
const navbarMenuCloseDelayMs = 180;
const publicAssetPrefix =
  process.env.NEXT_PUBLIC_PROXY_PREFIX?.replace(/\/$/, "") ?? "";

type MenuVisibility = "closed" | "open" | "closing";

export default function Navbar() {
  const [menuVisibility, setMenuVisibility] =
    useState<MenuVisibility>("closed");
  const isMenuOpen = menuVisibility === "open";

  useEffect(() => {
    if (menuVisibility !== "closing") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMenuVisibility("closed");
    }, navbarMenuCloseDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [menuVisibility]);

  function closeMenu() {
    setMenuVisibility((current) =>
      current === "closed" ? "closed" : "closing",
    );
  }

  function toggleMenu() {
    setMenuVisibility((current) => (current === "open" ? "closing" : "open"));
  }

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed left-0 right-0 top-0 z-50 border-b border-[#eddcc5] bg-[#f7ead8] shadow-sm"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 sm:gap-4">
          <a
            href={`${publicAssetPrefix}/#find-tutor`}
            className="flex shrink-0 items-center text-[#21190f]"
            aria-label="MuseCool home"
            onClick={closeMenu}
          >
            <Image
              src="/images/brand/musecool-logo.webp"
              alt="MuseCool"
              width={387}
              height={120}
              preload
              sizes="(max-width: 640px) 103px, (max-width: 1024px) 142px, 154px"
              className="h-10 w-auto sm:h-11 lg:h-12"
            />
          </a>

          <div className="ml-auto flex min-w-0 items-center justify-end gap-1.5 sm:gap-3 lg:gap-4">
            <a
              href={`tel:${siteConfig.telephone}`}
              aria-label={`Call MuseCool at ${siteConfig.displayTelephone}`}
              className="inline-flex items-center justify-center gap-2 text-[#f47800] transition hover:text-[#21190f] lg:inline-flex lg:text-sm lg:font-bold lg:text-[#4d4d4f]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full lg:h-7 lg:w-7 lg:bg-[#f47800] lg:text-white">
                <Phone
                  className="h-5 w-5 lg:h-3.5 lg:w-3.5"
                  aria-hidden="true"
                />
              </span>
              <span className="hidden whitespace-nowrap lg:inline">
                {siteConfig.displayTelephone}
              </span>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              aria-label={`Email MuseCool at ${siteConfig.email}`}
              className="inline-flex items-center justify-center gap-2 text-[#f47800] transition hover:text-[#21190f] lg:inline-flex lg:text-sm lg:font-bold lg:text-[#4d4d4f]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full lg:h-7 lg:w-7 lg:bg-[#f47800] lg:text-white">
                <Mail
                  className="h-5 w-5 lg:h-3.5 lg:w-3.5"
                  aria-hidden="true"
                />
              </span>
              <span className="hidden whitespace-nowrap lg:inline">
                {siteConfig.email}
              </span>
            </a>

            <a
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Log in to MuseCool (opens in a new tab)"
              className="hidden h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#4d4d4f] shadow-[0_7px_18px_rgba(45,38,31,0.08)] transition hover:-translate-y-0.5 hover:text-[#21190f] focus:outline-none focus:ring-2 focus:ring-[#f47800]/35 md:inline-flex"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">Log In</span>
            </a>

            <BookingPopup
              triggerLabel="Start with a trial lesson"
              showPianoIcon={false}
              showArrowIcon={false}
              className="button-effect-11 hidden h-12 shrink-0 items-center justify-center rounded-full px-6 text-sm font-black shadow-sm shadow-[#F47800]/20 focus:outline-none focus:ring-2 focus:ring-[#ffb36b] focus:ring-offset-2 sm:inline-flex lg:px-7"
            />

            <button
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-controls="expanded-navigation-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#4d4d4f] transition hover:bg-white/60 hover:text-[#21190f] focus:outline-none focus:ring-2 focus:ring-[#f47800]/35 sm:h-12 sm:w-12"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <NavbarMenu
        loginUrl={loginUrl}
        isHidden={menuVisibility === "closed"}
        isClosing={menuVisibility === "closing"}
        onClose={closeMenu}
      />
    </nav>
  );
}
