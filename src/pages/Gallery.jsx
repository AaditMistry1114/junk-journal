import { useState } from "react";

function Gallery() {
  const allEntries =
    JSON.parse(localStorage.getItem("junk_journal_entries")) || [];

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Only entries that have images (with month filter)
  const images = allEntries.filter(
    (e) =>
      e.image &&
      (!selectedMonth || e.date.startsWith(selectedMonth))
  );

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Junk Gallery
          </h2>
          <p className="text-gray-500 mt-1">
            A visual history of your cravings 📸
          </p>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <label className="text-sm text-gray-500">
            Filter by month
          </label>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <p className="text-sm text-gray-400">
          Images are automatically saved when you add food photos in your journal
        </p>

        {/* CONTENT */}
        {images.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow text-center">
            <p className="text-4xl mb-4">📸</p>
            <p className="text-gray-500">
              No junk memories yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Images you add in Journal will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow">

            {/* ✅ ADDED LINE (context) */}
            <p className="text-sm text-gray-500 mb-3">
              Showing {images.length} memor{images.length === 1 ? "y" : "ies"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {images.map((e) => (
                <div
                  key={e.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group ring-1 ring-black/5"
                  onClick={() => setPreviewImage(e.image)}
                >
                  <img
                    src={e.image}
                    alt={e.foodName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/55 text-white text-xs p-2">
                    <p className="font-medium truncate">
                      {e.foodName}
                    </p>
                    <p className="opacity-80">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-3xl font-bold"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </button>

          <a
            href={previewImage}
            download
            className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/90 text-black px-3 py-1 rounded-lg text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>

          <img
            src={previewImage}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Gallery;
