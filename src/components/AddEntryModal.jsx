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
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Food</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Food name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit">Save</button>
        </form>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AddEntryModal;
