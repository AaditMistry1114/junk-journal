const STORAGE_KEY = "junk_journal_entries";

function getAllEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveEntry(entry) {
  const entries = getAllEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntriesByDate(date) {
  const dateKey = date.toISOString().split("T")[0];
  return getAllEntries().filter((e) => e.date === dateKey);
}

export function dateHasEntries(date) {
  const dateKey = date.toISOString().split("T")[0];
  return getAllEntries().some((e) => e.date === dateKey);
}
