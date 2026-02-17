import { HeartIcon } from "../shared/Icons.jsx";
import StatusBadge from "../shared/StatusBadge.jsx";
import { timeAgo, getInitials, getPlaceholderColor, getCategoryEmoji } from "../../services/utils.js";
import { itemImageUrl } from "../../services/client.js";

export default function ItemCard({ item, index = 0, isFavorited, onToggleFavorite, onClick }) {
  const isSold = item.status === "SOLD";

  return (
    <div
      onClick={() => onClick?.(item)}
      style={{
        position: "relative",
        cursor: "pointer",
        opacity: isSold ? 0.6 : 1,
        animation: `cardIn 0.4s ease ${index * 0.04}s both`,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid var(--border)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          if (!isSold) {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,26,26,0.08)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{
          height: "180px",
          backgroundColor: getPlaceholderColor(item.id),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {item.imageId ? (
            <img
              src={itemImageUrl(item.id)}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <span style={{ fontSize: "42px", opacity: 0.3, userSelect: "none" }}>
              {getCategoryEmoji(item.category)}
            </span>
          )}

          {item.status !== "AVAILABLE" && (
            <div style={{ position: "absolute", top: "8px", left: "8px" }}>
              <StatusBadge status={item.status} />
            </div>
          )}

          <button
            onClick={e => { e.stopPropagation(); onToggleFavorite?.(item.id); }}
            style={{
              position: "absolute", top: "8px", right: "8px",
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s ease",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <HeartIcon filled={isFavorited} />
          </button>

          <div style={{
            position: "absolute", bottom: "8px", right: "8px",
            padding: "2px 6px", borderRadius: "3px",
            backgroundColor: "rgba(26,26,26,0.55)",
            color: "#fff", fontSize: "10px",
            fontFamily: "var(--font-mono)", fontWeight: 500,
            backdropFilter: "blur(4px)",
          }}>
            {timeAgo(item.createdAt)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 14px 14px" }}>
          <h3 style={{
            margin: "0 0 6px",
            fontSize: "14px", fontWeight: 600, lineHeight: 1.35,
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textDecoration: isSold ? "line-through" : "none",
          }}>
            {item.title}
          </h3>

          <div style={{
            fontSize: "18px", fontWeight: 700,
            color: isSold ? "#8B8680" : "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}>
            ${Number(item.price).toFixed(2)}
          </div>

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                backgroundColor: "var(--green-900)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "9px", fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}>
                {getInitials(item.sellerName)}
              </div>
              <span style={{
                fontSize: "12px", color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
              }}>
                {item.sellerName}
              </span>
            </div>

            <span style={{
              fontSize: "10px", color: "var(--text-faint)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}>
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
