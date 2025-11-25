// ================================================
//  API BASE URL  (BACKEND on Vercel)
// ================================================

// ✅ Use YOUR real backend URL (we saw this in your screenshot)
const API_BASE_URL = "https://lms-system-tau.vercel.app";

// ================================================
//  REGISTRATION / OTP HANDLERS
// ================================================

// This runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Register page loaded");

  // Registration form (CREATE ACCOUNT form)
  // 🔴 Change "#registerForm" if your form has a different id
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleSendOtp);
  }

  // Verify OTP button (if you have one)
  // 🔴 Change "verifyOtpBtn" if your button has a different id
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener("click", handleVerifyOtp);
  }
});

// ========== SEND OTP (Registration Step–1) ==========
function handleSendOtp(e) {
  e.preventDefault();

  // 🔴 Match these IDs with your HTML fields on Create Account page
  const role   = document.getElementById("regRole").value;
  const name   = document.getElementById("regName").value.trim();
  const email  = document.getElementById("regEmail").value.trim();
  const pass   = document.getElementById("regPassword").value.trim();
  const cpass  = document.getElementById("regConfirmPassword").value.trim();

  const errors = [];

  if (!role) errors.push("Please select your role.");
  if (!name) errors.push("Full Name is required.");
  if (!email) errors.push("Email is required.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Enter a valid email address.");
  if (!pass) errors.push("Password is required.");
  if (pass && pass.length < 6)
    errors.push("Password must be at least 6 characters.");
  if (pass !== cpass) errors.push("Passwords do not match.");

  if (errors.length > 0) {
    alert("⚠️ ERROR:\n\n" + errors.join("\n"));
    return;
  }

  console.log("👉 Calling send-otp API at:", `${API_BASE_URL}/api/send-otp`);

  fetch(`${API_BASE_URL}/api/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role,
      name,
      email,
      password: pass, // backend expects "password"
    }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        alert("❌ Failed to send OTP: " + (data.message || "Unknown error"));
        return;
      }

      alert(data.message || "OTP sent successfully to your email.");

      // Optionally show OTP input section after success
      // e.g. document.getElementById("otpSection").classList.remove("hidden");
    })
    .catch((err) => {
      console.error("NETWORK ERROR while sending OTP:", err);
      alert("Network error while sending OTP.");
    });
}

// ========== VERIFY OTP (Registration Step–2) ==========
function handleVerifyOtp(e) {
  e.preventDefault();

  // 🔴 Use same email as above, and an OTP input field
  const email = document.getElementById("regEmail").value.trim();
  const otp   = document.getElementById("regOtp").value.trim(); // id="regOtp"

  if (!email || !otp) {
    alert("Email and OTP are required.");
    return;
  }

  console.log("👉 Calling verify-otp API at:", `${API_BASE_URL}/api/verify-otp`);

  fetch(`${API_BASE_URL}/api/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        alert("❌ OTP verification failed: " + (data.message || "Unknown error"));
        return;
      }

      alert(data.message || "Account verified successfully! You can now login.");
      // e.g. window.location.href = "/login";
    })
    .catch((err) => {
      console.error("NETWORK ERROR while verifying OTP:", err);
      alert("Network error while verifying OTP.");
    });
}
