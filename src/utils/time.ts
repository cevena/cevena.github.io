/** Convert hours and minutes to total minutes since midnight */
export function t(h: number, m: number): number {
  return h * 60 + m;
}

/** Format total minutes as "H:MM" */
export function fmt(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

/** Format total minutes as ICS time string "YYYYMMDDTHHMMSS" */
export function minsToIcs(mins: number, date: string): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${date}T${h}${m}00`;
}
