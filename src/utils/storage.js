const STORAGE_KEY = "junk_journal_entries";

function getAllEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

/* ADD or EDIT */
export function saveEntry(entry) {
  const entries = getAllEntries();

  const index = entries.findIndex(e => e.id === entry.id);

  if (index >= 0) {
    entries[index] = entry; // ✅ EDIT
  } else {
    entries.push(entry);    // ✅ ADD
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/* DELETE */
export function deleteEntry(id) {
  const entries = getAllEntries();
  const updated = entries.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/* GET BY DATE */
export function getEntriesByDate(date) {
  const dateKey = date.toISOString().split("T")[0];
  return getAllEntries().filter(e => e.date === dateKey);
}

/* CALENDAR DOT */
export function dateHasEntries(date) {
  const dateKey = date.toISOString().split("T")[0];
  return getAllEntries().some(e => e.date === dateKey);
}
