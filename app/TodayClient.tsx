"use client";

import { useState, useEffect } from "react";
import { getTodaysBookings, updateBookingStatus, recordPayment } from "./actions";
import NotesModal from "./NotesModal";
import Link from "next/link";

export default function TodayClient() {
  const [data, setData] = useState<{ arriving: any[], inHouse: any[], leaving: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getTodaysBookings();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    if (!confirm("Are you sure you want to change this booking status?")) return;
    try {
      await updateBookingStatus(id, status);
      loadData(); // Refresh the lists
    } catch (error: any) {
      alert("Error updating status: " + error.message);
    }
  }

  async function handlePayment(booking: any) {
    const amountStr = prompt(`Enter amount paid (Total due: ${booking.price_aed} AED):`, booking.price_aed.toString());
    if (!amountStr) return;
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      await recordPayment(booking.id, amount);
      alert("Payment recorded successfully!");
      loadData(); // Refresh the list
    } catch (error: any) {
      alert("Error recording payment: " + error.message);
    }
  }

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading today's schedule...</div>;

  return (
    <div className="space-y-8 relative">
      <h1 className="text-3xl font-bold text-green-900">Today's Schedule</h1>

      {/* Arriving */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-green-50 px-4 py-3 border-b border-green-100">
          <h2 className="text-lg font-bold text-green-800">Arriving Today ({data?.arriving.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data?.arriving.length === 0 && <div className="p-4 text-gray-500 text-sm">No arrivals scheduled.</div>}
          {data?.arriving.map((b) => (
            <div key={b.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <div className="font-bold text-gray-900">{b.guests?.name}</div>
                <div className="text-sm text-gray-500">{b.guests?.phone} • Spot {b.spot_code}</div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handlePayment(b)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Pay
                </button>
                <Link href={`/invoice/${b.ref}`} target="_blank" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors border border-gray-300">
                  Invoice
                </Link>
                <button onClick={() => handleStatusChange(b.id, 'checked_in')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Check In
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaving */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
          <h2 className="text-lg font-bold text-orange-800">Leaving Today ({data?.leaving.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data?.leaving.length === 0 && <div className="p-4 text-gray-500 text-sm">No departures scheduled.</div>}
          {data?.leaving.map((b) => (
            <div key={b.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <div className="font-bold text-gray-900">{b.guests?.name}</div>
                <div className="text-sm text-gray-500">Spot {b.spot_code}</div>
              </div>
              <button onClick={() => handleStatusChange(b.id, 'checked_out')} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                Check Out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* In House */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <h2 className="text-lg font-bold text-blue-800">Currently In House ({data?.inHouse.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data?.inHouse.length === 0 && <div className="p-4 text-gray-500 text-sm">No guests currently in house.</div>}
          {data?.inHouse.map((b) => (
            <div key={b.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <div className="font-bold text-gray-900">{b.guests?.name}</div>
                <div className="text-sm text-gray-500">Spot {b.spot_code} • Departs {b.depart}</div>
              </div>
              
              <button onClick={() => setSelectedBooking(b)} className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-4 py-2 rounded bg-blue-50 transition-colors">
                Notes
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Modal */}
      {selectedBooking && (
        <NotesModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}

    </div>
  );
}