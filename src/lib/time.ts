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
