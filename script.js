(function () {
  const root = document.documentElement;
  const body = document.body;
  const dial = document.getElementById("dial");
  const needle = document.getElementById("needle");
  const hub = document.getElementById("hub");
  const hubLabel = document.getElementById("hub-label");
  const stops = document.querySelectorAll(".dial__stop");

  const MODES = ["product", "consulting", "data", "engineering"];
  const ANGLES = { product: 0, consulting: 90, data: 180, engineering: 270 };

  const specData = {
    overview: {
      config: "All-rounder",
      stack: "Product · Consulting · Data · Engineering",
      proven: "PwC · WizLearnr · Guidewire · Capgemini · Samsung R&D",
      shipped: "6+ features · 20M+ data points · 100+ interviews",
      deploy: "You need more than one job filled at once",
    },
    product: {
      config: "Product",
      stack: "Prompt Engineering · Wireframing · Market Research",
      proven: "WizLearnr, Founder's Office",
      shipped: "MVP roadmap shortlisted by the Telangana Government",
      deploy: "You need 0→1 discovery, fast",
    },
    consulting: {
      config: "Consulting",
      stack: "SAP IBP · Financial Modeling · Sensitivity Analysis",
      proven: "PwC · HP Tech Ventures",
      shipped: "Master-data cleanup for a live SAP IBP rollout",
      deploy: "You need the mess explained to execs",
    },
    data: {
      config: "Data",
      stack: "Snowflake · Python · Tableau · Machine Learning",
      proven: "Capgemini · Samsung R&D · Consilience.AI",
      shipped: "20M+ data points migrated, compute cost −30%",
      deploy: "You need a pipeline that doesn't break",
    },
    engineering: {
      config: "Engineering",
      stack: "Java · AWS · Security & Auth · Cloud Platforms",
      proven: "Guidewire Software",
      shipped: "6+ features shipped, 30+ vulnerabilities closed",
      deploy: "You need it shipped and secure",
    },
  };

  const accentVar = {
    overview: "--ink",
    product: "--c-product",
    consulting: "--c-consulting",
    data: "--c-data",
    engineering: "--c-engineering",
  };

  const specEls = {
    config: document.getElementById("spec-config"),
    stack: document.getElementById("spec-stack"),
    proven: document.getElementById("spec-proven"),
    shipped: document.getElementById("spec-shipped"),
    deploy: document.getElementById("spec-deploy"),
  };

  const syncedItems = document.querySelectorAll(
    "[data-mode].tl-item, [data-mode].work-card, [data-mode].chip"
  );

  let currentMode = "overview";

  function applyMode(mode, opts) {
    opts = opts || {};
    currentMode = mode;
    body.dataset.mode = mode;

    const accent = getComputedStyle(root).getPropertyValue(accentVar[mode]).trim();
    root.style.setProperty("--accent", accent);

    const d = specData[mode];
    specEls.config.textContent = d.config;
    specEls.stack.textContent = d.stack;
    specEls.proven.textContent = d.proven;
    specEls.shipped.textContent = d.shipped;
    specEls.deploy.textContent = d.deploy;

    hubLabel.textContent = mode === "overview" ? "ALL-ROUNDER" : mode.toUpperCase();

    stops.forEach((stop) => {
      const active = stop.dataset.mode === mode;
      stop.classList.toggle("is-active", active);
      stop.setAttribute("aria-pressed", String(active));
    });

    syncedItems.forEach((item) => {
      if (mode === "overview") {
        item.classList.remove("is-active", "is-dim");
      } else if (item.dataset.mode === mode) {
        item.classList.add("is-active");
        item.classList.remove("is-dim");
      } else {
        item.classList.add("is-dim");
        item.classList.remove("is-active");
      }
    });

    if (mode === "overview") {
      needle.style.opacity = "0.15";
    } else {
      needle.style.opacity = "1";
      if (!opts.skipAngle) {
        needle.style.setProperty("--angle", ANGLES[mode] + "deg");
      }
    }
  }

  // --- click on a stop ---
  stops.forEach((stop) => {
    stop.addEventListener("click", () => applyMode(stop.dataset.mode));
  });

  // --- click on hub resets to overview ---
  hub.addEventListener("click", () => applyMode("overview"));

  // --- keyboard: arrow keys cycle modes when dial is focused ---
  dial.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const idx = MODES.indexOf(currentMode);
    let next;
    if (idx === -1) {
      next = e.key === "ArrowLeft" || e.key === "ArrowUp" ? MODES.length - 1 : 0;
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (idx + 1) % MODES.length;
    } else {
      next = (idx - 1 + MODES.length) % MODES.length;
    }
    applyMode(MODES[next]);
  });

  // --- drag to spin ---
  let dragging = false;

  function angleFromPointer(clientX, clientY) {
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return deg;
  }

  function nearestMode(deg) {
    let best = MODES[0];
    let bestDiff = 360;
    MODES.forEach((m) => {
      let diff = Math.abs(deg - ANGLES[m]);
      if (diff > 180) diff = 360 - diff;
      if (diff < bestDiff) {
        bestDiff = diff;
        best = m;
      }
    });
    return best;
  }

  function startDrag(e) {
    if (e.target.closest(".dial__stop") || e.target.closest(".dial__hub")) return;
    dragging = true;
    needle.style.transition = "none";
    needle.style.opacity = "1";
    dial.setPointerCapture(e.pointerId);
  }

  function moveDrag(e) {
    if (!dragging) return;
    const deg = angleFromPointer(e.clientX, e.clientY);
    needle.style.setProperty("--angle", deg + "deg");
    const guess = nearestMode(deg);
    hubLabel.textContent = guess.toUpperCase();
  }

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    needle.style.transition = "";
    const deg = angleFromPointer(e.clientX, e.clientY);
    const mode = nearestMode(deg);
    applyMode(mode);
  }

  dial.addEventListener("pointerdown", startDrag);
  dial.addEventListener("pointermove", moveDrag);
  dial.addEventListener("pointerup", endDrag);
  dial.addEventListener("pointercancel", endDrag);

  // fill in your real LinkedIn URL here once you have it handy
  const linkedin = document.getElementById("linkedin-link");
  if (linkedin) {
    linkedin.addEventListener("click", (e) => {
      if (linkedin.getAttribute("href") === "#") e.preventDefault();
    });
  }

  applyMode("overview");
})();
