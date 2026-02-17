import { HeartIcon, MessageIcon } from "../shared/Icons.jsx";
import StatusBadge from "../shared/StatusBadge.jsx";
import { timeAgo, getInitials, getPlaceholderColor, getCategoryEmoji } from "../../services/utils.js";
import { itemImageUrl } from "../../services/client.js";
import { useNavigate } from "react-router-dom";

export default function ItemDetail({ item, onClose, isFavorited, onToggleFavorite }) {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(26,26,26,0.4)",
        backdropFilter: "blur(4px)",
      }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "var(--surface)",
          borderRadius: "10px",
          maxWidth: "720px",
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          animation: "slideUp 0.3s ease",
          border: "1px solid var(--border)",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px", zIndex: 2,
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid var(--border)",
          cursor: "pointer", fontSize: "16px", display: "flex",
          alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
        }}>×</button>

        {/* Image */}
        <div style={{
          height: "280px",
          backgroundColor: getPlaceholderColor(item.id),
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "10px 10px 0 0",
          overflow: "hidden",
        }}>
          {item.imageId ? (
            <img
              src={itemImageUrl(item.id)}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <span style={{ fontSize: "72px", opacity: 0.25, userSelect: "none" }}>
              {getCategoryEmoji(item.category)}
            </span>
          )}
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
            <StatusBadge status={item.status} />
            <span style={{
              fontSize: "11px", color: "var(--text-faint)",
              fontFamily: "var(--font-mono)",
            }}>{timeAgo(item.createdAt)}</span>
          </div>

          <h2 style={{
            margin: "12px 0 6px",
            fontSize: "22px", fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.3,
          }}>{item.title}</h2>

          <div style={{
            fontSize: "28px", fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}>${Number(item.price).toFixed(2)}</div>

          <p style={{
            margin: "0 0 20px",
            fontSize: "14.5px", lineHeight: 1.65,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
          }}>{item.description}</p>

          {/* Seller card */}
          <div style={{
            padding: "14px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border-light)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                backgroundColor: "var(--green-900)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold-500)", fontSize: "13px", fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}>
                {getInitials(item.sellerName)}
              </div>
              <div>
                <div style={{
                  fontSize: "14px", fontWeight: 600, color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                }}>{item.sellerName}</div>
                <div style={{
                  fontSize: "11px", color: "var(--text-faint)",
                  fontFamily: "var(--font-mono)",
                }}>Sac State Student</div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate(`/messages?to=${item.sellerId}&item=${item.id}`);
              }}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "7px 14px", borderRadius: "6px",
                backgroundColor: "var(--green-900)", color: "#fff",
                border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 600,
                fontFamily: "var(--font-sans)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <MessageIcon /> Message
            </button>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite?.(item.id)}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "11px",
              borderRadius: "6px",
              backgroundColor: isFavorited ? "var(--red-100)" : "var(--surface-hover)",
              border: isFavorited ? "1px solid #E8B4AE" : "1px solid var(--border)",
              cursor: "pointer",
              fontSize: "13px", fontWeight: 600,
              color: isFavorited ? "var(--red-500)" : "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              transition: "all 0.15s",
            }}
          >
            <HeartIcon filled={isFavorited} />
            {isFavorited ? "Saved" : "Save to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
