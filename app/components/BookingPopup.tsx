"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Guitar,
  MicVocal,
  MoreHorizontal,
  Music,
  Music2,
  Piano,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import BookingDatePicker from "./BookingDatePicker";
import { isSelectableDateRange, toDateValue, type BookingDateRange } from "../lib/enquiry/bookingDate";
import { getStartingPrice } from "../config/pricing";
import {
  createChildEnquiryPayload,
  createFinalEnquiryPayload,
  createInitialEnquiryPayload,
  getAnalyticsIdFromCookie,
  getOrCreateSourceKey,
  type StudentDetails,
} from "../lib/enquiry/bookingPopupApi";
import {
  enquiryApiRoutes,
  postLycaeumEnquiryJson,
  type FinalEnquiryResponse,
  type FormOpenResponse,
  type InitialEnquiryResponse,
} from "../lib/enquiry/lycaeumClient";

const publicAssetPrefix =
  process.env.NEXT_PUBLIC_PROXY_PREFIX?.replace(/\/$/, "") ?? "";
const defaultSubmitError =
  "We could not send your enquiry right now. Please try again.";

const studentOptions = ["For my child", "For myself"] as const;
const lessonOptions = [
  { label: "At my home", note: `From ${getStartingPrice("inPerson")}` },
  { label: "Online", note: `From ${getStartingPrice("online")}` },
  { label: "Not sure yet", note: "" },
] as const;
const experienceOptions = [
  "No experience",
  "Early beginner",
  "Intermediate",
  "Proficient",
] as const;
const instrumentOptions: ReadonlyArray<{
  label: "Piano" | "Violin" | "Guitar" | "Singing" | "Flute" | "Other";
  Icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  imageSrc?: string;
  imageClassName?: string;
}> = [
  {
    label: "Piano",
    imageSrc: `${publicAssetPrefix}/images/popup/p-01.svg`,
    imageClassName: "h-12 w-12",
  },
  { label: "Violin", Icon: Music },
  { label: "Guitar", Icon: Guitar },
  { label: "Singing", Icon: MicVocal },
  {
    label: "Flute",
    imageSrc: `${publicAssetPrefix}/images/popup/noun-flute-1175161.svg`,
  },
  { label: "Other", Icon: MoreHorizontal },
] as const;
const otherInstrumentOptions = [
  "Ukulele",
  "Cello",
  "Clarinet",
  "Drum Kit",
  "Saxophone",
  "Trumpet",
  "Other",
] as const;
const instrumentOwnershipOptions = ["Already have one", "Not yet"] as const;
const musicalDreamOptions = [
  {
    label: "Play favorite song",
    imageSrc: `${publicAssetPrefix}/images/popup/dream-1.svg`,
  },
  {
    label: "Perform with friends",
    imageSrc: `${publicAssetPrefix}/images/popup/dream-2.svg`,
  },
  {
    label: "Music for stress relief",
    imageSrc: `${publicAssetPrefix}/images/popup/dream-3.svg`,
  },
  {
    label: "Get back to playing",
    imageSrc: `${publicAssetPrefix}/images/popup/dream-4.svg`,
  },
] as const;

type BookingStep =
  | "generalInformation"
  | "studentProfile"
  | "chooseInstrument"
  | "musicalDream";

type BookingPopupProps = {
  triggerLabel: string;
  className?: string;
  showPianoIcon?: boolean;
  showArrowIcon?: boolean;
  arrowClassName?: string;
};

type BookingPopupDialogProps = {
  dialogTitleId: string;
  email: string;
  isPrivacyAccepted: boolean;
  step: BookingStep;
  selectedStudent: (typeof studentOptions)[number];
  selectedLesson: (typeof lessonOptions)[number]["label"];
  selectedExperience: (typeof experienceOptions)[number];
  selectedInstrument: (typeof instrumentOptions)[number]["label"];
  selectedOtherInstrument: (typeof otherInstrumentOptions)[number] | "";
  isOtherInstrumentOpen: boolean;
  selectedInstrumentOwnership: (typeof instrumentOwnershipOptions)[number];
  selectedMusicalDream: (typeof musicalDreamOptions)[number]["label"] | "";
  preferredDates?: BookingDateRange;
  onPreferredDatesChange?: (dates: BookingDateRange) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  onClose: () => void;
  onBack: () => void;
  onEmailChange: (email: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onTogglePrivacy: () => void;
  onSelectStudent: (student: (typeof studentOptions)[number]) => void;
  onSelectLesson: (lesson: (typeof lessonOptions)[number]["label"]) => void;
  onSelectExperience: (
    experience: (typeof experienceOptions)[number],
  ) => void;
  onSelectInstrument: (
    instrument: (typeof instrumentOptions)[number]["label"],
  ) => void;
  onSelectOtherInstrument: (
    instrument: (typeof otherInstrumentOptions)[number],
  ) => void;
  onSelectInstrumentOwnership: (
    ownership: (typeof instrumentOwnershipOptions)[number],
  ) => void;
  onSelectMusicalDream: (
    dream: (typeof musicalDreamOptions)[number]["label"],
  ) => void;
};

function OptionButton({
  isSelected,
  label,
  note,
  onClick,
  className = "",
}: {
  isSelected: boolean;
  label: string;
  note?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-black transition sm:px-4 sm:text-[0.84rem] ${className} ${
        isSelected
          ? "border-[#49c6c5] bg-[#c9f6ff] text-[#31535a] shadow-[0_8px_22px_rgba(73,198,197,0.24)]"
          : "border-[#dedede] bg-[#f7f7f7] text-[#666] hover:border-[#8ad7d6] hover:bg-white"
      }`}
    >
      <Music2
        className={`h-4 w-4 ${isSelected ? "text-[#0e92ba]" : "text-[#c7c7c7]"}`}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">{label}</span>
      {note ? <span className="sr-only">{note}</span> : null}
    </button>
  );
}

function ProgressStepper({ activeStep }: { activeStep: 2 | 3 | 4 }) {
  return (
    <div
      className="absolute left-1/2 top-12 z-10 hidden -translate-x-1/2 items-center gap-8 md:flex"
      aria-label="Booking progress"
    >
      <span className="inline-flex h-12 w-14 rotate-[-12deg] items-center justify-center rounded-[50%] bg-[#67c9be] text-white shadow-[0_8px_20px_rgba(103,201,190,0.24)]">
        <Check className="h-7 w-7" aria-hidden="true" />
      </span>
      {["02", "03", "04"].map((label) => {
        const stepNumber = Number(label);
        const isComplete = stepNumber < activeStep;
        const isActive = stepNumber === activeStep;

        return (
        <span
          key={label}
          className={`inline-flex h-12 w-14 rotate-[-12deg] items-center justify-center rounded-[50%] text-lg font-black text-white shadow-[0_8px_20px_rgba(47,149,189,0.22)] ${
            isActive ? "bg-[#2f95bd]" : "bg-[#67c9be]"
          }`}
        >
          {isComplete ? <Check className="h-7 w-7" aria-hidden="true" /> : label}
        </span>
        );
      })}
    </div>
  );
}

function PopupTextInput({
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      className="h-12 w-full rounded-full border border-[#49c6c5] bg-white px-6 text-sm font-semibold text-[#2a2c2f] outline-none transition placeholder:text-[#727272] focus:border-[#0e92ba] focus:ring-2 focus:ring-[#c9f6ff]"
    />
  );
}

function InstrumentButton({
  isSelected,
  isOtherOpen = false,
  label,
  Icon,
  imageSrc,
  imageClassName = "h-9 w-9",
  onClick,
}: {
  isSelected: boolean;
  isOtherOpen?: boolean;
  label: string;
  Icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  imageSrc?: string;
  imageClassName?: string;
  onClick: () => void;
}) {
  const isOther = label === "Other";
  const borderStyle = isOther && !isOtherOpen ? "border-dashed" : "border-solid";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`relative inline-flex min-h-[3.75rem] items-center gap-3 rounded-[0.9rem] border px-4 text-sm font-black transition sm:min-h-[4.65rem] sm:gap-5 sm:rounded-[1rem] sm:px-5 sm:text-base ${borderStyle} ${
        isSelected
          ? "border-[#49c6c5] bg-[#c9f6ff] text-[#2a2c2f] shadow-[0_12px_24px_rgba(73,198,197,0.18)]"
          : "border-[#49c6c5] bg-white text-[#4d4d4f] hover:bg-[#f4ffff]"
      }`}
    >
      {isSelected ? (
        <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#67c9be] text-white shadow-sm sm:right-4 sm:top-4 sm:h-8 sm:w-8">
          <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </span>
      ) : null}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={36}
          height={36}
          aria-hidden="true"
          className={`${imageClassName} object-contain`}
        />
      ) : Icon ? (
        <Icon className="h-8 w-8 text-[#2f95bd] sm:h-9 sm:w-9" aria-hidden={true} />
      ) : null}
      <span>{label}</span>
      {isOther ? (
        isOtherOpen ? (
          <ChevronUp
            className="ml-auto h-5 w-5 text-[#67c9be]"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="ml-auto h-5 w-5 text-[#67c9be]"
            aria-hidden="true"
          />
        )
      ) : null}
    </button>
  );
}

function CheckboxOption({
  isSelected,
  label,
  onSelect,
}: {
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-black text-[#666]">
      <input
        type="checkbox"
        name={`instrument-${label}`}
        checked={isSelected}
        onChange={onSelect}
        className="h-4 w-4 appearance-none rounded border border-[#49c6c5] bg-white checked:bg-[#49c6c5] focus:ring-2 focus:ring-[#49c6c5]"
      />
      <span>{label}</span>
    </label>
  );
}

function MusicalDreamButton({
  isSelected,
  label,
  imageSrc,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  imageSrc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`relative flex min-h-[5.75rem] flex-col items-center justify-center gap-1.5 rounded-[0.9rem] border px-3 py-3 text-center text-[0.8125rem] font-black leading-tight transition sm:min-h-[7rem] sm:gap-2 sm:rounded-[1rem] sm:px-4 sm:text-sm ${
        isSelected
          ? "border-[#49c6c5] bg-[#c9f6ff] text-[#2a2c2f] shadow-[0_12px_24px_rgba(73,198,197,0.18)]"
          : "border-[#49c6c5] bg-white text-[#2f2f31] hover:bg-[#f4ffff]"
      }`}
    >
      {isSelected ? (
        <span className="absolute right-2.5 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#67c9be] text-white shadow-sm sm:right-3 sm:top-3 sm:h-7 sm:w-7">
          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </span>
      ) : null}
      <Image
        src={imageSrc}
        alt=""
        width={58}
        height={58}
        aria-hidden="true"
        className="h-10 w-10 object-contain sm:h-14 sm:w-14"
      />
      <span>{label}</span>
    </button>
  );
}

export function BookingPopupDialog({
  dialogTitleId,
  email,
  isPrivacyAccepted,
  step,
  selectedStudent,
  selectedLesson,
  selectedExperience,
  selectedInstrument,
  selectedOtherInstrument,
  isOtherInstrumentOpen,
  selectedInstrumentOwnership,
  selectedMusicalDream,
  preferredDates = { start: "", end: "" },
  onPreferredDatesChange,
  isSubmitting = false,
  submitError = null,
  onClose,
  onBack,
  onEmailChange,
  onSubmit,
  onTogglePrivacy,
  onSelectStudent,
  onSelectLesson,
  onSelectExperience,
  onSelectInstrument,
  onSelectOtherInstrument,
  onSelectInstrumentOwnership,
  onSelectMusicalDream,
}: BookingPopupDialogProps) {
  const hasEmail = email.trim().length > 0;
  const isStudentProfile = step === "studentProfile";
  const isChooseInstrument = step === "chooseInstrument";
  const isMusicalDream = step === "musicalDream";
  const isProgressStep = isStudentProfile || isChooseInstrument || isMusicalDream;
  const isCompactMobileStep = isChooseInstrument || isMusicalDream;
  const expandedArtwork =
    hasEmail || isStudentProfile || isChooseInstrument || isMusicalDream;
  const leftTitle = isMusicalDream
    ? "Almost there"
    : isChooseInstrument
      ? "Choose the instrument"
      : isStudentProfile
        ? "Student profile"
        : "Let's get started!";
  const leftDescription = isMusicalDream
    ? "Tell us more about your goals and specific situation, so that we can really tailor the experience for your needs."
    : isChooseInstrument
      ? "No instrument yet? We'll help with that."
      : isStudentProfile
        ? "Answer a few questions to be matched with your best-fit tutor."
        : null;
  const mainTitle = isMusicalDream
    ? "Choose Your Musical Dream"
    : isChooseInstrument
      ? "Choose the instrument"
      : isStudentProfile
        ? "Student profile"
        : "General Information";

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-stretch justify-center overflow-hidden bg-black/65 p-0 backdrop-blur-xl backdrop-saturate-50 sm:items-center sm:px-6 sm:py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className="relative grid h-[100dvh] max-h-[100dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-none bg-white shadow-[0_28px_80px_rgba(0,0,0,0.38)] sm:h-auto sm:max-h-[calc(100svh-2rem)] sm:max-w-[55rem] sm:rounded-[2rem] md:grid-cols-[0.9fr_1.1fr]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking popup"
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#555] transition hover:bg-black/5 hover:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#49c6c5]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div
          className={`relative overflow-hidden rounded-none bg-white sm:rounded-t-[1.5rem] md:rounded-l-[2rem] md:rounded-tr-none ${
            isCompactMobileStep
              ? "min-h-[12rem] px-5 py-6 sm:min-h-[14rem] sm:px-6 sm:py-8"
              : "min-h-[19rem] px-6 py-8"
          } ${
            isProgressStep
              ? "md:min-h-[46rem] md:pt-12"
              : expandedArtwork
                ? "md:min-h-[42rem]"
                : "md:min-h-[36rem]"
          }`}
        >
          <Image
            src="/images/popup/LeftTopCloudBG.png.bv.webp"
            alt=""
            width={535}
            height={366}
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 -top-24 w-[27rem] max-w-none"
          />
          <div className="relative z-10 max-w-[18rem]">
            <h2 className="text-2xl font-black leading-tight text-[#2a2c2f]">
              {leftTitle}
            </h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#3f4b50]">
              {leftDescription ? (
                <>{leftDescription}</>
              ) : (
                <>
                  We will recommend you our{" "}
                  <strong className="font-black">most inspiring</strong> tutor
                  for <strong className="font-black">your needs</strong>
                </>
              )}
            </p>
          </div>

          <Image
            src={`${publicAssetPrefix}/images/popup/Monkey.svg`}
            alt=""
            width={150}
            height={212}
            aria-hidden="true"
            className={`pointer-events-none absolute left-16 top-28 z-10 w-40 rotate-[-8deg] md:left-[4.2rem] ${
              isCompactMobileStep ? "hidden md:block" : ""
            } ${
              isStudentProfile
                ? "md:top-32 md:w-44"
                : isChooseInstrument || isMusicalDream
                  ? "md:top-32 md:w-48"
                : expandedArtwork
                  ? "md:top-24 md:w-44"
                  : "md:top-36 md:w-48"
            }`}
          />

          <div
            className={`absolute hidden h-36 w-36 overflow-hidden rounded-[1.25rem] shadow-[0_14px_34px_rgba(0,0,0,0.18)] md:block ${
              isStudentProfile || isChooseInstrument || isMusicalDream
                ? "left-[65%]"
                : "left-[52%]"
            } ${
              expandedArtwork ? "top-[16.3rem]" : "bottom-24"
            }`}
          >
            <Image
              src="/images/popup/lBottom-5.jpg"
              alt=""
              width={220}
              height={182}
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/70 to-transparent"
              aria-hidden="true"
            />
          </div>

          <div
            className={`absolute hidden w-40 overflow-hidden rounded-[1.25rem] opacity-90 shadow-[0_14px_34px_rgba(0,0,0,0.16)] md:block ${
              isStudentProfile || isChooseInstrument || isMusicalDream
                ? "left-16"
                : "left-4"
            } ${
              expandedArtwork ? "top-[24.8rem]" : "-bottom-2 rounded-b-none"
            } ${expandedArtwork ? "h-36" : "h-32"}`}
          >
            <Image
              src="/images/popup/lBottom-2.jpg"
              alt=""
              width={220}
              height={168}
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"
              aria-hidden="true"
            />
          </div>

          {expandedArtwork ? (
            <div
              className={`absolute top-[32.8rem] hidden h-32 w-40 overflow-hidden rounded-t-[1.25rem] opacity-95 shadow-[0_14px_34px_rgba(0,0,0,0.16)] md:block ${
                isStudentProfile || isChooseInstrument || isMusicalDream
                  ? "left-[65%]"
                  : "left-[52%]"
              }`}
            >
              <Image
                src="/images/popup/lBottom-3.jpg"
                alt=""
                width={260}
                height={174}
                aria-hidden="true"
                className="h-full w-full object-cover object-[52%_26%]"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : null}

          {isStudentProfile || isChooseInstrument || isMusicalDream ? (
            <div className="absolute bottom-0 left-16 hidden h-28 w-40 overflow-hidden rounded-t-[1.25rem] opacity-90 shadow-[0_14px_34px_rgba(0,0,0,0.16)] md:block">
              <Image
                src="/images/popup/lBottom-4.jpg"
                alt=""
                width={260}
                height={174}
                aria-hidden="true"
                className="h-full w-full object-cover object-[48%_26%]"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className={`relative px-5 pt-5 sm:px-8 md:px-10 ${
            isProgressStep ? "pb-24 sm:pb-8 md:pb-10" : "pb-8"
          } ${
            isStudentProfile
              ? "md:pt-36"
              : isChooseInstrument || isMusicalDream
                ? "md:pt-32"
                : "md:pt-24"
          }`}
        >
          {isStudentProfile || isChooseInstrument || isMusicalDream ? (
            <ProgressStepper
              activeStep={isMusicalDream ? 4 : isChooseInstrument ? 3 : 2}
            />
          ) : null}
          <Image
            src="/images/popup/right-top-music.png"
            alt=""
            width={609}
            height={144}
            aria-hidden="true"
            className="pointer-events-none absolute right-12 top-0 hidden w-80 opacity-85 sm:block"
          />

          <div className="relative z-10">
            <h3
              id={dialogTitleId}
              className="text-xl font-black leading-tight text-[#2a2c2f] sm:text-2xl"
            >
              {mainTitle}
            </h3>

            {isStudentProfile ? (
              <div className="mt-6 space-y-6">
                <PopupTextInput
                  name="studentName"
                  placeholder="Name of student"
                  required
                />
                <PopupTextInput name="age" placeholder="Age" required />
                <PopupTextInput name="postcode" placeholder="Postcode" required />
                <PopupTextInput
                  name="phone"
                  type="tel"
                  placeholder="Your phone number for lesson updates"
                  required
                />
              </div>
            ) : isChooseInstrument ? (
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {instrumentOptions.map(
                    ({ label, Icon, imageSrc, imageClassName }) => (
                    <InstrumentButton
                      key={label}
                      label={label}
                      Icon={Icon}
                      imageSrc={imageSrc}
                      imageClassName={imageClassName}
                      isSelected={
                        label === "Other"
                          ? selectedInstrument === "Other" &&
                            selectedOtherInstrument !== "" &&
                            !isOtherInstrumentOpen
                          : selectedInstrument === label
                      }
                      isOtherOpen={label === "Other" && isOtherInstrumentOpen}
                      onClick={() => onSelectInstrument(label)}
                    />
                    ),
                  )}
                </div>

                {isOtherInstrumentOpen ? (
                  <div className="mt-6 rounded-[1rem] border border-[#dedede] bg-[#fafafa] px-5 py-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                      {otherInstrumentOptions.map((option) => (
                        <CheckboxOption
                          key={option}
                          label={option}
                          isSelected={selectedOtherInstrument === option}
                          onSelect={() => onSelectOtherInstrument(option)}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <fieldset className="mt-7">
                  <legend className="text-base font-semibold text-[#737373]">
                    Do you have a musical instrument?
                  </legend>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {instrumentOwnershipOptions.map((option) => (
                      <OptionButton
                        key={option}
                        label={option}
                        isSelected={selectedInstrumentOwnership === option}
                        onClick={() => onSelectInstrumentOwnership(option)}
                        className="w-full"
                      />
                    ))}
                  </div>
                </fieldset>
              </div>
            ) : isMusicalDream ? (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {musicalDreamOptions.map((option) => (
                    <MusicalDreamButton
                      key={option.label}
                      label={option.label}
                      imageSrc={option.imageSrc}
                      isSelected={selectedMusicalDream === option.label}
                      onClick={() => onSelectMusicalDream(option.label)}
                    />
                  ))}
                </div>

                <BookingDatePicker
                  value={preferredDates}
                  onChange={onPreferredDatesChange ?? (() => {})}
                  disabled={isSubmitting}
                />

                <label className="mt-8 block">
                  <span className="block text-xl font-black leading-tight text-[#2a2c2f] sm:text-2xl">
                    Anything we should know? (optional)
                  </span>
                  <span className="mt-4 block text-sm font-semibold leading-6 text-[#4f4f52]">
                    Please share any info that could help us give you or your
                    child the best experience
                  </span>
                  <textarea
                    name="musicalDreamNotes"
                    rows={5}
                    placeholder="e.g. My child is very energetic, so a patient approach would be appreciated. We would also prefer lessons in Spanish if possible, ideally with a female tutor."
                    className="mt-4 w-full resize-none rounded-[1.25rem] border border-[#49c6c5] bg-white px-6 py-4 text-sm font-semibold leading-6 text-[#2a2c2f] outline-none transition placeholder:text-[#b3b3b3] focus:border-[#0e92ba] focus:ring-2 focus:ring-[#c9f6ff]"
                  />
                </label>
              </div>
            ) : (
              <label className="relative mt-6 block">
                {hasEmail ? (
                  <span className="absolute left-6 top-0 z-10 -translate-y-1/2 bg-white px-1 text-xs font-semibold leading-none text-[#4f4f52]">
                    Enter your email
                  </span>
                ) : (
                  <span className="sr-only">Email address</span>
                )}
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder={hasEmail ? "" : "Enter your email"}
                  className={`h-12 w-full rounded-full border border-[#49c6c5] px-6 text-sm font-semibold text-[#2a2c2f] outline-none transition placeholder:text-[#727272] focus:border-[#0e92ba] focus:ring-2 focus:ring-[#c9f6ff] ${
                    hasEmail ? "bg-[#eaf2ff] font-black" : "bg-white"
                  }`}
                />
              </label>
            )}

            {isStudentProfile || isChooseInstrument || isMusicalDream ? null : (
              <fieldset className="mt-7">
              <legend className="text-base font-semibold text-[#737373]">
                Who are these lessons for?
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {studentOptions.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    isSelected={selectedStudent === option}
                    onClick={() => onSelectStudent(option)}
                    className="w-full"
                  />
                ))}
              </div>
              </fieldset>
            )}

            {isStudentProfile || isChooseInstrument || isMusicalDream ? null : (
              <fieldset className="mt-7">
              <legend className="text-base font-semibold text-[#737373]">
                How would you like to take your 1-on-1 lessons?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2 sm:flex-nowrap sm:gap-2.5">
                {lessonOptions.map((option) => (
                  <div key={option.label} className="text-center">
                    <OptionButton
                      label={option.label}
                      note={option.note}
                      isSelected={selectedLesson === option.label}
                      onClick={() => onSelectLesson(option.label)}
                      className={
                        option.label === "At my home"
                          ? "min-w-[7.75rem]"
                          : option.label === "Online"
                            ? "min-w-[5.9rem]"
                            : "min-w-[7.75rem]"
                      }
                    />
                    {option.note ? (
                      <p
                        className={`mt-1.5 text-xs font-black uppercase tracking-wide ${
                          selectedLesson === option.label
                            ? "text-[#2f8ab5]"
                            : "text-[#4a4a4a]"
                        }`}
                      >
                        {option.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              </fieldset>
            )}

            {isStudentProfile ? (
              <fieldset className="mt-7">
                <legend className="text-base font-semibold text-[#737373]">
                  Musical experience
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                  {experienceOptions.map((option) => (
                    <OptionButton
                      key={option}
                      label={option}
                      isSelected={selectedExperience === option}
                      onClick={() => onSelectExperience(option)}
                      className="w-full"
                    />
                  ))}
                </div>
              </fieldset>
            ) : null}

            {hasEmail && !isStudentProfile && !isChooseInstrument && !isMusicalDream ? (
              <div className="mt-8 space-y-3">
                <label className="grid grid-cols-[1.25rem_1fr] gap-3 text-sm font-black leading-6 text-[#555]">
                  <input
                    type="checkbox"
                    required
                    checked={isPrivacyAccepted}
                    onChange={onTogglePrivacy}
                    className="mt-1 h-4 w-4 rounded border-[#49c6c5] text-[#49c6c5] focus:ring-[#49c6c5]"
                  />
                  <span>
                    By clicking Let&apos;s go you agree to the{" "}
                    <a
                      href="https://musecool.com/uk/privacy-policy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2f8ab5] underline"
                      aria-label="Privacy policy (opens in a new tab)"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                <p className="ml-8 rounded-md border-l-4 border-[#67c9be] bg-[#eefbff] px-3 py-2 text-xs font-semibold leading-5 text-[#4f4f52]">
                  We keep your information private and secure, and only use it
                  to find the perfect tutor for you.
                </p>
              </div>
            ) : null}

            {submitError ? (
              <p
                role="alert"
                className="mt-6 rounded-[1rem] border border-[#f4b4a8] bg-[#fff4f1] px-4 py-3 text-sm font-bold leading-5 text-[#9b2c1d]"
              >
                {submitError}
              </p>
            ) : null}

            {isStudentProfile || isChooseInstrument || isMusicalDream ? (
              <div className="sticky bottom-0 z-20 -mx-5 mt-8 flex items-center gap-3 border-t border-[#e8f2f2] bg-white/95 px-5 py-4 shadow-[0_-18px_34px_rgba(25,25,27,0.08)] backdrop-blur sm:static sm:mx-0 sm:justify-between sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-0">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  aria-label={isMusicalDream ? "Back" : undefined}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.25rem] border border-[#49c6c5] bg-white px-6 py-3 text-base font-black text-[#67c9be] transition hover:bg-[#effefe] focus:outline-none focus:ring-2 focus:ring-[#49c6c5] focus:ring-offset-2 ${
                    isMusicalDream
                      ? "flex-[0_0_4rem] px-4 sm:min-w-24 sm:flex-none sm:px-6"
                      : "flex-[0_0_4rem] px-4 sm:min-w-32 sm:flex-none sm:px-6"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  {isMusicalDream ? null : <span className="hidden sm:inline">Back</span>}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-[1.25rem] bg-gradient-to-r from-[#67c9be] to-[#2f95bd] px-7 py-3 text-base font-black text-white shadow-[0_12px_26px_rgba(47,149,189,0.3)] transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#49c6c5] focus:ring-offset-2 ${
                    isMusicalDream
                      ? "min-w-0 flex-1 px-3 text-sm sm:min-w-[17rem] sm:flex-none sm:px-7 sm:text-base"
                      : "min-w-0 flex-1 sm:min-w-32 sm:flex-none"
                  } disabled:cursor-wait disabled:opacity-75`}
                >
                  <span className={isMusicalDream ? "leading-tight sm:whitespace-nowrap" : ""}>
                    {isSubmitting
                      ? "Sending..."
                      : isMusicalDream
                        ? "Start Your Musical Journey"
                        : "Next"}
                  </span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[1.25rem] bg-gradient-to-r from-[#67c9be] to-[#2f95bd] px-7 py-3 text-lg font-black text-white shadow-[0_12px_26px_rgba(47,149,189,0.3)] transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#49c6c5] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-75"
              >
                <span>{isSubmitting ? "Sending..." : "Let's go"}</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default function BookingPopup({
  triggerLabel,
  className = "button-effect-11 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black shadow-lg shadow-[#F47800]/20 focus:outline-none focus:ring-2 focus:ring-[#ffb36b] focus:ring-offset-2",
  showPianoIcon = true,
  showArrowIcon = true,
  arrowClassName = "h-4 w-4",
}: BookingPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [student, setStudent] = useState<(typeof studentOptions)[number]>(
    studentOptions[0],
  );
  const [lesson, setLesson] = useState<(typeof lessonOptions)[number]["label"]>(
    lessonOptions[0].label,
  );
  const [step, setStep] = useState<BookingStep>("generalInformation");
  const [experience, setExperience] =
    useState<(typeof experienceOptions)[number]>(experienceOptions[0]);
  const [instrument, setInstrument] =
    useState<(typeof instrumentOptions)[number]["label"]>("Other");
  const [otherInstrument, setOtherInstrument] = useState<
    (typeof otherInstrumentOptions)[number] | ""
  >("");
  const [isOtherInstrumentOpen, setIsOtherInstrumentOpen] = useState(false);
  const [instrumentOwnership, setInstrumentOwnership] =
    useState<(typeof instrumentOwnershipOptions)[number]>("Not yet");
  const [musicalDream, setMusicalDream] = useState<
    (typeof musicalDreamOptions)[number]["label"] | ""
  >("");
  const [email, setEmail] = useState("");
  const [preferredDates, setPreferredDates] = useState<BookingDateRange>({ start: "", end: "" });
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formOpenIdRef = useRef("");
  const formOpenRequestRef = useRef<Promise<string> | null>(null);
  const studentIdRef = useRef("");
  const studentDetailsRef = useRef<StudentDetails | null>(null);
  const dialogTitleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function startFormOpenSession() {
    const request = postLycaeumEnquiryJson<FormOpenResponse>(
      enquiryApiRoutes.formOpen,
      {
        analyticsId: getAnalyticsIdFromCookie(),
        sourceKey: getOrCreateSourceKey(),
      },
    ).then((data) => {
      const formOpenId = data.formOpenId ?? data.studentId ?? "";

      if (!formOpenId) {
        throw new Error("Missing formOpenId");
      }

      formOpenIdRef.current = formOpenId;

      return formOpenId;
    });

    formOpenRequestRef.current = request;
    request.then(
      () => {
        if (formOpenRequestRef.current === request) {
          formOpenRequestRef.current = null;
        }
      },
      () => {
        if (formOpenRequestRef.current === request) {
          formOpenRequestRef.current = null;
        }
      },
    );

    return request;
  }

  function ensureFormOpenSession() {
    if (formOpenIdRef.current) {
      return Promise.resolve(formOpenIdRef.current);
    }

    if (formOpenRequestRef.current) {
      return formOpenRequestRef.current;
    }

    return startFormOpenSession();
  }

  function readStudentDetails(formData: FormData): StudentDetails {
    return {
      name: String(formData.get("studentName") ?? ""),
      age: String(formData.get("age") ?? ""),
      postCode: String(formData.get("postcode") ?? ""),
      phoneNumber: String(formData.get("phone") ?? ""),
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (step === "generalInformation") {
        if (!isPrivacyAccepted) {
          setSubmitError("Please accept the privacy policy to continue.");
          return;
        }

        const formOpenId = await ensureFormOpenSession();
        const data = await postLycaeumEnquiryJson<InitialEnquiryResponse>(
          enquiryApiRoutes.main,
          createInitialEnquiryPayload({
            email,
            selectedStudent: student,
            selectedLesson: lesson,
            analyticsId: getAnalyticsIdFromCookie(),
            formOpenId,
          }),
        );

        if (!data.studentId) {
          throw new Error("Missing studentId");
        }

        studentIdRef.current = data.studentId;
        setStep("studentProfile");
        return;
      }

      if (step === "studentProfile") {
        studentDetailsRef.current = readStudentDetails(formData);
        setStep("chooseInstrument");
        return;
      }

      if (step === "chooseInstrument") {
        if (!studentIdRef.current || !studentDetailsRef.current) {
          throw new Error("Missing enquiry session");
        }

        await postLycaeumEnquiryJson(
          enquiryApiRoutes.child,
          createChildEnquiryPayload({
            studentId: studentIdRef.current,
            studentDetails: studentDetailsRef.current,
            selectedExperience: experience,
            selectedInstrument: instrument,
            selectedOtherInstrument: otherInstrument,
            selectedInstrumentOwnership: instrumentOwnership,
          }),
        );
        setStep("musicalDream");
        return;
      }

      if (!studentIdRef.current) {
        throw new Error("Missing enquiry session");
      }

      if ((preferredDates.start || preferredDates.end) && !isSelectableDateRange(preferredDates, toDateValue(new Date()))) {
        setSubmitError("Please choose both a start and end date from today onwards, or clear the dates to stay flexible.");
        return;
      }

      const data = await postLycaeumEnquiryJson<FinalEnquiryResponse>(
        enquiryApiRoutes.main,
        createFinalEnquiryPayload({
          studentId: studentIdRef.current,
          selectedMusicalDream: musicalDream,
          message: String(formData.get("musicalDreamNotes") ?? ""),
          preferredStartDate: preferredDates.start,
          preferredEndDate: preferredDates.end,
        }),
      );

      if (!data.redirectUrl) {
        throw new Error("Missing redirectUrl");
      }

      window.location.replace(data.redirectUrl);
    } catch {
      setSubmitError(defaultSubmitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    setStep((currentStep) =>
      currentStep === "musicalDream"
        ? "chooseInstrument"
        : currentStep === "chooseInstrument"
          ? "studentProfile"
          : "generalInformation",
    );
  }

  function handleSelectInstrument(
    selectedInstrument: (typeof instrumentOptions)[number]["label"],
  ) {
    setInstrument(selectedInstrument);

    if (selectedInstrument === "Other") {
      setIsOtherInstrumentOpen(true);
      return;
    }

    setOtherInstrument("");
    setIsOtherInstrumentOpen(false);
  }

  function handleSelectOtherInstrument(
    selectedInstrument: (typeof otherInstrumentOptions)[number],
  ) {
    setInstrument("Other");
    setOtherInstrument(selectedInstrument);
    setIsOtherInstrumentOpen(false);
  }

  function openPopup() {
    formOpenIdRef.current = "";
    formOpenRequestRef.current = null;
    studentIdRef.current = "";
    studentDetailsRef.current = null;
    setStep("generalInformation");
    setStudent(studentOptions[0]);
    setLesson(lessonOptions[0].label);
    setExperience(experienceOptions[0]);
    setInstrument("Other");
    setOtherInstrument("");
    setIsOtherInstrumentOpen(false);
    setInstrumentOwnership("Not yet");
    setMusicalDream("");
    setPreferredDates({ start: "", end: "" });
    setEmail("");
    setIsPrivacyAccepted(false);
    setSubmitError(null);
    setIsOpen(true);
    startFormOpenSession().catch(() => {
      setSubmitError(defaultSubmitError);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openPopup}
        className={className}
      >
        {showPianoIcon ? <Piano className="h-4 w-4" aria-hidden="true" /> : null}
        <span className="whitespace-nowrap">{triggerLabel}</span>
        {showArrowIcon ? (
          <ArrowRight className={arrowClassName} aria-hidden="true" />
        ) : null}
      </button>

      {isOpen
        ? createPortal(
            <BookingPopupDialog
              dialogTitleId={dialogTitleId}
              email={email}
              isPrivacyAccepted={isPrivacyAccepted}
              step={step}
              selectedStudent={student}
              selectedLesson={lesson}
              selectedExperience={experience}
              selectedInstrument={instrument}
              selectedOtherInstrument={otherInstrument}
              isOtherInstrumentOpen={isOtherInstrumentOpen}
              selectedInstrumentOwnership={instrumentOwnership}
              selectedMusicalDream={musicalDream}
              preferredDates={preferredDates}
              onPreferredDatesChange={(dates) => {
                setPreferredDates(dates);
                setSubmitError(null);
              }}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onClose={() => setIsOpen(false)}
              onBack={handleBack}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
              onTogglePrivacy={() =>
                setIsPrivacyAccepted((currentValue) => !currentValue)
              }
              onSelectStudent={setStudent}
              onSelectLesson={setLesson}
              onSelectExperience={setExperience}
              onSelectInstrument={handleSelectInstrument}
              onSelectOtherInstrument={handleSelectOtherInstrument}
              onSelectInstrumentOwnership={setInstrumentOwnership}
              onSelectMusicalDream={setMusicalDream}
            />,
            document.body,
          )
        : null}
    </>
  );
}
