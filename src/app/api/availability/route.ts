import { NextResponse } from "next/server";
import { parseDateOnly } from "@/lib/dates";
import { findAvailableRooms, AvailabilityError } from "@/lib/availability";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { checkIn, checkOut, guests } = body as {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };

  if (!checkIn || !checkOut || typeof guests !== "number") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  try {
    const rooms = await findAvailableRooms({
      checkIn: parseDateOnly(checkIn),
      checkOut: parseDateOnly(checkOut),
      guests,
    });
    return NextResponse.json({ rooms });
  } catch (err) {
    if (err instanceof AvailabilityError) {
      return NextResponse.json({ error: err.code }, { status: 400 });
    }
    console.error("[/api/availability]", err);
    return NextResponse.json(
      { error: "service_unavailable", hint: "Database not configured? Set DATABASE_URL and run npm run db:push && npm run db:seed." },
      { status: 503 },
    );
  }
}
