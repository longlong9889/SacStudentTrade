import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createItem, uploadItemImage } from "../../services/client.js";
import { CATEGORIES } from "../../services/utils.js";
import { successNotification, errorNotification } from "../../services/notification.js";

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  color: "var(--text-muted)",
  marginBottom: "5px",
  fontFamily: "var(--font-mono)",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  fontSize: "14px",
  fontFamily: "var(--font-sans)",
  color: "var(--text-primary)",
  backgroundColor: "#FDFCFA",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

export default function PostItemModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "Textbooks",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.price) return;

    const sellerId = localStorage.getItem("customerId");
    if (!sellerId) {
      errorNotification("Error", "Could not identify your account. Try logging in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await createItem(sellerId, {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category: form.category,
      });

      const newItem = res.data;

      // Upload image if provided
      if (imageFile && newItem?.id) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await uploadItemImage(newItem.id, formData);
      }

      successNotification("Item posted!", `"${form.title}" is now listed on the marketplace.`);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      errorNotification("Failed to post item", err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: "500px",
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          animation: "slideUp 0.3s ease",
          padding: "28px",
          border: "1px solid var(--border)",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "var(--surface-hover)", border: "none",
          cursor: "pointer", fontSize: "16px", display: "flex",
          alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
        }}>×</button>

        <h2 style={{
          margin: "0 0 4px",
          fontSize: "20px", fontWeight: 700, color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
        }}>List an item</h2>
        <p style={{
          margin: "0 0 20px",
          fontSize: "13px", color: "var(--text-faint)",
          fontFamily: "var(--font-sans)",
        }}>What are you selling to your fellow Hornets?</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              placeholder="e.g. Calculus textbook, barely used"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{
                ...inputStyle,
                appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Price</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                fontSize: "14px", color: "var(--text-faint)",
                fontFamily: "var(--font-mono)", fontWeight: 600,
              }}>$</span>
              <input
                style={{ ...inputStyle, paddingLeft: "26px", fontFamily: "var(--font-mono)", fontWeight: 600 }}
                placeholder="0.00"
                type="number" min="0" step="0.01"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
              placeholder="Describe your item — condition, why you're selling, pickup details..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label style={labelStyle}>Photo</label>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "var(--gold-600)" : "#DDD8D0"}`,
                borderRadius: "8px",
                padding: imagePreview ? "8px" : "28px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#FDFCFA",
                transition: "border-color 0.15s",
              }}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%", maxHeight: "160px",
                    objectFit: "cover", borderRadius: "4px",
                  }}
                />
              ) : (
                <>
                  <div style={{ fontSize: "24px", marginBottom: "6px", opacity: 0.4 }}>📷</div>
                  <div style={{
                    fontSize: "13px", color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                  }}>
                    {isDragActive ? "Drop it here!" : "Drop a photo here or click to upload"}
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.title.trim() || !form.price}
            style={{
              marginTop: "4px",
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "var(--green-900)",
              color: "#fff",
              border: "none",
              cursor: loading ? "default" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              opacity: (loading || !form.title.trim() || !form.price) ? 0.6 : 1,
              transition: "opacity 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading && (
              <span style={{
                width: "16px", height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
                display: "inline-block",
              }} />
            )}
            {loading ? "Posting..." : "Post Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
