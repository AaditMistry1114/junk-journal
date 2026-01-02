import { useState } from "react";
import { saveEntry } from "../utils/storage";
import "./AddEntryModal.css";

function AddEntryModal({ isOpen, onClose, selectedDate }) {
  const [foodName, setFoodName] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen || !selectedDate) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(file);              // stored for later phase
      setImagePreview(reader.result); // UI preview
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!foodName || !amount) return;

    saveEntry({
      date: selectedDate.toISOString().split("T")[0],
      foodName,
      amount: Number(amount),
      image: imagePreview || null,
    });
    

    // Reset form
    setFoodName("");
    setAmount("");
    setImage(null);
    setImagePreview(null);

    onClose();
  };

  const handleClose = () => {
    setFoodName("");
    setAmount("");
    setImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}></div>

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

          {/* IMAGE INPUT */}
          <div className="form-group">
            <label>Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* IMAGE PREVIEW */}
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
            onClick={handleClose}
          >
            Close
          </button>
        </form>
      </div>
    </>
  );
}

export default AddEntryModal;
