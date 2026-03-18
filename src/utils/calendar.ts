import { minsToIcs } from "./time";

export interface CalendarEvent {
  title: string;
  location: string;
  description: string;
  /** ICS date format: "YYYYMMDD" */
  date: string;
  /** IANA timezone, e.g. "America/Toronto" */
  timezone: string;
  /** Start time in minutes since midnight */
  startMins: number;
  /** End time in minutes since midnight */
  endMins: number;
}

export interface ScheduleItem {
  start: number;
  end: number;
  title: string;
  speaker: string;
}

export interface CalendarLinks {
  gcalUrl: string;
  outlookUrl: string;
  icsUri: string;
}

/** Generate Google Calendar, Outlook, and .ics links for a single event */
export function generateCalendarLinks(event: CalendarEvent): CalendarLinks {
  const icsStart = minsToIcs(event.startMins, event.date);
  const icsEnd = minsToIcs(event.endMins, event.date);
  const isoDate = `${event.date.slice(0, 4)}-${event.date.slice(4, 6)}-${event.date.slice(6, 8)}`;
  const startH = Math.floor(event.startMins / 60).toString().padStart(2, "0");
  const startM = (event.startMins % 60).toString().padStart(2, "0");
  const endH = Math.floor(event.endMins / 60).toString().padStart(2, "0");
  const endM = (event.endMins % 60).toString().padStart(2, "0");

  const gcalUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${icsStart}/${icsEnd}`,
    ctz: event.timezone,
    location: event.location,
    details: event.description,
  })}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?${new URLSearchParams({
    subject: event.title,
    startdt: `${isoDate}T${startH}:${startM}:00`,
    enddt: `${isoDate}T${endH}:${endM}:00`,
    location: event.location,
    body: event.description,
  })}`;

  return { gcalUrl, outlookUrl, icsUri: "" };
}

/** Generate a multi-event .ics data URI from a schedule */
export function generateScheduleIcs(
  schedule: ScheduleItem[],
  opts: {
    date: string;
    timezone: string;
    location: string;
    prefix: string;
    breakTitles?: Set<string>;
  },
): string {
  const breaks = opts.breakTitles ?? new Set(["Lunch", "Break"]);

  const events = schedule
    .filter((s) => !breaks.has(s.title))
    .map((s) => {
      const summary = s.speaker ? `${s.title} — ${s.speaker}` : s.title;
      return [
        "BEGIN:VEVENT",
        `DTSTART;TZID=${opts.timezone}:${minsToIcs(s.start, opts.date)}`,
        `DTEND;TZID=${opts.timezone}:${minsToIcs(s.end, opts.date)}`,
        `SUMMARY:${opts.prefix}: ${summary}`,
        `LOCATION:${opts.location}`,
        "END:VEVENT",
      ].join("\r\n");
    });

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${opts.prefix}//Workshop//EN`,
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
