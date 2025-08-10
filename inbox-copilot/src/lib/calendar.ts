export function buildCalendarCreateUrl(params: {
  text: string;
  details?: string;
  datesIso: string; // 20250101T090000Z/20250101T093000Z
  location?: string;
}) {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.text);
  if (params.details) url.searchParams.set("details", params.details);
  if (params.location) url.searchParams.set("location", params.location);
  url.searchParams.set("dates", params.datesIso);
  return url.toString();
}


