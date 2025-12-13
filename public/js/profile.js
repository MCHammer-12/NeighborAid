document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const form = document.getElementById("profileForm");

  if (!editBtn || !saveBtn || !form) return;

  const viewEls = document.querySelectorAll(".view");
  const inputEls = document.querySelectorAll(".edit-input");

  // Enter edit mode
  editBtn.addEventListener("click", () => {
    viewEls.forEach(el => (el.style.display = "none"));
    inputEls.forEach(el => (el.style.display = "block"));
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  // Save profile updates
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
        return;
      }

      // Reload to reflect updated session data
      window.location.reload();

    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Unexpected error updating profile");
    }
  });
});
