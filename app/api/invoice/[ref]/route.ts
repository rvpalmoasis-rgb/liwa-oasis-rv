import { supabaseAdmin } from "../../../supabase";
import { renderToStream } from "@react-pdf/renderer";
import InvoiceDocument from "../../../InvoiceDocument";
import { NextResponse } from "next/server";
import React from "react";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const resolvedParams = await params;
  
  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("*, guests(name, phone, email)")
    .eq("ref", resolvedParams.ref)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const doc = React.createElement(InvoiceDocument, { booking });
  const stream = await renderToStream(doc);

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Invoice-${booking.ref}.pdf"`,
    },
  });
}