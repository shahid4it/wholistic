import { getAvailability } from "@/utils/bookingAvailability";

// GET /api/booking/availability?reader=<slug>&date=YYYY-MM-DD -> { slots, taken }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await getAvailability(searchParams.get("reader") ?? "", searchParams.get("date") ?? "");
  return Response.json(data ?? { error: "Could not load time slots" }, {
    status: data ? 200 : 400,
    headers: { "cache-control": "no-store" },
  });
}
