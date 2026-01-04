import { useMemo, useState, useLayoutEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ---------- DATE HELPERS ---------- */
function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getLatestMonth(entries) {
  if (!entries.length) return new Date().toISOString().slice(0, 7);

  const latestDate = entries
    .map((e) => e.date)
    .sort()
    .at(-1);

  return getMonthKey(latestDate);
}

function getPreviousMonth(month) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

/* ---------- CHART ---------- */
const COLORS = [
  "#ec4899",
  "#fb7185",
  "#f97316",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
];

const renderLabel = ({ name, value }) => `${name}: ₹${value}`;

/* ---------- COMPONENT ---------- */
function Stats() {
  const allEntries =
    JSON.parse(localStorage.getItem("junk_journal_entries")) || [];

  /* 🔥 STREAK LOGIC */
  const { noJunkStreak, junkStreak, bestStreak } = useMemo(() => {
    if (allEntries.length === 0) {
      return { noJunkStreak: 0, junkStreak: 0, bestStreak: 0 };
    }

    const junkDaysSet = new Set(allEntries.map((e) => e.date));

    // 1️⃣ No-junk streak
    let noJunkStreak = 0;
    let cursor = new Date();
    while (!junkDaysSet.has(toDateKey(cursor))) {
      noJunkStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // 2️⃣ Junk streak
    let junkStreak = 0;
    cursor = new Date();
    while (junkDaysSet.has(toDateKey(cursor))) {
      junkStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // 3️⃣ Best streak
    let bestStreak = 0;
    let currentStreak = 0;
    const sortedDates = [...junkDaysSet].sort();
    let d = new Date(sortedDates[0]);
    const today = new Date();

    while (d <= today) {
      if (!junkDaysSet.has(toDateKey(d))) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
      d.setDate(d.getDate() + 1);
    }

    return { noJunkStreak, junkStreak, bestStreak };
  }, [allEntries]);

  const [selectedMonth, setSelectedMonth] = useState(
    getLatestMonth(allEntries)
  );

  const [chartReady, setChartReady] = useState(false);
  const statsRef = useRef(null);

  useLayoutEffect(() => {
    setChartReady(true);
  }, []);

  /* CURRENT MONTH DATA */
  const monthEntries = useMemo(() => {
    return allEntries.filter(
      (e) => e.date && getMonthKey(e.date) === selectedMonth
    );
  }, [allEntries, selectedMonth]);

  const totalSpent = monthEntries.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  /* PREVIOUS MONTH COMPARISON LOGIC */
  const previousMonth = getPreviousMonth(selectedMonth);

  const previousMonthTotal = allEntries
    .filter(
      (e) => e.date && getMonthKey(e.date) === previousMonth
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const diff = totalSpent - previousMonthTotal;
  const isSpendingLess = diff < 0; // Good!
  const isSpendingMore = diff > 0; // Bad!

  const percentChange =
    previousMonthTotal === 0
      ? null
      : Math.round((Math.abs(diff) / previousMonthTotal) * 100);

  /* GROUP BY FOOD */
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

  /* 💸 MONEY WASTED LOGIC */
  const wastedAmount = totalSpent;
  let wastedMessage = "🎉 Legend. Zero junk!";
  let wastedEquivalent = "";

  if (wastedAmount > 0 && wastedAmount <= 100) {
    wastedMessage = "😌 Not too bad — but stay alert";
    wastedEquivalent = "☕ 1 coffee";
  } else if (wastedAmount <= 200) {
    wastedMessage = "😬 Careful… this is adding up";
    wastedEquivalent = "🍔 1 burger";
  } else if (wastedAmount <= 400) {
    wastedMessage = "🚨 Bro… rethink your choices";
    wastedEquivalent = "🎬 1 movie ticket";
  } else if (wastedAmount > 400) {
    wastedMessage = "💀 Wallet crying fr";
    wastedEquivalent = "🍕 Party for friends";
  }

  /* 📄 EXPORT PDF */
  const exportToPDF = async () => {
    if (!statsRef.current) return;
    const canvas = await html2canvas(statsRef.current, {
      scale: 3,
      backgroundColor: "#FFFBFD",
      useCORS: true,
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Junk_Journal_Stats_${selectedMonth}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FFFBFD] px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6" ref={statsRef}>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Stats</h2>
          <button
            onClick={exportToPDF}
            className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
          >
            Export PDF
          </button>
        </div>

        {/* Month Picker */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
            Select month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-pink-500 transition"
          />
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-pink-50/80 rounded-xl p-5 shadow-sm border border-pink-100">
            <p className="text-sm text-gray-500 font-medium">Total spent</p>
            <p className="text-3xl font-bold text-pink-600 mt-1">
              ₹{totalSpent}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Items</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalItems}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Top item</p>
            <p className="text-lg font-bold text-gray-800 mt-1 truncate">
              {topItem ? topItem.name : "—"}
            </p>
            {topItem && (
              <p className="text-sm text-gray-400">
                ₹{topItem.value}
              </p>
            )}
          </div>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50/80 rounded-xl p-5 shadow-sm border border-green-100">
            <p className="text-sm text-gray-500 font-medium">🔥 No-junk streak</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {noJunkStreak} days
            </p>
          </div>

          <div className="bg-red-50/80 rounded-xl p-5 shadow-sm border border-red-100">
            <p className="text-sm text-gray-500 font-medium">🍔 Junk streak</p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {junkStreak} days
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">🏆 Best streak</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {bestStreak} days
            </p>
          </div>
        </div>

        {/* Money Wasted */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
            💸 Money wasted <span className="text-xl">😅</span>
          </p>
          <p className="text-3xl font-bold text-pink-600 mt-2">
            ₹{wastedAmount}
          </p>
          {wastedAmount > 0 && (
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>This could have bought you: <span className="font-semibold">{wastedEquivalent}</span></p>
              <p className="text-orange-500 font-medium">{wastedMessage}</p>
            </div>
          )}
        </div>

        {/* ✅ NEW: Compared to Last Month */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-2">Compared to last month</p>
          
          {previousMonthTotal === 0 ? (
            <p className="text-gray-400 text-sm">No data from previous month to compare</p>
          ) : (
            <div className="flex items-center gap-3">
              {isSpendingLess ? (
                // GREEN: Spending Less
                <p className="text-xl font-bold text-green-600 flex items-center gap-1">
                  ▼ ₹{Math.abs(diff)} 
                  <span className="text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full ml-2">
                    ↓ {percentChange}%
                  </span>
                </p>
              ) : isSpendingMore ? (
                // RED: Spending More
                <p className="text-xl font-bold text-red-500 flex items-center gap-1">
                  ▲ ₹{Math.abs(diff)}
                  <span className="text-sm font-medium bg-red-100 px-2 py-0.5 rounded-full ml-2">
                    ↑ {percentChange}%
                  </span>
                </p>
              ) : (
                // NEUTRAL
                <p className="text-xl font-bold text-gray-500">
                   = Same as last month
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-0 min-h-0">
          <p className="text-sm text-gray-500 font-medium mb-6">
            Spending distribution
          </p>

          {!chartReady || foodSpendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
              No data for this month
            </div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
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
                  >
                    {foodSpendData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
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