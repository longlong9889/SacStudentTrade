const STATUS_CONFIG = {
  AVAILABLE: { label: "Available", bg: "var(--green-500)", color: "#fff" },
  SOLD: { label: "Sold", bg: "#8B8680", color: "#fff" },
  RESERVED: { label: "Reserved", bg: "var(--gold-600)", color: "#fff" },
  DELETED: { label: "Deleted", bg: "var(--red-500)", color: "#fff" },
};

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.AVAILABLE;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      borderRadius: "3px",
      backgroundColor: c.bg,
      color: c.color,
      fontFamily: "var(--font-mono)",
    }}>
      {c.label}
    </span>
  );
}
