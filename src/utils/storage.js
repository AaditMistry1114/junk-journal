const STORAGE_KEY = "junk_journal_entries";

function getAllEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveEntry(entry) {
  const entries = getAllEntries();
  const index = entries.findIndex((e) => e.id === entry.id);

  if (index >= 0) {
    entries[index] = entry; // EDIT
  } else {
    entries.push(entry); // ADD
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(id) {
  const entries = getAllEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntriesByDate(dateKey) {
  return getAllEntries().filter((e) => e.date === dateKey);
}

export function dateHasEntries(date) {
  const key = date instanceof Date ? date.toISOString().slice(0, 10) : date;
  return getAllEntries().some((e) => e.date === key);
}
