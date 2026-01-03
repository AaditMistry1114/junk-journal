import { useMemo, useState, useLayoutEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ---------- helpers ---------- */
function getLatestMonth(entries) {
  if (!entries.length) return new Date().toISOString().slice(0, 7);

  const latestDate = entries
    .map((e) => e.date)
    .sort()
    .at(-1);

  return latestDate.slice(0, 7);
}

const COLORS = [
  "#ec4899",
  "#fb7185",
  "#f97316",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
];

/* ALWAYS visible labels */
const renderLabel = ({ name, value }) => {
  return `${name}: ₹${value}`;
};

function getPreviousMonth(month) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1);
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 7);
}

/* ---------- component ---------- */
function Stats() {
  const allEntries =
    JSON.parse(localStorage.getItem("junk_journal_entries")) || [];

  const [selectedMonth, setSelectedMonth] = useState(
    getLatestMonth(allEntries)
  );

  const [chartReady, setChartReady] = useState(false);

  // ✅ Fix React 18 StrictMode fake render issue
  useLayoutEffect(() => {
    setChartReady(true);
  }, []);

  const monthEntries = useMemo(() => {
    return allEntries.filter(
      (e) => e.date && e.date.slice(0, 7) === selectedMonth
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

  const totalItems = monthEntries.length;

  const topItem =
    foodSpendData.length > 0
      ? foodSpendData.reduce((max, item) =>
          item.value > max.value ? item : max
        )
      : null;

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Stats</h2>

        {/* Month Picker */}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-pink-50 rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Total spent</p>
            <p className="text-2xl font-bold text-pink-500">
              ₹{totalSpent}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Items</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Top item</p>
            <p className="text-base font-semibold">
              {topItem ? topItem.name : "—"}
            </p>
            {topItem && (
              <p className="text-sm text-gray-500">
                ₹{topItem.value}
              </p>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-4 shadow min-w-0 min-h-0">
          <p className="text-sm text-gray-500 mb-4">
            Spending distribution
          </p>

          {!chartReady || foodSpendData.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No data for this month
            </p>
          ) : (
            <div className="w-full h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={foodSpendData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    label={renderLabel}
                    labelLine={false}
                    isAnimationActive={true}
                  >
                    {foodSpendData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stats;
