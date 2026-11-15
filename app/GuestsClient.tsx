"use client";

import { useState, useEffect } from "react";
import { searchGuests } from "./actions";

export default function GuestsClient() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial list on mount
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await searchGuests("");
      setGuests(data);
      setIsLoading(false);
    }
    load();
  }, []);

  // Handle search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const data = await searchGuests(query);
    setGuests(data);
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Guest Directory</h1>
          <p className="text-gray-500 mt-1">Search your database of previous guests.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or phone number..."
          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
        <button 
          type="submit" 
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Phone (WhatsApp)</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">First Stay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Searching...</td></tr>
            ) : guests.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No guests found.</td></tr>
            ) : (
              guests.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{g.name}</td>
                  <td className="p-4 text-gray-600 font-mono text-sm">{g.phone}</td>
                  <td className="p-4 text-gray-600">{g.email || "-"}</td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(g.first_seen).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}