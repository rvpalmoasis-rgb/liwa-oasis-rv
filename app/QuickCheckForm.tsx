"use client";

import { useState } from "react";
import { checkAvailability, holdSpot } from "./actions";
import { useRouter } from "next/navigation";

export default function QuickCheckForm({ allSpots }: { allSpots: any[] }) {
  const router = useRouter();
  const [arrive, setArrive] = useState("");
  const [depart, setDepart] = useState("");
  const [searched, setSearched] = useState(false);
  const [bookedSpotCodes, setBookedSpotCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheck() {
    if (!arrive || !depart) {
      alert("Please select both dates.");
      return;
    }
    setIsLoading(true);
    try {
      const bookedCodes = await checkAvailability(arrive, depart);
      setBookedSpotCodes(bookedCodes);
      setSearched(true);
    } catch (error: any) {
      alert("Error checking availability: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleHold(spotCode: string) {
    if (!searched) {
      alert("Please search for dates first.");
      return;
    }
    
    if (!confirm(`Hold Spot ${spotCode} for ${arrive} to ${depart}?\n\nThis will lock the spot for 24 hours while you take the guest's details.`)) return;

    setIsLoading(true);
    try {
      const result = await holdSpot(spotCode, arrive, depart);
      router.push(`/new-booking?spot=${spotCode}&arrive=${arrive}&depart=${depart}&booking_id=${result.id}`);
    } catch (error: any) {
      alert("Error holding spot: " + error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-green-900">Quick Availability Check</h1>
        <p className="text-gray-600 mb-6">
          Enter the caller's dates. Then click any green spot to hold it and start a booking.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
            <input type="date" value={arrive} onChange={(e) => setArrive(e.target.value)} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <button onClick={handleCheck} disabled={isLoading} className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-md transition-colors h-[42px] w-full md:w-auto">
            {isLoading ? "Checking..." : "Check Spots"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          {searched ? `Results for ${arrive} to ${depart}` : "All RV Spots"}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allSpots.map((spot: any) => {
            const isBooked = bookedSpotCodes.includes(spot.code);
            let cardColor = "bg-green-50 border-green-200 text-green-800 cursor-pointer hover:bg-green-100 transition-colors";
            let statusText = "AVAILABLE";

            if (spot.status !== "active") {
              cardColor = "bg-gray-100 border-gray-300 text-gray-500";
              statusText = "MAINTENANCE";
            } else if (isBooked && searched) {
              cardColor = "bg-red-50 border-red-200 text-red-800";
              statusText = "BOOKED";
            }

            return (
              <div 
                key={spot.code} 
                onClick={() => !isBooked && spot.status === 'active' && handleHold(spot.code)}
                className={`p-4 rounded-lg text-center font-bold text-lg border-2 ${cardColor}`}
              >
                Spot {spot.code}
                <div className="text-xs font-normal mt-1 uppercase tracking-wider">{statusText}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}