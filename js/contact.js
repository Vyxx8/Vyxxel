document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     SERVICE CATALOG
  ====================== */
  const SERVICES = [
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

    // Auto-select service if one exists in cart
    const cartService = cart.find(item => item.type !== "pc-build");
    if (cartService) {
      serviceSelect.value = cartService.name;
    }

    // Auto-select PC Build Help if build exists
    const hasBuild = cart.some(item => item.type === "pc-build");
    if (hasBuild && !cartService) {
      serviceSelect.value = "PC Build Help";
    }
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
   FORM SUBMIT
===================== */
function submitContact(e) {
  e.preventDefault();
  showToast("Message sent! We’ll be in touch soon.");
}
