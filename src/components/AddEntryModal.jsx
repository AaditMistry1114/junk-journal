import { useState } from "react";
import { saveEntry } from "../utils/storage";
import "./AddEntryModal.css";

function AddEntryModal({ isOpen, onClose, selectedDate }) {
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen || !selectedDate) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!foodName || !amount) return;

    saveEntry({
      date: selectedDate.toISOString().split("T")[0],
      foodName,
      amount: Number(amount),
    });

    setFoodName("");
    setAmount("");
    onClose();
  };

  return (
    isOpen && (
      <>
        <div className="modal-overlay" onClick={onClose}></div>
  
        <div className="modal-content">
          <h2 className="modal-title">Add Food</h2>
  
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              placeholder="Food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
  
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
  
            <button type="submit" className="form-submit-button">
              Save
            </button>
  
            <button
              type="button"
              className="form-cancel-button"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </>
    )
  );
}  

export default AddEntryModal;
