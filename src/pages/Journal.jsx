import { useState } from 'react'
import Calendar from 'react-calendar'
import { motion } from 'framer-motion'
import 'react-calendar/dist/Calendar.css'
import './Journal.css'

function Journal() {
  const [date, setDate] = useState(new Date())

  const handleDateChange = (newDate) => {
    setDate(newDate)
  }

  // Custom tile content to add "+" icon to each day
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      return (
        <span className="calendar-tile-add">+</span>
      )
    }
    return null
  }

  return (
    <motion.div
      className="journal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="journal-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileContent={tileContent}
            calendarType="gregory"
            className="journal-calendar"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Journal
