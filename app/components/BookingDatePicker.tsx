"use client";

import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  formatBookingDate,
  getCalendarDays,
  getNextDateRange,
  getOrderedDateRange,
  isSelectableDate,
  moveCalendarMonth,
  parseDateValue,
  toDateValue,
  type BookingDateRange,
} from "../lib/enquiry/bookingDate";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c]";

function shortDate(value: string) {
  return parseDateValue(value)?.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function BookingDatePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: BookingDateRange;
  onChange: (value: BookingDateRange) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [today, setToday] = useState(() => toDateValue(new Date()));
  const [isOpen, setIsOpen] = useState(false);
  const [focusedDate, setFocusedDate] = useState(value.start || today);
  const [month, setMonth] = useState(() => parseDateValue(value.start || today)!);
  const [hoveredDate, setHoveredDate] = useState("");
  const [dragPreview, setDragPreview] = useState<BookingDateRange | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusedDayRef = useRef<HTMLButtonElement>(null);
  const shouldFocusDay = useRef(false);
  const dragRef = useRef<{ pointerId: number; anchor: string; moved: boolean } | null>(null);
  const days = getCalendarDays(month);
  const monthLabel = month.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const isCurrentMonth = toDateValue(month).slice(0, 7) <= today.slice(0, 7);
  const awaitingEnd = Boolean(value.start && !value.end);
  const displayedRange = dragPreview
    ?? (awaitingEnd && hoveredDate ? getOrderedDateRange(value.start, hoveredDate) : value);
  const selectionHint = dragPreview
    ? "Release to select these dates."
    : awaitingEnd
      ? "Now choose an end date."
      : value.end
        ? "Choose new dates or drag to replace."
        : "Choose a start date or drag across dates.";

  useLayoutEffect(() => {
    if (isOpen && shouldFocusDay.current) {
      focusedDayRef.current?.focus({ preventScroll: true });
      calendarRef.current?.scrollIntoView({ block: "nearest" });
      shouldFocusDay.current = false;
    }
  }, [isOpen, focusedDate, month]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: globalThis.PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  function resetPreview() {
    dragRef.current = null;
    setDragPreview(null);
    setHoveredDate("");
  }

  function closeCalendar() {
    resetPreview();
    setIsOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function toggleCalendar() {
    if (isOpen) {
      closeCalendar();
      return;
    }
    const currentToday = toDateValue(new Date());
    const initialDate = isSelectableDate(value.start, currentToday) ? value.start : currentToday;
    setToday(currentToday);
    setFocusedDate(initialDate);
    setMonth(parseDateValue(initialDate)!);
    resetPreview();
    shouldFocusDay.current = true;
    setIsOpen(true);
  }

  function selectDate(date: string) {
    if (disabled || !isSelectableDate(date, toDateValue(new Date()))) return;
    const nextRange = getNextDateRange(value, date);
    onChange(nextRange);
    resetPreview();
    if (nextRange.end) {
      closeCalendar();
    } else {
      shouldFocusDay.current = true;
      setFocusedDate(date);
      setMonth(parseDateValue(date)!);
    }
  }

  function dateAtPointer(event: PointerEvent) {
    const button = document.elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLButtonElement>("button[data-date]");
    return button && !button.disabled && gridRef.current?.contains(button)
      ? button.dataset.date ?? ""
      : "";
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, date: string) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    dragRef.current = { pointerId: event.pointerId, anchor: date, moved: false };
    gridRef.current?.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLTableElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const date = dateAtPointer(event);
    if (!date) return;
    if (date !== drag.anchor) drag.moved = true;
    if (drag.moved) setDragPreview(getOrderedDateRange(drag.anchor, date));
  }

  function finishDrag(event: PointerEvent<HTMLTableElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const date = dateAtPointer(event);
    resetPreview();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Releasing outside the calendar cancels the gesture without changing dates.
    if (!date || disabled) return;
    if (drag.moved) {
      const nextRange = getOrderedDateRange(drag.anchor, date);
      if (!isSelectableDate(nextRange.start, toDateValue(new Date()))) return;
      onChange(nextRange);
      closeCalendar();
    } else {
      selectDate(date);
    }
  }

  function changeMonth(offset: number) {
    const next = moveCalendarMonth(month, offset);
    next.setDate(1);
    setHoveredDate("");
    setMonth(next);
    setFocusedDate(toDateValue(next) < today ? today : toDateValue(next));
  }

  function handleDayKey(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    const next = new Date(date);
    switch (event.key) {
      case "ArrowLeft": next.setDate(next.getDate() - 1); break;
      case "ArrowRight": next.setDate(next.getDate() + 1); break;
      case "ArrowUp": next.setDate(next.getDate() - 7); break;
      case "ArrowDown": next.setDate(next.getDate() + 7); break;
      case "Home": next.setDate(next.getDate() - (next.getDay() + 6) % 7); break;
      case "End": next.setDate(next.getDate() + 6 - (next.getDay() + 6) % 7); break;
      case "PageUp":
      case "PageDown": {
        next.setTime(moveCalendarMonth(date, event.key === "PageUp" ? -1 : 1).getTime());
        break;
      }
      default: return;
    }
    event.preventDefault();
    const nextValue = toDateValue(next) < today ? today : toDateValue(next);
    shouldFocusDay.current = true;
    setFocusedDate(nextValue);
    if (awaitingEnd) setHoveredDate(nextValue);
    setMonth(parseDateValue(nextValue)!);
  }

  return (
    <div
      ref={containerRef}
      className="mt-7 text-[#2a2c2f]"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          resetPreview();
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (isOpen && event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeCalendar();
        }
      }}
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
        <label id={`${id}-label`} htmlFor={`${id}-trigger`} className="text-base font-bold">
          Preferred start dates
        </label>
        <span className="text-xs font-medium text-[#62696b]">Optional</span>
      </div>
      <p id={`${id}-hint`} className="mb-3 text-sm leading-5 text-[#62696b]">
        Choose a window to begin lessons. Drag across dates, or select a start and end.
      </p>
      <input type="hidden" name="preferredStartDate" value={value.start} />
      <input type="hidden" name="preferredEndDate" value={value.end} />
      <button
        id={`${id}-trigger`}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-controls={`${id}-calendar`}
        aria-describedby={`${id}-hint`}
        onClick={toggleCalendar}
        className={`flex min-h-18 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${focusStyle} ${value.start || isOpen ? "border-[#087f8c] bg-[#effafa] text-[#14636c]" : "border-[#49c6c5] bg-white text-[#555e61] hover:bg-[#f4ffff]"}`}
      >
        <CalendarDays className="hidden h-5 w-5 shrink-0 text-[#087f8c] sm:block" aria-hidden="true" />
        <span id={`${id}-value`} className="grid min-w-0 flex-1 grid-cols-2 divide-x divide-[#c4e4e4]">
          <span className="pr-3">
            <span className="mb-1 block text-xs font-medium text-[#62696b]">From</span>
            <span className="block font-semibold">{shortDate(value.start) || "Start date"}</span>
          </span>
          <span className="pl-3">
            <span className="mb-1 block text-xs font-medium text-[#62696b]">To</span>
            <span className="block font-semibold">{shortDate(value.end) || "End date"}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div ref={calendarRef} id={`${id}-calendar`} className="mt-2 scroll-mt-4 scroll-mb-24 rounded-2xl border border-[#c4e4e4] bg-white p-3 sm:p-4 sm:scroll-mb-4">
          <p role="status" className="mb-2 px-1 text-sm font-medium text-[#14636c]">{selectionHint}</p>
          <div className="mb-3 flex items-center justify-between gap-2">
            <button type="button" disabled={isCurrentMonth || disabled} aria-label="Previous month" onClick={() => changeMonth(-1)} className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#246d76] transition-colors hover:bg-[#effafa] disabled:cursor-not-allowed disabled:text-[#becbcd] ${focusStyle}`}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <span id={`${id}-month`} aria-live="polite" className="text-base font-bold">{monthLabel}</span>
            <button type="button" disabled={disabled} aria-label="Next month" onClick={() => changeMonth(1)} className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#246d76] transition-colors hover:bg-[#effafa] ${focusStyle}`}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p id={`${id}-keyboard`} className="sr-only">
            Use arrow keys to move between days, Page Up or Page Down to change month,
            and Enter or Space to select the start date, then the end date.
          </p>
          <table
            ref={gridRef}
            role="grid"
            aria-multiselectable="true"
            aria-labelledby={`${id}-month`}
            aria-describedby={`${id}-keyboard`}
            onPointerMove={moveDrag}
            onPointerUp={finishDrag}
            onPointerCancel={resetPreview}
            onLostPointerCapture={resetPreview}
            onPointerLeave={() => { if (!dragRef.current) setHoveredDate(""); }}
            className="w-full table-fixed select-none border-collapse text-center text-sm tabular-nums"
          >
            <thead>
              <tr>{weekdays.map((day) => <th key={day} scope="col" className="pb-2 text-[0.6875rem] font-semibold text-[#62696b]">{day}</th>)}</tr>
            </thead>
            <tbody>
              {Array.from({ length: days.length / 7 }, (_, week) => (
                <tr key={week}>
                  {days.slice(week * 7, week * 7 + 7).map((date, index) => {
                    if (!date) return <td key={index} />;
                    const dateValue = toDateValue(date);
                    const isStart = dateValue === displayedRange.start;
                    const isEnd = dateValue === displayedRange.end;
                    const isEndpoint = isStart || isEnd;
                    const inRange = Boolean(displayedRange.end && dateValue >= displayedRange.start && dateValue <= displayedRange.end);
                    const isSelected = dateValue === value.start || Boolean(value.end && dateValue >= value.start && dateValue <= value.end);
                    const isToday = dateValue === today;
                    const isDisabled = dateValue < today || disabled;
                    const dateRole = dateValue === value.start ? ", start date" : dateValue === value.end ? ", end date" : "";
                    return (
                      <td key={index} aria-selected={isSelected} className="relative py-0.5">
                        {inRange && displayedRange.start !== displayedRange.end && (
                          <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0.5 bg-[#e2f4f2] ${isStart ? "left-1/2 right-0" : isEnd ? "left-0 right-1/2" : "inset-x-0"}`} />
                        )}
                        <button
                          type="button"
                          data-date={dateValue}
                          ref={dateValue === focusedDate ? focusedDayRef : undefined}
                          tabIndex={dateValue === focusedDate ? 0 : -1}
                          disabled={isDisabled}
                          aria-label={`${formatBookingDate(dateValue, true)}${dateRole}`}
                          aria-current={isToday ? "date" : undefined}
                          onPointerDown={(event) => startDrag(event, dateValue)}
                          onPointerEnter={(event) => {
                            if (!isDisabled && !dragRef.current && awaitingEnd && event.pointerType === "mouse") setHoveredDate(dateValue);
                          }}
                          onClick={(event) => {
                            // Pointer selection is handled on release; keyboard and assistive clicks have no click count.
                            if (event.detail === 0) selectDate(dateValue);
                          }}
                          onKeyDown={(event) => handleDayKey(event, date)}
                          className={`relative mx-auto flex h-11 w-full max-w-11 touch-none items-center justify-center rounded-xl font-semibold transition-colors ${focusStyle} ${isEndpoint ? "bg-[#087f8c] font-bold text-white" : isDisabled ? "cursor-not-allowed text-[#b9c2c5]" : inRange ? "text-[#14636c]" : isToday ? "bg-[#eaf7f6] text-[#14636c] ring-1 ring-inset ring-[#a2d8d6] hover:bg-[#d8f0ee]" : "text-[#36464b] hover:bg-[#eaf7f6]"}`}
                        >
                          {date.getDate()}
                          {isToday && <span aria-hidden="true" className={`absolute bottom-1 h-1 w-1 rounded-full ${isEndpoint ? "bg-white" : "bg-[#087f8c]"}`} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex items-center justify-between border-t border-[#e6efef] pt-2">
            <span className="flex items-center gap-1.5 text-xs text-[#62696b]"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#087f8c]" />Today</span>
            <button type="button" disabled={disabled} onClick={() => { setMonth(parseDateValue(today)!); setFocusedDate(today); shouldFocusDay.current = true; }} className={`min-h-11 rounded-lg px-3 text-xs font-bold text-[#14636c] hover:bg-[#effafa] ${focusStyle}`}>Go to today</button>
          </div>
        </div>
      )}
      {value.start && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span role="status" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#14636c]">
            {value.end && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            {value.end ? "Preferred date range selected" : "Select an end date to complete your range"}
          </span>
          <button type="button" disabled={disabled} onClick={() => { onChange({ start: "", end: "" }); closeCalendar(); }} className={`min-h-10 shrink-0 rounded-lg px-2 text-xs font-semibold text-[#62696b] underline decoration-[#b5c4c7] underline-offset-4 hover:text-[#14636c] ${focusStyle}`}>Clear dates</button>
        </div>
      )}
    </div>
  );
}
