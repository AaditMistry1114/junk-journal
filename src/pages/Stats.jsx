import { useMemo, useState } from "react";

function getLatestMonth(entries) {
  if (!entries.length) return new Date().toISOString().slice(0, 7);

  const latestDate = entries
    .map(e => e.date)
    .sort()
    .at(-1);

  return latestDate.slice(0, 7);
}

function Stats() {
  const allEntries =
    JSON.parse(localStorage.getItem("junk_journal_entries")) || [];

  const [selectedMonth, setSelectedMonth] = useState(
    getLatestMonth(allEntries)
  );

  const monthEntries = useMemo(() => {
    return allEntries.filter(
      e => e.date && e.date.slice(0, 7) === selectedMonth
    );
  }, [allEntries, selectedMonth]);

  const totalSpent = monthEntries.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const foodSpendData = Object.entries(
    monthEntries.reduce((acc, e) => {
      acc[e.foodName] = (acc[e.foodName] || 0) + Number(e.amount || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Stats</h2>

        <div className="bg-white rounded-xl p-4 shadow">
          <label className="text-sm text-gray-500 block mb-2">
            Select month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="text-xl font-semibold text-pink-500">
            ₹{totalSpent}
          </p>

          {foodSpendData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data</p>
          ) : (
            <ul className="space-y-1">
              {foodSpendData.map(item => (
                <li key={item.name} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>₹{item.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;
