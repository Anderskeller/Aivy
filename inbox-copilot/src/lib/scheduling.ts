import { DateTime } from "luxon";
import { buildCalendarCreateUrl } from "@/lib/calendar";

export type Slot = { start: string; end: string; label: string; url: string };

export function nextBusinessDay(dt: DateTime): DateTime {
  let cur = dt;
  while (cur.weekday > 5) {
    cur = cur.plus({ days: 1 }).startOf("day");
  }
  return cur;
}

export function generateSchedulingSlots(params: {
  timezone: string;
  title: string;
  details?: string;
  days?: number;
  durationMinutes?: number;
}): Slot[] {
  const tz = params.timezone || "UTC";
  const days = params.days ?? 3;
  const duration = params.durationMinutes ?? 45;
  const now = DateTime.now().setZone(tz);

  const dailyTimes = [10, 14, 16]; // 10:00, 14:00, 16:00 local time
  const slots: Slot[] = [];
  let dayCursor = nextBusinessDay(now.plus({ days: 1 }).startOf("day"));

  for (let d = 0; d < days; d++) {
    const day = nextBusinessDay(dayCursor);
    for (const hour of dailyTimes) {
      const start = day.set({ hour, minute: 0, second: 0, millisecond: 0 });
      if (start < now) continue;
      const end = start.plus({ minutes: duration });
      const startUtc = start.toUTC();
      const endUtc = end.toUTC();
      const datesIso = `${startUtc.toFormat("yyyyLLdd'T'HHmmss'Z'")}/${endUtc.toFormat("yyyyLLdd'T'HHmmss'Z'")}`;
      const url = buildCalendarCreateUrl({
        text: params.title,
        details: params.details,
        datesIso,
      });
      slots.push({
        start: start.toISO()!,
        end: end.toISO()!,
        label: `${start.toFormat("ccc d LLL, HH:mm")} (${tz}) – ${duration}m`;
        url,
      });
      if (slots.length >= 3) return slots;
    }
    dayCursor = day.plus({ days: 1 }).startOf("day");
  }
  return slots.slice(0, 3);
}


