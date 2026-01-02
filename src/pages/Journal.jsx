import { useState } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import AddEntryModal from "../components/AddEntryModal";
import {
  dateHasEntries,
  getEntriesByDate,
} from "../utils/storage";

function Journal() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayEntries, setDayEntries] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  // ✅ TOTAL AMOUNT
  const totalAmount = dayEntries.reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0
  );

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setDayEntries(getEntriesByDate(date));
  };

  // ✅ SAFE DELETE (BY INDEX + DATE)
  const handleDelete = (indexInDay) => {
    if (!confirm("Delete this entry?")) return;

    const all =
      JSON.parse(localStorage.getItem("junk_journal_entries")) || [];

    const dateKey = selectedDate.toISOString().split("T")[0];

    let count = -1;

    const updated = all.filter((entry) => {
      if (entry.date !== dateKey) return true;

      count++;
      return count !== indexInDay;
    });

    localStorage.setItem(
      "junk_journal_entries",
      JSON.stringify(updated)
    );

    setDayEntries(getEntriesByDate(selectedDate));
  };

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-6 sm:gap-10">

        {/* LEFT: CALENDAR */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg">
          <Calendar
            value={selectedDate}
            onClickDay={handleDayClick}
            tileContent={({ date, view }) =>
              view === "month" && dateHasEntries(date) ? (
                <span className="calendar-entry-dot" />
              ) : null
            }
          />

          <button
            onClick={() => {
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl"
          >
            + Add Food
          </button>
        </div>

        {/* RIGHT: ENTRIES */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-lg max-h-[620px] overflow-y-auto">

          {/* TODAY SUMMARY */}
          {dayEntries.length > 0 && (
            <div className="mb-6 rounded-xl bg-pink-50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{totalAmount} spent
                </p>
              </div>
              <div className="text-sm text-pink-500 font-medium">
                {dayEntries.length} item{dayEntries.length > 1 ? "s" : ""}
              </div>
            </div>
          )}

          <h3 className="text-xl font-semibold mb-6">Entries</h3>

          {dayEntries.length === 0 ? (
            <p className="text-gray-400">Select a date to view entries</p>
          ) : (
            <div className="space-y-4">
              {dayEntries.map((e, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{e.foodName}</span>

                    <div className="flex items-center gap-3">
                      <span className="text-pink-500 font-semibold">
                        ₹{e.amount}
                      </span>

                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditingEntry(e);
                          setIsModalOpen(true);
                        }}
                        className="text-sm text-gray-400 hover:text-pink-500"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(i)}
                        className="text-sm text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {e.image && (
                    <img
                      src={e.image}
                      alt={e.foodName}
                      onClick={() => setPreviewImage(e.image)}
                      className="w-full h-48 sm:h-56 object-contain rounded-xl bg-gray-50
                                 cursor-pointer hover:scale-[1.03] transition"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-4xl font-bold hover:scale-110 transition"
            >
              ×
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[85vh] object-contain rounded-xl bg-white"
            />
          </div>
        </div>
      )}

      {/* MODAL */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
          setDayEntries(
            selectedDate ? getEntriesByDate(selectedDate) : []
          );
        }}
        selectedDate={selectedDate}
        editingEntry={editingEntry}
      />
    </div>
  );
}

export default Journal;
