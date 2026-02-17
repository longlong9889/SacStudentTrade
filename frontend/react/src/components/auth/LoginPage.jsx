import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { errorNotification } from "../../services/notification.js";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRight } from "../shared/Icons.jsx";
import BrandPanel from "./BrandPanel.jsx";

const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.6px",
  color: "var(--text-muted)", marginBottom: "5px",
  fontFamily: "var(--font-mono)",
};
const inputStyle = {
  width: "100%", padding: "11px 12px 11px 38px",
  borderRadius: "6px", border: "1px solid var(--border)",
  fontSize: "14px", fontFamily: "var(--font-sans)",
  color: "var(--text-primary)", backgroundColor: "var(--surface)",
  outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};
const iconWrapStyle = {
  position: "absolute", left: "12px", top: "50%",
  transform: "translateY(-50%)", color: "var(--text-placeholder)",
  display: "flex", pointerEvents: "none",
};
const errorStyle = {
  margin: "4px 0 0", fontSize: "11px",
  color: "var(--red-500)", fontFamily: "var(--font-mono)", fontWeight: 500,
};

export default function LoginPage() {
  const { login, customer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (customer) navigate("/marketplace");
  }, [customer]);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.username)) errs.username = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    login(form)
      .then(() => navigate("/marketplace"))
      .catch(err => {
        errorNotification(
          err.code || "Login Failed",
          err?.response?.data?.message || "Invalid email or password."
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      backgroundColor: "var(--bg)",
    }}>
      {/* Form panel */}
      <div style={{
        flex: "1 1 50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
      }}>
        <div style={{
          width: "100%", maxWidth: "380px",
          animation: "fadeIn 0.35s ease",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "32px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "8px",
              backgroundColor: "var(--green-900)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--gold-500)", fontSize: "17px", fontWeight: 800,
              fontFamily: "var(--font-mono)",
            }}>S</div>
            <span style={{
              fontSize: "18px", fontWeight: 700, color: "var(--text-primary)",
              fontFamily: "var(--font-sans)", letterSpacing: "-0.4px",
            }}>SacTrade</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{
                margin: "0 0 4px", fontSize: "26px", fontWeight: 700,
                color: "var(--text-primary)", fontFamily: "var(--font-sans)",
                letterSpacing: "-0.5px", lineHeight: 1.2,
              }}>Welcome back</h1>
              <p style={{
                margin: 0, fontSize: "14px", color: "var(--text-faint)",
                fontFamily: "var(--font-sans)", lineHeight: 1.5,
              }}>Sign in to continue to SacTrade</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><MailIcon /></div>
                  <input
                    type="email" placeholder="you@csus.edu"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                {errors.username && <p style={errorStyle}>{errors.username}</p>}
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><LockIcon /></div>
                  <input
                    type={showPw ? "text" : "password"} placeholder="Your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "40px" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{
                    position: "absolute", right: "1px", top: "1px", bottom: "1px",
                    width: "38px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-faint)", borderRadius: "0 6px 6px 0",
                  }}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p style={errorStyle}>{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "12px", borderRadius: "6px",
                backgroundColor: "var(--green-900)", color: "#fff",
                border: "none", cursor: loading ? "default" : "pointer",
                fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                marginTop: "4px",
              }}>
                {loading ? (
                  <>
                    <span style={{
                      width: "16px", height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                      display: "inline-block",
                    }} />
                    Signing in...
                  </>
                ) : (
                  <>Sign in <ArrowRight /></>
                )}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: "24px", textAlign: "center",
            fontSize: "13px", color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
          }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{
              color: "var(--green-900)", fontWeight: 700,
              textDecoration: "underline",
              textDecorationColor: "var(--gold-500)",
              textUnderlineOffset: "2px",
            }}>
              Create one
            </Link>
          </div>

          <div style={{
            marginTop: "32px", paddingTop: "16px",
            borderTop: "1px solid var(--border-light)",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: "11px", color: "var(--text-placeholder)",
              fontFamily: "var(--font-mono)", lineHeight: 1.6,
            }}>A student marketplace for Sacramento State</p>
          </div>
        </div>
      </div>

      {/* Brand panel (desktop only) */}
      <BrandPanel />
    </div>
  );
}
