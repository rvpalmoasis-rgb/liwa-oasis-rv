"use client";

import { useState, useEffect } from "react";
import { getBookingNotes, addBookingNote } from "./actions";

export default function NotesModal({ 
  booking, 
  onClose 
}: { 
  booking: any, 
  onClose: () => void 
}) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadNotes() {
    setIsLoading(true);
    const data = await getBookingNotes(booking.id);
    setNotes(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, [booking.id]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addBookingNote(booking.id, newNote);
      setNewNote("");
      loadNotes(); // Refresh the list
    } catch (error: any) {
      alert("Error saving note: " + error.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Guest Notes</h2>
            <p className="text-green-100 text-sm">{booking.guests?.name} • Spot {booking.spot_code}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>

        {/* Notes List */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-gray-500 text-sm italic">No notes recorded yet.</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                <p className="text-gray-800 text-sm">{n.note}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(n.at).toLocaleString()} • {n.who}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Note Form */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a request or comment..."
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
            <button 
              type="submit" 
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}