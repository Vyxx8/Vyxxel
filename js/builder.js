document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     BUILD STATE
  ====================== */
  const build = {
    useCase: null,
    budget: null,
    parts: { cpu:null, gpu:null, ram:null, storage:null, psu:null, case:null },
    prices: { cpu:0, gpu:0, ram:0, storage:0, psu:0, case:0 },
    totalPrice: 0
  };

  /* =====================
     PARTS CATALOG
  ====================== */
  const PARTS_CATALOG = {
    cpu: [
      { name: "Ryzen 5 5600", price: 130, useCases: ["Gaming", "General Use"] },
      { name: "Ryzen 7 7700X", price: 320, useCases: ["Gaming", "Streaming", "Editing"] }
    ],
    gpu: [
      { name: "RTX 4060", price: 300, useCases: ["Gaming", "General Use"] },
      { name: "RTX 4070", price: 550, useCases: ["Gaming", "Streaming", "Editing"] }
    ],
    ram: [
      { name: "16GB DDR4", price: 60, useCases: ["Gaming", "General Use"] },
      { name: "32GB DDR5", price: 140, useCases: ["Streaming", "Editing"] }
    ],
    storage: [
      { name: "1TB NVMe SSD", price: 70, useCases: ["All"] }
    ],
    psu: [
      { name: "650W Gold", price: 90, useCases: ["Gaming", "General Use"] },
      { name: "750W Gold", price: 120, useCases: ["Streaming", "Editing"] }
    ],
    case: [
      { name: "Airflow Mid Tower", price: 110, useCases: ["All"] }
    ]
  };

  /* =====================
     PERFORMANCE TIER
  ====================== */
  function getPerformanceTier() {
    if (!build.parts.gpu || !build.parts.cpu) return "—";
    if (build.parts.gpu.includes("4070")) return "1080p / 1440p Gaming & Editing";
    if (build.parts.gpu.includes("4060")) return "1080p / 1440p Gaming";
    return "General Performance";
  }

  /* =====================
     STEPS
  ====================== */
  const steps = ["usecase", "budget", "parts", "review"];
  let currentStep = 0;

  const backButton = document.getElementById("builderBack");
  const ctaButton = document.querySelector(".builder-cta");

  function showStep(index) {
    currentStep = index;

    document.querySelectorAll(".builder-step-card").forEach(card => {
      card.hidden = card.dataset.step !== steps[index];
    });

    document.querySelectorAll(".builder-step")
      .forEach((s,i)=>s.classList.toggle("active", i === index));

    backButton.hidden = index === 0;
  }

  /* =====================
     BACK BUTTON RESET
  ====================== */
  backButton.onclick = () => {

    if (currentStep >= 2) {
      Object.keys(build.parts).forEach(k => build.parts[k] = null);
      Object.keys(build.prices).forEach(k => build.prices[k] = 0);
      build.totalPrice = 0;

      document.querySelectorAll(".builder-option.selected")
        .forEach(b => b.classList.remove("selected"));

      buildCPU.textContent = "—";
      buildGPU.textContent = "—";
      buildRAM.textContent = "—";
      buildStorage.textContent = "—";
      buildPSU.textContent = "—";
      buildCase.textContent = "—";
      buildTotal.textContent = "$0";

      ctaButton.disabled = true;
    }

    if (currentStep === 1) {
      build.useCase = null;
      build.budget = null;
      buildUseCase.textContent = "—";
      buildBudget.textContent = "—";
    }

    showStep(Math.max(currentStep - 1, 0));
  };

  /* =====================
     USE CASE / BUDGET
  ====================== */
  document.querySelectorAll("[data-usecase]").forEach(btn=>{
    btn.onclick = () => {
      build.useCase = btn.dataset.usecase;
      buildUseCase.textContent = build.useCase;
      showStep(1);
    };
  });

  document.querySelectorAll("[data-budget]").forEach(btn=>{
    btn.onclick = () => {
      build.budget = btn.dataset.budget;
      buildBudget.textContent = build.budget;
      renderAllParts();
      showStep(2);
    };
  });

  /* =====================
     PART RENDERING
  ====================== */
  function renderAllParts() {
    renderPartOptions("cpu", "cpuOptions", "buildCPU");
    renderPartOptions("gpu", "gpuOptions", "buildGPU");
    renderPartOptions("ram", "ramOptions", "buildRAM");
    renderPartOptions("storage", "storageOptions", "buildStorage");
    renderPartOptions("psu", "psuOptions", "buildPSU");
    renderPartOptions("case", "caseOptions", "buildCase");
  }

  function renderPartOptions(type, containerId, displayId) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";

    PARTS_CATALOG[type]
      .filter(p => p.useCases.includes("All") || p.useCases.includes(build.useCase))
      .forEach(p => {

        const b = document.createElement("button");
        b.className = "builder-option";
        b.textContent = `${p.name} ($${p.price})`;

        b.onclick = () => {
          el.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
          b.classList.add("selected");

          build.parts[type] = p.name;
          build.prices[type] = p.price;
          document.getElementById(displayId).textContent = b.textContent;

          updateTotal();
          checkComplete();
        };

        el.appendChild(b);
      });
  }

  function updateTotal() {
    build.totalPrice = Object.values(build.prices).reduce((a,b)=>a+b,0);
    buildTotal.textContent = `$${build.totalPrice}`;
  }

  function checkComplete() {
    const done = Object.values(build.parts).every(Boolean);
    ctaButton.disabled = !done;

    if (done) {
      populateReview();
      showStep(3);
    }
  }

  function populateReview() {
    reviewCPU.textContent = build.parts.cpu;
    reviewGPU.textContent = build.parts.gpu;
    reviewRAM.textContent = build.parts.ram;
    reviewStorage.textContent = build.parts.storage;
    reviewPSU.textContent = build.parts.psu;
    reviewCase.textContent = build.parts.case;
    reviewTotal.textContent = `$${build.totalPrice}`;
    reviewPerformance.textContent = getPerformanceTier();
  }

  /* =====================
     ADD BUILD TO CART — FINAL FIX
  ====================== */
  ctaButton.addEventListener("click", () => {

    addToCart({
      id: Date.now(),
      type: "pc-build",
      name: "Custom PC Build",
      price: build.totalPrice,
      quantity: 1,
      meta: {
        useCase: build.useCase,
        budget: build.budget,
        performance: getPerformanceTier(),
        parts: { ...build.parts }
      }
    });

  });

  showStep(0);
});