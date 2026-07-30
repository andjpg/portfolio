(function () {
  const root = document.documentElement;
  const body = document.body;
  const reel = document.getElementById("reel");
  const track = document.getElementById("reel-track");
  const items = Array.from(track.querySelectorAll(".reel__item"));
  const upBtn = document.getElementById("reel-up");
  const downBtn = document.getElementById("reel-down");
  const indexEl = document.getElementById("reel-index");
  const progressEl = document.getElementById("reel-progress");
  const toast = document.getElementById("toast");

  const MODES = ["overview", "product", "consulting", "data", "engineering"];

  const specData = {
    overview: {
      config: "Default Build",
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
    overview: "--c-overview",
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

  const ITEM_H = items[0].getBoundingClientRect().height || 58;
  const WINDOW_H = reel.getBoundingClientRect().height || 174;
  const CENTER_OFFSET = WINDOW_H / 2 - ITEM_H / 2;

  let index = 0; // matches MODES array
  let baseY = CENTER_OFFSET; // translateY at rest for index 0

  function yForIndex(i) {
    return CENTER_OFFSET - i * ITEM_H;
  }

  function setTrackY(y, animate) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = "translateY(" + y + "px)";
  }

  function updateItemStyles(activeIdx) {
    items.forEach((item, i) => item.classList.toggle("is-center", i === activeIdx));
    indexEl.textContent = String(activeIdx + 1).padStart(2, "0") + " / 0" + MODES.length;
    progressEl.style.width = (activeIdx / (MODES.length - 1)) * 100 + "%";
  }

  function applyMode(mode, opts) {
    opts = opts || {};
    const idx = MODES.indexOf(mode);
    if (idx === -1) return;
    index = idx;

    body.dataset.mode = mode;
    const accent = getComputedStyle(root).getPropertyValue(accentVar[mode]).trim();
    root.style.setProperty("--accent", accent);

    const d = specData[mode];
    specEls.config.textContent = d.config;
    specEls.stack.textContent = d.stack;
    specEls.proven.textContent = d.proven;
    specEls.shipped.textContent = d.shipped;
    specEls.deploy.textContent = d.deploy;

    updateItemStyles(idx);

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

    if (!opts.skipMove) setTrackY(yForIndex(idx), true);
  }

  // --- click a row directly ---
  items.forEach((item, i) => {
    item.addEventListener("click", () => applyMode(MODES[i]));
  });

  // --- up / down buttons ---
  function step(delta) {
    const next = Math.max(0, Math.min(MODES.length - 1, index + delta));
    applyMode(MODES[next]);
  }
  upBtn.addEventListener("click", () => step(-1));
  downBtn.addEventListener("click", () => step(1));

  // --- keyboard ---
  reel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
  });

  // --- drag to scroll ---
  let dragging = false;
  let startY = 0;
  let startTrackY = 0;
  let totalDrag = 0;
  let eggFired = false;

  function currentTrackY() {
    const t = track.style.transform.match(/-?\d+(\.\d+)?/);
    return t ? parseFloat(t[0]) : yForIndex(index);
  }

  function startDrag(e) {
    dragging = true;
    totalDrag = 0;
    eggFired = false;
    startY = e.clientY;
    startTrackY = currentTrackY();
    setTrackY(startTrackY, false);
    reel.setPointerCapture(e.pointerId);
  }

  function moveDrag(e) {
    if (!dragging) return;
    const delta = e.clientY - startY;
    totalDrag += Math.abs(e.movementY || 0);
    let y = startTrackY + delta;

    // soft clamp beyond the ends for a physical "stop" feel
    const minY = yForIndex(MODES.length - 1);
    const maxY = yForIndex(0);
    if (y > maxY) y = maxY + (y - maxY) * 0.35;
    if (y < minY) y = minY + (y - minY) * 0.35;

    setTrackY(y, false);

    const nearestIdx = Math.max(0, Math.min(MODES.length - 1, Math.round((CENTER_OFFSET - y) / ITEM_H)));
    updateItemStyles(nearestIdx);

    if (!eggFired && totalDrag >= 900) {
      eggFired = true;
      triggerOverclock();
    }
  }

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    const y = currentTrackY();
    const nearestIdx = Math.max(0, Math.min(MODES.length - 1, Math.round((CENTER_OFFSET - y) / ITEM_H)));
    applyMode(MODES[nearestIdx]);
  }

  reel.addEventListener("pointerdown", startDrag);
  reel.addEventListener("pointermove", moveDrag);
  reel.addEventListener("pointerup", endDrag);
  reel.addEventListener("pointercancel", endDrag);

  // --- mouse wheel over the reel also scrolls it ---
  reel.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.deltaY > 0) step(1);
      else if (e.deltaY < 0) step(-1);
    },
    { passive: false }
  );

  // --- easter egg: overclock ---
  const EGG_MESSAGES = [
    "Overclocked. No such configuration exists — but nice reflexes.",
    "You've unlocked absolutely nothing. Respect, though.",
    "Warning: spinning does not increase hireability. Still fun.",
  ];

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function burstConfetti() {
    const rect = reel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = [
      getComputedStyle(root).getPropertyValue("--c-product").trim(),
      getComputedStyle(root).getPropertyValue("--c-consulting").trim(),
      getComputedStyle(root).getPropertyValue("--c-data").trim(),
      getComputedStyle(root).getPropertyValue("--c-engineering").trim(),
    ];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 110;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = colors[i % colors.length];
      p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      p.style.setProperty("--tr", Math.random() * 360 + "deg");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 950);
    }
  }

  function triggerOverclock() {
    burstConfetti();
    showToast(EGG_MESSAGES[Math.floor(Math.random() * EGG_MESSAGES.length)]);
  }

  // fill in your real LinkedIn URL here once you have it handy
  const linkedin = document.getElementById("linkedin-link");
  if (linkedin) {
    linkedin.addEventListener("click", (e) => {
      if (linkedin.getAttribute("href") === "#") e.preventDefault();
    });
  }

  setTrackY(yForIndex(0), false);
  applyMode("overview", { skipMove: true });
})();
