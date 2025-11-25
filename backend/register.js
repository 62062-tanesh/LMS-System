// ===== API BASE URL =====
// Use localhost in dev, Vercel backend in production
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://lms-system-tau.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const otpSection = document.getElementById("otpSection");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  let tempEmail = ""; // to remember which email we are verifying

  // STEP 1: Send OTP
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

    const errors = [];

    if (!role) errors.push("Please select your role.");
    if (!name) errors.push("Name is required.");
    if (!email) errors.push("Email is required.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push("Enter a valid email.");
    if (!password) errors.push("Password is required.");
    if (password.length < 6)
      errors.push("Password must be at least 6 characters.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    if (errors.length > 0) {
      alert("⚠️ ERROR:\n\n" + errors.join("\n"));
      return;
    }

    try {
      console.log("👉 Calling send-otp API at:", `${API_BASE}/api/send-otp`);

      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + (data.message || "Failed to send OTP"));
        return;
      }

      // Save email for OTP verification
      tempEmail = email;

      alert("✅ OTP sent to your email. Please check your inbox.");
      otpSection.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      alert("Network error while sending OTP.");
    }
  });

  // STEP 2: Verify OTP
  verifyOtpBtn.addEventListener("click", async () => {
    const otp = document.getElementById("otp").value.trim();
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    if (!tempEmail) {
      alert("Email not found in session. Please fill the form again.");
      return;
    }

    try {
      console.log("👉 Calling verify-otp API at:", `${API_BASE}/api/verify-otp`);

      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + (data.message || "OTP verification failed"));
        return;
      }

      alert("🎉 Account verified successfully! You can now login.");
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("Network error while verifying OTP.");
    }
  });
});
