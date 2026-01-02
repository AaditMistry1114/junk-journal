import { useEffect, useState } from "react";
import { saveEntry } from "../utils/storage";
import { toLocalDateKey } from "../utils/date";
import "./AddEntryModal.css";

function AddEntryModal({ isOpen, onClose, selectedDate, editingEntry }) {
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ STABLE useEffect (NO conditional deps)
  useEffect(() => {
    if (editingEntry) {
      setFoodName(editingEntry.foodName || "");
      setAmount(editingEntry.amount || "");
      setImagePreview(editingEntry.image || null);
    } else {
      setFoodName("");
      setAmount("");
      setImagePreview(null);
    }
  }, [editingEntry, isOpen]); // <-- CONSTANT SIZE

  if (!isOpen || !selectedDate) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !amount) return;

    saveEntry({
      id: editingEntry?.id || crypto.randomUUID(),
      date: toLocalDateKey(selectedDate),
      foodName,
      amount: Number(amount),
      image: imagePreview || null,
    });

    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal-content">
        <h2 className="modal-title">
          {editingEntry ? "Edit Food" : "Add Food"}
        </h2>

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

          <div className="form-group">
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "12px",
                marginTop: "12px",
                objectFit: "cover",
              }}
            />
          )}

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
  );
}

export default AddEntryModal;
