import { supabaseAdmin } from "../../supabase";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: Promise<{ ref: string }> }) {
  // In Next.js 16, params must be awaited
  const resolvedParams = await params;
  const ref = resolvedParams.ref;

  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("*, guests(name, phone, email)")
    .eq("ref", ref)
    .single();

  if (error || !booking) {
    return (
      <div className="p-8 text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error Loading Invoice</h1>
        <p><strong>Database Error:</strong> {error?.message || "Booking not found"}</p>
        <p><strong>Looking for ref:</strong> {ref || "STILL EMPTY"}</p>
        <Link href="/today" className="text-blue-500 hover:underline mt-4 block">Back to Today</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/today" className="text-green-700 hover:underline flex items-center gap-2">
          &larr; Back to Today
        </Link>
        <a 
          href={`/api/invoice/${booking.ref}`} 
          target="_blank"
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-bold transition-colors shadow-sm"
        >
          Download / Print PDF
        </a>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-green-900">LIWA OASIS RV CAMP</h1>
          <p className="text-gray-500">Invoice: {booking.ref}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-bold text-gray-700 mb-1">Billed To:</p>
            <p className="text-gray-900 font-medium text-lg">{booking.guests?.name}</p>
            <p className="text-gray-600">{booking.guests?.phone}</p>
            <p className="text-gray-600">{booking.guests?.email}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-700 mb-1">Details:</p>
            <p className="text-gray-900 font-medium text-lg">Spot {booking.spot_code}</p>
            <p className="text-gray-600">{booking.arrive} to {booking.depart}</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-4 flex justify-between font-bold text-xl text-gray-900">
          <span>Total Amount:</span>
          <span>{booking.price_aed} AED</span>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${booking.paid_aed >= booking.price_aed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {booking.paid_aed >= booking.price_aed ? 'PAID IN FULL' : 'UNPAID'}
          </span>
        </div>
      </div>
    </div>
  );
}