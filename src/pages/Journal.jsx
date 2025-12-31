import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { motion } from 'framer-motion'
import 'react-calendar/dist/Calendar.css'
import AddEntryModal from '../components/AddEntryModal'
import { dateHasEntries } from '../utils/storage'
import './Journal.css'

function Journal() {
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entriesUpdated, setEntriesUpdated] = useState(0) // Force re-render when entries change

  // Listen for entries updates
  useEffect(() => {
    const handleEntriesUpdate = () => {
      setEntriesUpdated(prev => prev + 1)
    }
    
    window.addEventListener('entriesUpdated', handleEntriesUpdate)
    return () => {
      window.removeEventListener('entriesUpdated', handleEntriesUpdate)
    }
  }, [])

  // Handle date click - open modal
  const handleTileClick = (value) => {
    setSelectedDate(value)
    setIsModalOpen(true)
  }

  // Custom tile content to add "+" icon and entry dot to each day
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasEntries = dateHasEntries(date)
      return (
        <>
          <span className="calendar-tile-add">+</span>
          {hasEntries && <span className="calendar-entry-dot" />}
        </>
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
            value={date}
            tileContent={tileContent}
            calendarType="gregory"
            className="journal-calendar"
            onClickDay={handleTileClick}
          />
        </motion.div>
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate || new Date()}
      />
    </motion.div>
  )
}

export default Journal
