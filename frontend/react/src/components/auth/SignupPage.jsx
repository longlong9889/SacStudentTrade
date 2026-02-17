import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { saveCustomer } from "../../services/client.js";
import { errorNotification, successNotification } from "../../services/notification.js";
import {
  MailIcon, LockIcon, UserIcon, CalendarIcon,
  EyeIcon, EyeOffIcon, ArrowRight,
} from "../shared/Icons.jsx";
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

export default function SignupPage() {
  const { customer, setCustomerFromToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", age: "", gender: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (customer) navigate("/marketplace");
  }, [customer]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.age) errs.age = "Required";
    else if (parseInt(form.age) < 16 || parseInt(form.age) > 99) errs.age = "16-99";
    if (!form.gender) errs.gender = "Required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 4) errs.password = "Min 4 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    saveCustomer({
      name: form.name.trim(),
      email: form.email,
      age: parseInt(form.age),
      gender: form.gender,
      password: form.password,
    })
      .then(res => {
        const jwtToken = res.headers["authorization"];
        localStorage.setItem("access_token", jwtToken);
        setCustomerFromToken();
        successNotification("Welcome!", "Your account has been created.");
        navigate("/marketplace");
      })
      .catch(err => {
        errorNotification(
          err.code || "Registration Failed",
          err?.response?.data?.message || "Something went wrong."
        );
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      backgroundColor: "var(--bg)",
    }}>
      <div style={{
        flex: "1 1 50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px", overflowY: "auto",
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
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{
                margin: "0 0 4px", fontSize: "26px", fontWeight: 700,
                color: "var(--text-primary)", fontFamily: "var(--font-sans)",
                letterSpacing: "-0.5px",
              }}>Join SacTrade</h1>
              <p style={{
                margin: 0, fontSize: "14px", color: "var(--text-faint)",
                fontFamily: "var(--font-sans)",
              }}>Create your account and start trading with Hornets</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><UserIcon /></div>
                  <input type="text" name="name" placeholder="Your full name"
                    value={form.name} onChange={handleChange} style={inputStyle} />
                </div>
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><MailIcon /></div>
                  <input type="email" name="email" placeholder="you@csus.edu"
                    value={form.email} onChange={handleChange} style={inputStyle} />
                </div>
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              {/* Age + Gender row */}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Age</label>
                  <div style={{ position: "relative" }}>
                    <div style={iconWrapStyle}><CalendarIcon /></div>
                    <input type="number" name="age" placeholder="21" min="16" max="99"
                      value={form.age} onChange={handleChange} style={inputStyle} />
                  </div>
                  {errors.age && <p style={errorStyle}>{errors.age}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}
                    style={{
                      ...inputStyle, paddingLeft: "12px",
                      appearance: "none",
                      color: form.gender ? "var(--text-primary)" : "var(--text-placeholder)",
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9590' stroke-width='2.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    <option value="" disabled>Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {errors.gender && <p style={errorStyle}>{errors.gender}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><LockIcon /></div>
                  <input
                    type={showPw ? "text" : "password"} name="password"
                    placeholder="Min 4 characters"
                    value={form.password} onChange={handleChange}
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

              {/* Confirm password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <div style={iconWrapStyle}><LockIcon /></div>
                  <input type="password" name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "12px", borderRadius: "6px",
                backgroundColor: "var(--green-900)", color: "#fff",
                border: "none", cursor: loading ? "default" : "pointer",
                fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-sans)",
                opacity: loading ? 0.7 : 1, marginTop: "2px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
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
                    Creating account...
                  </>
                ) : (
                  <>Create Account <ArrowRight /></>
                )}
              </button>
            </div>
          </form>

          <div style={{
            marginTop: "20px", textAlign: "center",
            fontSize: "13px", color: "var(--text-muted)",
            fontFamily: "var(--font-sans)",
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "var(--green-900)", fontWeight: 700,
              textDecoration: "underline",
              textDecorationColor: "var(--gold-500)",
              textUnderlineOffset: "2px",
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <BrandPanel />
    </div>
  );
}
