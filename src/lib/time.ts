import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatInTz(
  dateStr: string,
  tz: string,
  fmt = "MMM d, yyyy h:mm a"
): string {
  const zoned = toZonedTime(new Date(dateStr), tz);
  return format(zoned, fmt);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
