(function () {
  const root = document.documentElement;
  const body = document.body;
  const crate = document.getElementById("crate");
  const sleeves = Array.from(crate.querySelectorAll(".sleeve"));
  const platter = document.getElementById("platter");
  const platterLabel = document.getElementById("platter-label");
  const trackName = document.getElementById("track-name");
  const needle = document.getElementById("needle");
  const hint = document.getElementById("hint");
  const toast = document.getElementById("toast");

  const MODES = ["product", "consulting", "data", "engineering"];

  const specData = {
    overview: {
      config: "Nothing queued",
      stack: "Product · Consulting · Data · Engineering",
      proven: "PwC · WizLearnr · Guidewire · Capgemini · Samsung R&D",
      shipped: "6+ features · 20M+ data points · 100+ interviews",
      deploy: "Versatile — plays well with any team",
      track: "—",
    },
    product: {
      config: "Product",
      stack: "Prompt Engineering · Wireframing · Market Research",
      proven: "WizLearnr, Founder's Office",
      shipped: "MVP roadmap shortlisted by the Telangana Government",
      deploy: "Curious, fast-moving, zero-to-one",
      track: "PRODUCT",
    },
    consulting: {
      config: "Consulting",
      stack: "SAP IBP · Financial Modeling · Sensitivity Analysis",
      proven: "PwC · HP Tech Ventures",
      shipped: "Master-data cleanup for a live SAP IBP rollout",
      deploy: "Methodical, client-facing, unflappable",
      track: "CONSULTING",
    },
    data: {
      config: "Data",
      stack: "Snowflake · Python · Tableau · Machine Learning",
      proven: "Capgemini · Samsung R&D · Consilience.AI",
      shipped: "20M+ data points migrated, compute cost −30%",
      deploy: "Precise, high-throughput, unglamorous",
      track: "DATA",
    },
    engineering: {
      config: "Engineering",
      stack: "Java · AWS · Security & Auth · Cloud Platforms",
      proven: "Guidewire Software",
      shipped: "6+ features shipped, 30+ vulnerabilities closed",
      deploy: "Deliberate, secure, ships quietly",
      track: "ENGINEERING",
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
    "[data-mode].track, [data-mode].work-card, [data-mode].chip"
  );

  let picked = null; // currently playing sleeve element, or null

  function setSpec(mode) {
    const d = specData[mode];
    specEls.config.textContent = d.config;
    specEls.stack.textContent = d.stack;
    specEls.proven.textContent = d.proven;
    specEls.shipped.textContent = d.shipped;
    specEls.deploy.textContent = d.deploy;
    trackName.textContent = d.track;

    const accent = getComputedStyle(root).getPropertyValue(accentVar[mode]).trim();
    root.style.setProperty("--accent", accent);
  }

  function syncSections(mode) {
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
  }

  function play(sleeve) {
    sleeves.forEach((s) => s.classList.remove("is-picked", "is-near"));
    sleeve.classList.add("is-picked");
    picked = sleeve;
    body.dataset.mode = sleeve.dataset.mode;

    needle.classList.remove("is-down");
    platter.classList.remove("is-spinning");

    setTimeout(() => {
      needle.classList.add("is-down");
      platter.classList.add("is-spinning");
      setSpec(sleeve.dataset.mode);
      syncSections(sleeve.dataset.mode);
      hint.textContent = "click the playing record to eject it";
    }, 260);
  }

  function eject() {
    sleeves.forEach((s) => s.classList.remove("is-picked", "is-near"));
    picked = null;
    body.dataset.mode = "overview";
    needle.classList.remove("is-down");
    platter.classList.remove("is-spinning");
    setSpec("overview");
    syncSections("overview");
    hint.textContent = "flip through the crate, pull one out to play it — click it again to eject";
  }

  crate.addEventListener("mousemove", (e) => {
    sleeves.forEach((s) => {
      if (s === picked) return;
      const r = s.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const dist = Math.abs(e.clientX - cx);
      s.classList.toggle("is-near", dist < 44);
    });
  });
  crate.addEventListener("mouseleave", () => {
    sleeves.forEach((s) => {
      if (s !== picked) s.classList.remove("is-near");
    });
  });

  crate.addEventListener("click", (e) => {
    const s = e.target.closest(".sleeve");
    if (!s) return;
    if (s === picked) {
      eject();
    } else {
      play(s);
    }
  });

  // keyboard: focus a sleeve and press Enter/Space to toggle
  sleeves.forEach((s) => {
    s.setAttribute("tabindex", "0");
    s.setAttribute("role", "button");
    s.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (s === picked) eject();
        else play(s);
      }
    });
  });

  // --- easter egg: scratch (rapid re-picking) ---
  const EGG_MESSAGES = [
    "That's a scratch, not a career pivot. Nice reflexes though.",
    "DJ mode unlocked. No such configuration exists — but respect.",
    "You've scratched a résumé. Bold, but the pressing survives.",
  ];
  let recentPicks = [];

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function burstConfetti(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = [
      getComputedStyle(root).getPropertyValue("--c-product").trim(),
      getComputedStyle(root).getPropertyValue("--c-consulting").trim(),
      getComputedStyle(root).getPropertyValue("--c-data").trim(),
      getComputedStyle(root).getPropertyValue("--c-engineering").trim(),
    ];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
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

  crate.addEventListener("click", (e) => {
    const s = e.target.closest(".sleeve");
    if (!s) return;
    const now = Date.now();
    recentPicks.push(now);
    recentPicks = recentPicks.filter((t) => now - t < 2500);
    if (recentPicks.length >= 5) {
      recentPicks = [];
      burstConfetti(platter);
      showToast(EGG_MESSAGES[Math.floor(Math.random() * EGG_MESSAGES.length)]);
    }
  });

  const linkedin = document.getElementById("linkedin-link");
  if (linkedin) {
    linkedin.addEventListener("click", (e) => {
      if (linkedin.getAttribute("href") === "#") e.preventDefault();
    });
  }

  setSpec("overview");
})();
