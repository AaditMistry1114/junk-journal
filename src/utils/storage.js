// Storage keys
const ENTRIES_KEY = 'junk-journal-entries'
const FOOD_SUGGESTIONS_KEY = 'junk-journal-food-suggestions'

// Helper to get all entries
export const getEntries = () => {
  try {
    const entries = localStorage.getItem(ENTRIES_KEY)
    return entries ? JSON.parse(entries) : []
  } catch (error) {
    console.error('Error reading entries from localStorage:', error)
    return []
  }
}

// Helper to format date to YYYY-MM-DD
export const formatDateToYYYYMMDD = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper to save an entry
export const saveEntry = (entry) => {
  try {
    const entries = getEntries()
    const newEntry = {
      id: entry.id || Date.now().toString(),
      date: entry.date, // YYYY-MM-DD format
      foodName: entry.foodName,
      amount: entry.amount,
      image: entry.image || null
    }
    entries.push(newEntry)
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
    return newEntry
  } catch (error) {
    console.error('Error saving entry to localStorage:', error)
    throw error
  }
}

// Helper to get entries for a specific date
export const getEntriesForDate = (date) => {
  const dateStr = formatDateToYYYYMMDD(date)
  const entries = getEntries()
  return entries.filter(entry => entry.date === dateStr)
}

// Helper to get all food suggestions
export const getFoodSuggestions = () => {
  try {
    const suggestions = localStorage.getItem(FOOD_SUGGESTIONS_KEY)
    return suggestions ? JSON.parse(suggestions) : []
  } catch (error) {
    console.error('Error reading food suggestions from localStorage:', error)
    return []
  }
}

// Helper to add a food suggestion (avoid duplicates, case-insensitive)
export const addFoodSuggestion = (foodName) => {
  try {
    const suggestions = getFoodSuggestions()
    const normalizedNewFood = foodName.trim().toLowerCase()
    
    // Check if food already exists (case-insensitive)
    const exists = suggestions.some(
      food => food.toLowerCase() === normalizedNewFood
    )
    
    if (!exists && normalizedNewFood) {
      suggestions.push(foodName.trim())
      localStorage.setItem(FOOD_SUGGESTIONS_KEY, JSON.stringify(suggestions))
    }
    
    return suggestions
  } catch (error) {
    console.error('Error saving food suggestion to localStorage:', error)
    throw error
  }
}

// Helper to check if a date has entries
export const dateHasEntries = (date) => {
  const dateStr = formatDateToYYYYMMDD(date)
  const entries = getEntries()
  return entries.some(entry => entry.date === dateStr)
}

