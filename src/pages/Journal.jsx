import { useState } from "react";
import Calendar from "react-calendar";
import AddEntryModal from "../components/AddEntryModal";
import { dateHasEntries, getEntriesByDate } from "../utils/storage";
import "react-calendar/dist/Calendar.css";
import "./Journal.css";

function Journal() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayEntries, setDayEntries] = useState([]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setDayEntries(getEntriesByDate(date));
    setIsModalOpen(true);
  };

  return (
    <div className="journal-page bg-red-200 p-10">
      <div className="journal-container">
  
        {/* Tailwind layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-6">
  
          {/* LEFT: CALENDAR */}
          <div className="lg:w-1/2">
            <div className="journal-calendar-wrapper">
              <Calendar
                onClickDay={(date) => {
                  setSelectedDate(date);
                  setDayEntries(getEntriesByDate(date));
                }}
                className="journal-calendar"
                tileContent={({ date, view }) =>
                  view === "month" && dateHasEntries(date) ? (
                    <span className="calendar-entry-dot" />
                  ) : null
                }
              />
            </div>
          </div>
  
          {/* RIGHT: ENTRIES */}
          <div className="lg:w-1/2 flex flex-col">
            {selectedDate ? (
              <>
                {/* Add Food Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mb-4 self-start rounded-xl bg-pink-500 px-4 py-2 text-white font-medium hover:bg-pink-600 transition"
                >
                  + Add Food
                </button>
  
                {/* Entries */}
                {dayEntries.length > 0 ? (
                  <div className="day-entries">
                    {dayEntries.map((e, i) => (
                      <div key={i} className="food-card">
                        <div className="food-card-header">
                          {e.foodName}
                        </div>
  
                        {e.image && (
                          <div className="food-card-image">
                            <img src={e.image} alt={e.foodName} />
                          </div>
                        )}
  
                        <div className="food-card-footer">
                          ₹{e.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-4">
                    No entries for this day.
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400">
                Select a date to view entries
              </div>
            )}
          </div>
  
        </div>
      </div>
  
      {/* ADD MODAL */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
  export default Journal;
