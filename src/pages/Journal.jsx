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

  const handleClose = () => {
    if (selectedDate) {
      setDayEntries(getEntriesByDate(selectedDate));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="journal-page">
      <Calendar
        onClickDay={handleDayClick}
        tileContent={({ date, view }) =>
          view === "month" && dateHasEntries(date) ? (
            <span className="calendar-entry-dot" />
          ) : null
        }
      />

      {dayEntries.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {dayEntries.map((e, i) => (
            <div key={i}>
              {e.foodName} — ₹{e.amount}
            </div>
          ))}
        </div>
      )}

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={handleClose}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default Journal;
