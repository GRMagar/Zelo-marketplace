/**
 * Frontend script for Zelo waitlist form
 * Replace GOOGLE_SCRIPT_URL with your Apps Script Web App URL
 *
 * NOTE: Many deploys use fetch with mode: "no-cors" to allow submitting to Apps Script
 * This means the client cannot read the response body. We still show friendly UI messages.
 */

const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE"; // <-- replace with your web app URL

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("waitlistForm");
  const status = document.getElementById("status");
  const emailInput = document.getElementById("email");
  const feedbackInput = document.getElementById("feedback");
  const typeSelect = document.getElementById("type");

  // quick UI for hero buttons
  document.getElementById("joinBtn").addEventListener("click", () => {
    document.getElementById("waitlistCard").scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("listBtn").addEventListener("click", () => {
    typeSelect.value = "provider";
    document.getElementById("waitlistCard").scrollIntoView({ behavior: "smooth" });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const email = emailInput.value.trim();
    const feedback = feedbackInput.value.trim();
    const type = typeSelect.value || "user";

    if (!email) {
      status.textContent = "Please enter a valid email.";
      return;
    }

    // Show submitting state
    status.textContent = "Submitting...";

    // Build payload
    const payload = { email, feedback, type };

    // Send to Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script often requires this for direct client calls without proxy
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch((err) => {
      // ignore: when using no-cors the fetch will often reject or not return response
      console.warn("fetch error (expected with no-cors):", err);
    }).finally(() => {
      // Since we cannot reliably read response with no-cors, assume success for UX
      status.textContent = "Thanks — you're on the waitlist! We'll be in touch.";
      form.reset();
      // optional: ga event or analytics here
    });
  });
});
