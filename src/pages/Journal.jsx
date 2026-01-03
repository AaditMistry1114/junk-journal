import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import AddEntryModal from "../components/AddEntryModal";
import {
  dateHasEntries,
  getEntriesByDate,
  deleteEntry,
} from "../utils/storage";
import { toLocalDateKey } from "../utils/date";

function Journal() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayEntries, setDayEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setDayEntries(getEntriesByDate(toLocalDateKey(date)));
  };

  const totalAmount = dayEntries.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  // ✅ Has user EVER added any entry
  const hasAnyEntries =
    JSON.parse(localStorage.getItem("junk_journal_entries"))?.length > 0;

  // ✅ Auto-hide tutorial forever once user adds first entry
  useEffect(() => {
    if (hasAnyEntries && showTutorial) {
      setShowTutorial(false);
    }
  }, [hasAnyEntries, showTutorial]);

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">

      {/* 📱 MOBILE ONBOARDING OVERLAY */}
      {showTutorial && !hasAnyEntries && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-end sm:hidden">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4">
            <div className="text-center">
              <p className="text-3xl mb-2">👋</p>
              <h3 className="text-lg font-semibold">
                Welcome to Junk Journal
              </h3>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Tap a date on the calendar to log what you ate.  
              Your habits and spending will appear here.
            </p>

            <button
              onClick={() => setShowTutorial(false)}
              className="w-full bg-pink-500 text-white py-3 rounded-xl"
            >
              Got it 👍
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CALENDAR */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <Calendar
            value={selectedDate}
            onClickDay={handleDayClick}
            tileContent={({ date, view }) =>
              view === "month" && dateHasEntries(toLocalDateKey(date)) ? (
                <span className="calendar-entry-dot" />
              ) : null
            }
          />

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Days with entries</span>
          </div>

          <button
            onClick={() => {
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            className="mt-6 w-full bg-pink-500 text-white py-3 rounded-xl"
          >
            + Add Food
          </button>
        </div>

        {/* ENTRIES / RIGHT PANEL */}
        <div className="bg-white rounded-3xl p-6 shadow overflow-y-auto">

          {/* SUMMARY */}
          {dayEntries.length > 0 && (
            <div className="mb-6 bg-pink-50 rounded-xl p-4 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="font-semibold">₹{totalAmount} spent</p>
              </div>
              <div className="text-pink-500 font-medium">
                {dayEntries.length} item(s)
              </div>
            </div>
          )}

          {/* DESKTOP ONBOARDING */}
          {!selectedDate && !hasAnyEntries ? (
            <div className="hidden sm:flex flex-col items-center justify-center h-full text-center text-gray-500 py-20">
              <p className="text-4xl mb-4">👋</p>
              <h3 className="text-lg font-semibold text-gray-700">
                Welcome to Junk Journal
              </h3>
              <p className="text-sm mt-2">
                Click a date on the calendar to log what you ate.
              </p>
              <p className="text-sm">
                Your habits and spending will appear here.
              </p>
            </div>

          ) : !selectedDate ? (

            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">📅 No date selected</p>
              <p className="text-sm mt-1">
                Click a date on the calendar to view entries
              </p>
            </div>

          ) : dayEntries.length === 0 ? (

            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">🍽 No entries yet</p>
              <p className="text-sm mt-1">
                Add what you ate on this day
              </p>
            </div>

          ) : (

            dayEntries.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl p-4 mb-4 bg-white border hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {e.foodName}
                  </span>
                  <span className="font-semibold text-pink-500">
                    ₹{e.amount}
                  </span>
                </div>

                <div className="flex gap-3 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingEntry(e);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-pink-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      deleteEntry(e.id);
                      setDayEntries(
                        getEntriesByDate(toLocalDateKey(selectedDate))
                      );
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>

                {e.image && (
                  <img
                    src={e.image}
                    onClick={() => setPreviewImage(e.image)}
                    className="mt-3 rounded-xl cursor-pointer"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-16 text-white text-3xl font-bold hover:opacity-80"
          >
            ×
          </button>

          <img
            src={previewImage}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
          if (selectedDate) {
            setDayEntries(
              getEntriesByDate(toLocalDateKey(selectedDate))
            );
          }
        }}
        selectedDate={selectedDate}
        editingEntry={editingEntry}
      />
    </div>
  );
}

export default Journal;
