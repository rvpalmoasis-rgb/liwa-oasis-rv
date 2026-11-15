"use client";

import { useState } from "react";
import { createBooking } from "./actions";
import { useRouter } from "next/navigation";

export default function NewBookingForm({ allSpots }: { allSpots: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form state
  const [form, setForm] = useState({
    name: "", phone: "", email: "", arrive: "", depart: "", spot_code: "", price_aed: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await createBooking(form);
      alert("Booking saved successfully!");
      router.push("/"); // Go back to quick check
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-900 border-b pb-4">Create New Booking</h1>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
          <strong>Booking Failed:</strong> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (WhatsApp)</label>
            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
            <input required type="date" value={form.arrive} onChange={e => setForm({...form, arrive: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <input required type="date" value={form.depart} onChange={e => setForm({...form, depart: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Spot</label>
            <select required value={form.spot_code} onChange={e => setForm({...form, spot_code: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Select a spot...</option>
              {allSpots.map((s: any) => (
                <option key={s.code} value={s.code}>Spot {s.code}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-1">Agreed Price (AED)</label>
          <input required type="number" value={form.price_aed} onChange={e => setForm({...form, price_aed: e.target.value})} placeholder="e.g. 360" className="w-full md:w-1/3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
        </div>

        <div className="pt-6">
          <button disabled={isLoading} type="submit" className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-md w-full transition-colors">
            {isLoading ? "Saving..." : "Save Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}