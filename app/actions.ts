"use server";

import { supabaseAdmin } from "./supabase";

// 1. Check Availability (Includes pending holds)
export async function checkAvailability(arrive: string, depart: string) {
  try {
    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select("spot_code")
      .in("status", ["confirmed", "checked_in", "pending"])
      .lt("arrive", depart)
      .gt("depart", arrive);

    if (error) return [];
    return bookings.map((b: any) => b.spot_code).filter(Boolean);
  } catch (err) {
    return [];
  }
}

// 2. Hold a Spot
export async function holdSpot(spotCode: string, arrive: string, depart: string) {
  let { data: guest } = await supabaseAdmin
    .from("guests")
    .select("id")
    .eq("phone", "HOLD")
    .single();

  if (!guest) {
    const { data: newGuest } = await supabaseAdmin
      .from("guests")
      .insert({ name: "HOLD", phone: "HOLD", email: "hold@temp.com" })
      .select("id")
      .single();
    guest = newGuest;
  }

  const ref = `HOLD-${Date.now()}`;
  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .insert({
      ref: ref,
      guest_id: guest.id,
      service: "rv",
      arrive: arrive,
      depart: depart,
      spot_code: spotCode,
      status: "pending",
      price_aed: 0
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return booking;
}

// 3. Convert Hold to Real Booking
export async function convertHoldToBooking(holdId: string, formData: any) {
  let { data: guest } = await supabaseAdmin
    .from("guests")
    .select("id")
    .eq("phone", formData.phone)
    .single();

  if (!guest) {
    const { data: newGuest } = await supabaseAdmin
      .from("guests")
      .insert({ name: formData.name, phone: formData.phone, email: formData.email })
      .select("id")
      .single();
    guest = newGuest;
  }

  const ref = `LORV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({
      ref: ref,
      guest_id: guest.id,
      arrive: formData.arrive,
      depart: formData.depart,
      spot_code: formData.spot_code,
      price_aed: formData.price_aed,
      status: "confirmed",
      cancellation_ack: true
    })
    .eq("id", holdId);

  if (error) throw new Error(error.message);
}

// 4. Create Standard Booking
export async function createBooking(formData: any) {
  let { data: guest } = await supabaseAdmin
    .from("guests")
    .select("id")
    .eq("phone", formData.phone)
    .single();

  if (!guest) {
    const { data: newGuest, error: guestError } = await supabaseAdmin
      .from("guests")
      .insert({ name: formData.name, phone: formData.phone, email: formData.email })
      .select("id")
      .single();
    if (guestError) throw new Error("Could not create guest: " + guestError.message);
    guest = newGuest;
  }

  const ref = `LORV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("bookings")
    .insert({
      ref: ref,
      guest_id: guest.id,
      service: "rv",
      arrive: formData.arrive,
      depart: formData.depart,
      spot_code: formData.spot_code,
      status: "confirmed",
      price_aed: formData.price_aed,
      cancellation_ack: true
    })
    .select()
    .single();

  if (bookingError) throw new Error(bookingError.message);
  return booking;
}

// 5. Guest Auto-Lookup
export async function lookupGuestByPhone(phone: string) {
  if (!phone || phone.length < 5) return null;
  const { data } = await supabaseAdmin
    .from("guests")
    .select("name, email")
    .eq("phone", phone)
    .neq("phone", "HOLD")
    .single();
  return data || null;
}

// 6. Get Today's Bookings
export async function getTodaysBookings() {
  const today = new Date().toISOString().split("T")[0];

  const { data: arriving } = await supabaseAdmin
    .from("bookings")
    .select("*, guests(name, phone)")
    .eq("arrive", today)
    .eq("status", "confirmed");

  const { data: inHouse } = await supabaseAdmin
    .from("bookings")
    .select("*, guests(name, phone)")
    .eq("status", "checked_in");

  const { data: leaving } = await supabaseAdmin
    .from("bookings")
    .select("*, guests(name, phone)")
    .eq("depart", today)
    .eq("status", "checked_in");

  return { arriving: arriving || [], inHouse: inHouse || [], leaving: leaving || [] };
}

// 7. Update Status
export async function updateBookingStatus(bookingId: number, newStatus: string) {
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}

// 8. Record Payment
export async function recordPayment(bookingId: number, amount: number) {
  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ paid_aed: amount })
    .eq("id", bookingId);
  if (error) throw new Error(error.message);
}

// 9. Notes
export async function getBookingNotes(bookingId: number) {
  const { data, error } = await supabaseAdmin
    .from("booking_notes")
    .select("*")
    .eq("booking_id", bookingId)
    .order("at", { ascending: false });
  if (error) return [];
  return data;
}

export async function addBookingNote(bookingId: number, note: string) {
  const { error } = await supabaseAdmin
    .from("booking_notes")
    .insert({ booking_id: bookingId, note: note, who: "Supervisor" });
  if (error) throw new Error(error.message);
}

// 10. Guests Search
export async function searchGuests(query: string) {
  let request = supabaseAdmin
    .from("guests")
    .select("*")
    .neq("phone", "HOLD")
    .order("first_seen", { ascending: false });

  if (query) {
    request = request.or(`name.ilike.%${query}%,phone.ilike.%${query}%`);
  }

  const { data, error } = await request.limit(50);
  if (error) return [];
  return data;
}