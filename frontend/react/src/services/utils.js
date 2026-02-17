const PLACEHOLDER_COLORS = [
  "#E8D5B7", "#B7C9A8", "#C4B7D4", "#D4B7B7", "#B7C4D4", "#D4CEB7",
  "#C9B7A8", "#A8C4B7", "#D4B7C9", "#B7D4C4", "#C4D4B7", "#B7B7D4"
];

export const CATEGORIES = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Supplies", "Other"];

export function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m} ${ampm}`;
}

export function formatDate(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function getPlaceholderColor(id) {
  return PLACEHOLDER_COLORS[(id || 0) % PLACEHOLDER_COLORS.length];
}

export function getCategoryEmoji(category) {
  const map = {
    "Textbooks": "📚",
    "Electronics": "🔌",
    "Furniture": "🪑",
    "Clothing": "👕",
    "Supplies": "✏️",
    "Other": "📦",
  };
  return map[category] || "📦";
}
