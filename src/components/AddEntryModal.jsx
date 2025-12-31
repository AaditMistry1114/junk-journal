import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFoodSuggestions, addFoodSuggestion, saveEntry, formatDateToYYYYMMDD } from '../utils/storage'
import './AddEntryModal.css'

function AddEntryModal({ isOpen, onClose, selectedDate }) {
  const [foodSuggestions, setFoodSuggestions] = useState([])
  const [selectedFood, setSelectedFood] = useState('')
  const [isAddingNewFood, setIsAddingNewFood] = useState(false)
  const [newFoodName, setNewFoodName] = useState('')
  const [amount, setAmount] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load food suggestions when modal opens
  useEffect(() => {
    if (isOpen) {
      const suggestions = getFoodSuggestions()
      setFoodSuggestions(suggestions)
      setSelectedFood('')
      setIsAddingNewFood(false)
      setNewFoodName('')
      setAmount('')
      setImage(null)
      setImagePreview(null)
    }
  }, [isOpen])

  // Handle food selection change
  const handleFoodSelect = (e) => {
    const value = e.target.value
    if (value === '__add_new__') {
      setIsAddingNewFood(true)
      setSelectedFood('')
    } else {
      setIsAddingNewFood(false)
      setSelectedFood(value)
      setNewFoodName('')
    }
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result) // base64 string
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const foodNameToSave = isAddingNewFood ? newFoodName.trim() : selectedFood
    if (!foodNameToSave) {
      alert('Please enter or select a food name')
      return
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)

    try {
      // Save food suggestion if it's new
      if (isAddingNewFood && newFoodName.trim()) {
        addFoodSuggestion(newFoodName.trim())
      }

      // Save entry
      const entry = {
        date: formatDateToYYYYMMDD(selectedDate),
        foodName: foodNameToSave,
        amount: parseFloat(amount),
        image: image || null
      }

      saveEntry(entry)

      // Reset form and close
      setSelectedFood('')
      setIsAddingNewFood(false)
      setNewFoodName('')
      setAmount('')
      setImage(null)
      setImagePreview(null)
      
      onClose()
      
      // Trigger a custom event to notify Journal component to refresh
      window.dispatchEvent(new CustomEvent('entriesUpdated'))
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Error saving entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  // Format date for display
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={handleClose} className="modal-dialog">
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <div className="modal-container">
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Dialog.Panel>
                <div className="modal-header">
                  <Dialog.Title className="modal-title">Add Food Entry</Dialog.Title>
                  <button
                    className="modal-close-button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  {/* Selected Date Display */}
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <div className="form-date-display">{formattedDate}</div>
                  </div>

                  {/* Food Name Selector */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="food-select">
                      Food Name *
                    </label>
                    {!isAddingNewFood ? (
                      <select
                        id="food-select"
                        value={selectedFood}
                        onChange={handleFoodSelect}
                        className="form-select"
                        required
                      >
                        <option value="">Select a food...</option>
                        {foodSuggestions.map((food, index) => (
                          <option key={index} value={food}>
                            {food}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add new food</option>
                      </select>
                    ) : (
                      <div className="form-new-food">
                        <input
                          type="text"
                          value={newFoodName}
                          onChange={(e) => setNewFoodName(e.target.value)}
                          placeholder="Enter new food name"
                          className="form-input"
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewFood(false)
                            setNewFoodName('')
                            setSelectedFood('')
                          }}
                          className="form-cancel-button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Amount Input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="amount-input">
                      Amount Spent ($) *
                    </label>
                    <input
                      id="amount-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="image-input">
                      Image (optional)
                    </label>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-file-input"
                    />
                    {imagePreview && (
                      <motion.div
                        className="form-image-preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null)
                            setImagePreview(null)
                          }}
                          className="form-image-remove"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="form-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Entry'}
                  </button>
                </form>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default AddEntryModal

