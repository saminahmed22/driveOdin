export function formatReadableDate(isoString) {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(/am|pm/, (m) => m.toUpperCase());
}
