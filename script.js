(function () {
  const root = document.documentElement;
  const body = document.body;
  const tagline = document.getElementById("tagline");
  const pills = document.querySelectorAll(".lens__pill");

  const taglines = {
    overview:
      "Product, consulting, data, engineering — six years of sitting at the intersection so the roadmap, the model and the migration all agree with each other.",
    product:
      "I've turned 100+ user conversations into a roadmap the Telangana Government shortlisted.",
    consulting:
      "I've turned messy SAP master data into decisions PwC's clients could actually act on.",
    data:
      "I've moved 20M+ data points onto Snowflake and cut compute costs by 30%.",
    engineering:
      "I've shipped 6+ features and closed 30+ security gaps on Guidewire's cloud platform.",
  };

  const accents = {
    overview: getComputedStyle(root).getPropertyValue("--ink").trim(),
    product: getComputedStyle(root).getPropertyValue("--c-product").trim(),
    consulting: getComputedStyle(root).getPropertyValue("--c-consulting").trim(),
    data: getComputedStyle(root).getPropertyValue("--c-data").trim(),
    engineering: getComputedStyle(root).getPropertyValue("--c-engineering").trim(),
  };

  const modeItems = document.querySelectorAll("[data-mode]");

  function setMode(mode) {
    body.dataset.mode = mode;
    root.style.setProperty("--accent", accents[mode] || accents.overview);
    tagline.textContent = taglines[mode] || taglines.overview;

    pills.forEach((pill) => {
      const active = pill.dataset.mode === mode;
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", String(active));
    });

    modeItems.forEach((item) => {
      // skip the pills themselves, they're handled above
      if (item.classList.contains("lens__pill")) return;

      if (mode === "overview") {
        item.classList.remove("is-active", "is-dim");
        return;
      }
      if (item.dataset.mode === mode) {
        item.classList.add("is-active");
        item.classList.remove("is-dim");
      } else {
        item.classList.add("is-dim");
        item.classList.remove("is-active");
      }
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => setMode(pill.dataset.mode));
  });

  // fill in your real LinkedIn URL here once you have it handy
  const linkedin = document.getElementById("linkedin-link");
  if (linkedin) {
    linkedin.addEventListener("click", (e) => {
      if (linkedin.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  }

  setMode("overview");
})();
