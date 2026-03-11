/* =====================
   EMAILJS CONFIG
===================== */
const EMAILJS_SERVICE_ID = "service_0e2f9no";
const EMAILJS_TEMPLATE_ID = "template_cms0aym";
const EMAILJS_PUBLIC_KEY = "yCo9odABRj8ARxWCb";

document.addEventListener("DOMContentLoaded", () => {
  // Init EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

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
   FORM SUBMIT → EMAILJS
===================== */
async function submitContact(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector("button[type='submit']");

  const name = form.querySelector("input[type='text']").value.trim();
  const email = form.querySelector("input[type='email']").value.trim();
  const service = document.getElementById("serviceSelect")?.value || "Not specified";
  const details = document.getElementById("detailsInput")?.value.trim() || "No details provided";

  if (!name || !email) {
    showToast("Please fill in your name and email.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    // 1. Notify YOU about the new request
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name: "Vyxxel",
      to_email: "basselosman14@gmail.com",
      from_name: name,
      from_email: email,
      service: service,
      message: `New request from ${name} (${email})\n\nService: ${service}\n\nDetails:\n${details}`,
      reply_to: email
    });

    // 2. Send confirmation to the CUSTOMER
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name: name,
      to_email: email,
      from_name: "Vyxxel",
      from_email: "basselosman14@gmail.com",
      service: service,
      message: `Hey ${name}! 👋\n\nThanks for reaching out to Vyxxel. We got your request for "${service}" and we'll get back to you within 24 hours.\n\nIf anything is urgent, just reply to this email.\n\n— The Vyxxel Team`,
      reply_to: "basselosman14@gmail.com"
    });

    showToast("Message sent! Check your email for confirmation. 🎉");
    form.reset();
    btn.textContent = "Message Sent ✓";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Send Message → We'll take it from here";
    }, 4000);

  } catch (err) {
    console.error("EmailJS error:", err);
    showToast("Something went wrong. Please try again.");
    btn.disabled = false;
    btn.textContent = "Send Message → We'll take it from here";
  }
}
