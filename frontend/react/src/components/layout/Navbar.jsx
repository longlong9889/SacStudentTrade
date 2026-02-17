import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SearchIcon, BellIcon, PlusIcon, HeartIcon, MenuIcon } from "../shared/Icons.jsx";
import { getInitials } from "../../services/utils.js";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Marketplace", path: "/marketplace" },
  { label: "Favorites", path: "/favorites" },
  { label: "Messages", path: "/messages", hasBadge: true },
];

export default function Navbar({ searchValue, onSearchChange, showSearch = false }) {
  const { customer, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const initials = customer?.username
    ? customer.username.split("@")[0].slice(0, 2).toUpperCase()
    : "??";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: "rgba(250,247,242,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      height: "var(--nav-height)",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          onClick={() => navigate("/marketplace")}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "6px",
            backgroundColor: "var(--green-900)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--gold-500)", fontSize: "14px", fontWeight: 800,
            fontFamily: "var(--font-mono)",
          }}>S</div>
          <span style={{
            fontSize: "15px", fontWeight: 700, color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            letterSpacing: "-0.3px",
          }}>SacTrade</span>
        </div>

        {/* Desktop search */}
        {showSearch && (
          <div className="desktop-only" style={{ position: "relative", width: "340px" }}>
            <div style={{
              position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
              color: "var(--text-faint)", display: "flex",
            }}>
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchValue || ""}
              onChange={e => onSearchChange?.(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "13px",
                backgroundColor: "var(--surface)",
                fontFamily: "var(--font-sans)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
        )}

        {/* Desktop nav links */}
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_LINKS.map(link => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isActive ? "var(--surface-active)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  display: "flex", alignItems: "center", gap: "5px",
                  transition: "background-color 0.15s",
                  position: "relative",
                }}
              >
                {link.hasBadge && <BellIcon size={15} />}
                {link.label}
              </button>
            );
          })}

          <button
            onClick={() => navigate("/sell")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--green-900)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              display: "flex", alignItems: "center", gap: "4px",
              marginLeft: "4px",
            }}
          >
            <PlusIcon size={14} /> Sell
          </button>

          <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)", margin: "0 8px" }} />

          {/* User avatar + dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: "30px", height: "30px", borderRadius: "50%",
                backgroundColor: "var(--green-900)", border: "none",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold-500)", fontSize: "11px", fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {initials}
            </button>

            {showDropdown && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 90 }}
                  onClick={() => setShowDropdown(false)}
                />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  width: "180px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  zIndex: 100,
                  animation: "fadeIn 0.15s ease",
                }}>
                  <div style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--border-light)",
                  }}>
                    <div style={{
                      fontSize: "12px", fontWeight: 600, color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                    }}>{customer?.username}</div>
                    <div style={{
                      fontSize: "10px", color: "var(--text-faint)",
                      fontFamily: "var(--font-mono)",
                    }}>Sac State Student</div>
                  </div>
                  {[
                    { label: "Profile", action: () => navigate("/profile") },
                    { label: "Settings", action: () => navigate("/settings") },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setShowDropdown(false); item.action(); }}
                      style={{
                        width: "100%", padding: "9px 14px",
                        border: "none", backgroundColor: "transparent",
                        textAlign: "left", cursor: "pointer",
                        fontSize: "13px", color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--surface-hover)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border-light)" }}>
                    <button
                      onClick={() => { setShowDropdown(false); logOut(); navigate("/login"); }}
                      style={{
                        width: "100%", padding: "9px 14px",
                        border: "none", backgroundColor: "transparent",
                        textAlign: "left", cursor: "pointer",
                        fontSize: "13px", color: "var(--red-500)", fontWeight: 500,
                        fontFamily: "var(--font-sans)",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--red-100)"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-only" style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px",
          color: "var(--text-primary)",
        }}>
          <MenuIcon />
        </button>
      </div>
    </nav>
  );
}
