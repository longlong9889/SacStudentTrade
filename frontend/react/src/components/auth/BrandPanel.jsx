export default function BrandPanel() {
  return (
    <div className="desktop-only" style={{
      flex: "1 1 50%",
      backgroundColor: "var(--green-900)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px",
    }}>
      {/* Hex pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `
          linear-gradient(30deg, #C4A747 12%, transparent 12.5%, transparent 87%, #C4A747 87.5%, #C4A747),
          linear-gradient(150deg, #C4A747 12%, transparent 12.5%, transparent 87%, #C4A747 87.5%, #C4A747),
          linear-gradient(30deg, #C4A747 12%, transparent 12.5%, transparent 87%, #C4A747 87.5%, #C4A747),
          linear-gradient(150deg, #C4A747 12%, transparent 12.5%, transparent 87%, #C4A747 87.5%, #C4A747),
          linear-gradient(60deg, #C4A74777 25%, transparent 25.5%, transparent 75%, #C4A74777 75%, #C4A74777),
          linear-gradient(60deg, #C4A74777 25%, transparent 25.5%, transparent 75%, #C4A74777 75%, #C4A74777)
        `,
        backgroundSize: "80px 140px",
        backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
      }} />

      {/* Floating cards */}
      <FloatingCard top="15%" left="10%" emoji="📚" title="Calc Textbook" price="$45" anim="float1" dur="12s" w="140px" />
      <FloatingCard top="55%" right="8%" emoji="🎧" title="Sony XM4" price="$120" anim="float2" dur="14s" w="130px" />
      <FloatingCard bottom="18%" left="22%" emoji="🪑" title="IKEA Desk" price="$30" anim="float3" dur="10s" w="120px" />

      {/* Center content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "340px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          backgroundColor: "rgba(196,167,71,0.15)",
          border: "1px solid rgba(196,167,71,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "26px",
        }}>🐝</div>

        <h2 style={{
          fontSize: "28px", fontWeight: 700, color: "#fff",
          fontFamily: "var(--font-sans)",
          letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: "12px",
        }}>
          Trade with<br/>fellow Hornets
        </h2>

        <p style={{
          fontSize: "14px", color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.6, marginBottom: "28px",
        }}>
          The marketplace built by Sac State students,
          for Sac State students.
        </p>

        <div style={{
          display: "flex", flexDirection: "column", gap: "10px",
          alignItems: "flex-start",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "10px", padding: "16px 20px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            "List items in under 60 seconds",
            "Message sellers directly",
            "Campus community — students only",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                backgroundColor: "rgba(45,106,79,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span style={{
                fontSize: "12.5px", color: "rgba(255,255,255,0.65)",
                fontFamily: "var(--font-sans)",
              }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: "20px", left: 0, right: 0, textAlign: "center",
      }}>
        <span style={{
          fontSize: "10px", color: "rgba(255,255,255,0.2)",
          fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        }}>SACRAMENTO STATE UNIVERSITY</span>
      </div>
    </div>
  );
}

function FloatingCard({ top, left, right, bottom, emoji, title, price, anim, dur, w }) {
  return (
    <div style={{
      position: "absolute",
      top, left, right, bottom,
      width: w,
      backgroundColor: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      padding: "12px",
      border: "1px solid rgba(196,167,71,0.15)",
      animation: `${anim} ${dur} ease-in-out infinite`,
    }}>
      <div style={{
        width: "100%", height: "70px", borderRadius: "4px",
        backgroundColor: "rgba(196,167,71,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", marginBottom: "8px",
      }}>{emoji}</div>
      <div style={{
        fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)",
        fontFamily: "var(--font-sans)", marginBottom: "2px",
      }}>{title}</div>
      <div style={{
        fontSize: "14px", fontWeight: 700, color: "var(--gold-500)",
        fontFamily: "var(--font-mono)",
      }}>{price}</div>
    </div>
  );
}
