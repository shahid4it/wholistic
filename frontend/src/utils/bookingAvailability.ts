export type Availability = { slots: string[]; taken: string[] };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * A reader's time slots (edited on the reader in Strapi) and the ones already
 * booked on `date`. Returns null if the reader or date is invalid, or Strapi
 * can't be reached.
 */
export async function getAvailability(reader: string, date: string): Promise<Availability | null> {
  if (!reader || !DATE_RE.test(date)) return null;
  const qs = new URLSearchParams({ reader, date });
  try {
    const res = await fetch(`${process.env.STRAPI_URL}/api/bookings/availability?${qs}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      slots: Array.isArray(data?.slots) ? data.slots : [],
      taken: Array.isArray(data?.taken) ? data.taken : [],
    };
  } catch {
    return null;
  }
}
