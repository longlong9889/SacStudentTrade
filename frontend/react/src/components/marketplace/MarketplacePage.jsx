import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Navbar from "../layout/Navbar.jsx";
import ItemCard from "./ItemCard.jsx";
import ItemDetail from "./ItemDetail.jsx";
import PostItemModal from "./PostItemModal.jsx";
import { PlusIcon, SearchIcon } from "../shared/Icons.jsx";
import { CATEGORIES } from "../../services/utils.js";
import {
  getAvailableItems,
  getAllItems,
  searchItems as searchItemsAPI,
  getItemsByCategory,
  toggleFavorite as toggleFavoriteAPI,
  getFavorites,
} from "../../services/client.js";
import { errorNotification } from "../../services/notification.js";

export default function MarketplacePage() {
  const { customer } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const customerId = customer?.id || localStorage.getItem("customerId");

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAvailableItems();
      setItems(res.data);
    } catch (err) {
      // Fallback to all items if available endpoint has issues
      try {
        const res = await getAllItems();
        setItems(res.data);
      } catch {
        errorNotification("Error", "Failed to load items.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!customerId) return;
    try {
      const res = await getFavorites(customerId);
      const favIds = new Set(res.data.map(f => f.item?.id).filter(Boolean));
      setFavorites(favIds);
    } catch {
      // Favorites not critical — silently fail
    }
  }, [customerId]);

  useEffect(() => {
    fetchItems();
    fetchFavorites();
  }, [fetchItems, fetchFavorites]);

  // Toggle favorite
  const handleToggleFavorite = async (itemId) => {
    if (!customerId) return;

    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });

    try {
      await toggleFavoriteAPI(customerId, itemId);
    } catch {
      // Revert on error
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
    }
  };

  // Filter and sort
  let filtered = items.filter(item => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch = !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);

  return (
    <>
      <Navbar searchValue={search} onSearchChange={setSearch} showSearch={true} />

      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        paddingTop: "calc(var(--nav-height) + 18px)",
      }}>
        {/* Mobile search */}
        <div className="mobile-only" style={{ marginBottom: "14px", position: "relative" }}>
          <div style={{
            position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
            color: "var(--text-faint)", display: "flex",
          }}>
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "14px",
              backgroundColor: "var(--surface)",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
        </div>

        {/* Category pills + sort */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
          flexWrap: "wrap",
        }}>
          <div style={{
            display: "flex", gap: "6px", overflow: "auto",
            paddingBottom: "2px",
            msOverflowStyle: "none", scrollbarWidth: "none",
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: category === cat ? "1.5px solid var(--green-900)" : "1px solid var(--border)",
                  backgroundColor: category === cat ? "var(--green-900)" : "var(--surface)",
                  color: category === cat ? "#fff" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{
              fontSize: "12px", color: "var(--text-faint)",
              fontFamily: "var(--font-mono)",
            }}>{filtered.length} items</span>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: "6px 28px 6px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                fontSize: "12px", fontWeight: 500,
                backgroundColor: "var(--surface)",
                fontFamily: "var(--font-sans)",
                color: "var(--text-secondary)",
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="newest">Newest first</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "3px solid var(--border)",
              borderTopColor: "var(--green-900)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{
              fontSize: "13px", color: "var(--text-faint)",
              fontFamily: "var(--font-sans)",
            }}>Loading marketplace...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                isFavorited={favorites.has(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.4 }}>🔍</div>
            <h3 style={{
              fontSize: "16px", fontWeight: 600, color: "var(--text-secondary)",
              marginBottom: "6px", fontFamily: "var(--font-sans)",
            }}>No items found</h3>
            <p style={{
              fontSize: "13px", color: "var(--text-faint)",
              fontFamily: "var(--font-sans)",
            }}>Try a different search or category</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowPostModal(true)}
        style={{
          position: "fixed",
          bottom: "24px", right: "24px",
          width: "52px", height: "52px",
          borderRadius: "14px",
          backgroundColor: "var(--green-900)",
          color: "var(--gold-500)",
          border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(4,57,39,0.25), 0 1px 3px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          zIndex: 50,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(4,57,39,0.35)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(4,57,39,0.25), 0 1px 3px rgba(0,0,0,0.1)";
        }}
        title="Post an item"
      >
        <PlusIcon />
      </button>

      {/* Modals */}
      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isFavorited={favorites.has(selectedItem.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      {showPostModal && (
        <PostItemModal
          onClose={() => setShowPostModal(false)}
          onSuccess={fetchItems}
        />
      )}
    </>
  );
}
