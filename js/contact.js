document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     SERVICE CATALOG
  ====================== */
  const SERVICES = [
    "PC Repair",
    "Phone Repair",
    "Controller Repair",
    "PC Build Help",
    "Gaming Setup",
    "PC Optimization",
    "Audio Setup",
    "Troubleshooting",
    "General Tech Support"
  ];

  const cart = JSON.parse(localStorage.getItem("vyxxel-cart")) || [];

  /* =====================
     SERVICE DROPDOWN
  ====================== */
  const serviceSelect = document.getElementById("serviceSelect");
  if (serviceSelect) {
    serviceSelect.innerHTML = `<option value="">Select a service</option>`;
    SERVICES.forEach(service => {
      const option = document.createElement("option");
      option.value = service;
      option.textContent = service;
      serviceSelect.appendChild(option);
    });

    const cartService = cart.find(item => item.type !== "pc-build");
    if (cartService) serviceSelect.value = cartService.name;

    const hasBuild = cart.some(item => item.type === "pc-build");
    if (hasBuild && !cartService) serviceSelect.value = "PC Build Help";
  }

  /* =====================
     MESSAGE / DETAILS FIELD
  ====================== */
  const textarea =
    document.querySelector("textarea#detailsInput") ||
    document.querySelector("textarea#message") ||
    document.querySelector("textarea[name='message']") ||
    document.querySelector("textarea");

  if (!textarea || textarea.value.trim() !== "") return;
  if (!cart.length) return;

  let message = "Request Summary\n\n";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    if (item.type === "pc-build" && item.meta) {
      const { useCase, budget, performance, parts } = item.meta;
      message += `Use Case: ${useCase}\n`;
      message += `Budget: ${budget}\n`;
      message += `Performance Tier: ${performance}\n`;
      message += `Parts:\n`;
      message += `  CPU: ${parts.cpu}\n`;
      message += `  GPU: ${parts.gpu}\n`;
      message += `  RAM: ${parts.ram}\n`;
      message += `  Storage: ${parts.storage}\n`;
      message += `  Power Supply: ${parts.psu}\n`;
      message += `  Case: ${parts.case}\n`;
    }
    message += "\n";
  });
  textarea.value = message;
});

/* =====================
   FORM SUBMIT → FORMSPREE
===================== */
async function submitContact(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector("button[type='submit']");

  // Get values
  const name = form.querySelector("input[type='text']").value.trim();
  const email = form.querySelector("input[type='email']").value.trim();
  const service = document.getElementById("serviceSelect")?.value || "Not specified";
  const details = document.getElementById("detailsInput")?.value.trim() || "";

  // Basic validation
  if (!name || !email) {
    showToast("Please fill in your name and email.");
    return;
  }

  // Disable button while sending
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const response = await fetch("https://formspree.io/f/xlgpbree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        service,
        message: details
      })
    });

    if (response.ok) {
      showToast("Message sent! We'll be in touch soon. 🎉");
      form.reset();
      btn.textContent = "Message Sent ✓";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Send Message → We'll take it from here";
      }, 4000);
    } else {
      throw new Error("Form submission failed");
    }
  } catch (err) {
    showToast("Something went wrong. Please try again.");
    btn.disabled = false;
    btn.textContent = "Send Message → We'll take it from here";
  }
}
