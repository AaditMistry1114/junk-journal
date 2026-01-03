import { useState } from "react";
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

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setDayEntries(getEntriesByDate(toLocalDateKey(date)));
  };

  const totalAmount = dayEntries.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">
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

        {/* ENTRIES */}
        <div className="bg-white rounded-3xl p-6 shadow overflow-y-auto">
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

          {!selectedDate ? (
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
              className="rounded-2xl p-4 mb-4 bg-white border
                         hover:shadow-md transition"
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
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={() => setPreviewImage(null)}
      >
        <div className="relative">
          <button
            className="absolute -top-10 right-0 text-white text-3xl"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </button>
      
          <img
            src={previewImage}
            className="max-h-[85vh] rounded-2xl bg-white"
          />
        </div>
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
