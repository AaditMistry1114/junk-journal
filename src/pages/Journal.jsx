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
    <div className="journal-page">
      <div className="journal-container">
        {/* CALENDAR CARD */}
        <div className="journal-calendar-wrapper">
          <Calendar
            onClickDay={handleDayClick}
            className="journal-calendar"
            tileContent={({ date, view }) =>
              view === "month" && dateHasEntries(date) ? (
                <span className="calendar-entry-dot" />
              ) : null
            }
          />
        </div>

        {/* TEXT CONFIRMATION BELOW CALENDAR */}
        {dayEntries.length > 0 && (
          <div className="day-entries">
            <h3>Entries</h3>
            {dayEntries.map((e, i) => (
              <div key={i} className="day-entry">
                {e.foodName} — ₹{e.amount}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default Journal;
