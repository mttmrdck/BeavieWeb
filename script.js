const scents = [
  {
    id: "verdius",
    name: "Verdius",
    image: "assets/products/verdius.png",
    cardImage: "assets/cards/verdius_card.png",
    subtitle: "Post-Shower Crispness",
    mood: "Clean cold lighting, green apple glow, crushed ice, and slate mist.",
    color: "#9fb99b",
    glow: "#9bd9c6",
    atmosphere: "atmos-verdius",
    objects: ["droplets", "apple apple-a", "apple apple-b", "ice ice-a", "ice ice-b"],
    description:
      "A revitalizing breath of cool clarity. Verdius captures freshly washed skin, chilled green apple, and morning air with effortless polish.",
    notes: {
      top: ["🍏 Green Apple", "🍋 Bergamot", "❄️ Iced Aldehydes"],
      middle: ["💜 Lavender", "🌿 Aromatic Herbs", "🌱 Rosemary"],
      base: ["🪵 Cedarwood", "🌾 Vetiver", "☁️ White Musk"],
    },
    accords: [
      ["Aromatic", 94, "#4fc9ad"],
      ["Fresh Spicy", 86, "#abd97d"],
      ["Woody", 70, "#96714c"],
      ["Green Apple", 66, "#7bc461"],
      ["Watery", 62, "#78bbec"],
      ["Ozonic", 58, "#8fc8ff"],
      ["Musky", 48, "#c7b7dd"],
      ["Mineral", 42, "#8ab8b5"],
      ["Citrus", 38, "#f0e36f"],
      ["Clean", 34, "#c7eef8"],
      ["Crisp", 30, "#a2d9cf"],
    ],
    facts: {
      Family: "Aromatic Fresh",
      Intensity: "Bright",
      Longevity: "6-8 Hours",
      Sillage: "Clean Trail",
      Season: "Spring / Summer",
      "Time of Day": "Morning",
    },
  },
  {
    id: "tonvira",
    name: "Tonvira",
    image: "assets/products/tonvira.png",
    cardImage: "assets/cards/tonvira_card.png",
    subtitle: "The Peak / CEO",
    mood: "Midnight executive office, marble columns, frozen mint, and data-screen glow.",
    color: "#31486b",
    glow: "#86a8d5",
    atmosphere: "atmos-tonvira",
    objects: ["column column-a", "column column-b", "ticker", "mint", "ice ice-a"],
    description:
      "Precision, composure, command. Cool mint meets warm vanilla and timeless woods, crafted for ambition without compromise.",
    notes: {
      top: ["🌿 Mint", "🍋 Bergamot", "🟤 Cardamom"],
      middle: ["💜 Lavender", "🍃 Sage", "🍵 Green Tea"],
      base: ["🤍 Vanilla", "🟠 Amberwood", "🪵 Cedar"],
    },
    accords: [
      ["Vanilla", 96, "#f0dfbd"],
      ["Aromatic", 88, "#99ccd2"],
      ["Green", 72, "#5fc46b"],
      ["Mint", 66, "#63dcc9"],
      ["Woody", 58, "#8d5d35"],
      ["Fresh Spicy", 52, "#a4cf30"],
      ["Ambery", 48, "#d67c35"],
      ["Powdery", 44, "#ceb9c6"],
      ["Herbal", 38, "#8ea071"],
      ["Musky", 34, "#b8a8c7"],
      ["Earthy", 30, "#665849"],
    ],
    facts: {
      Family: "Aromatic Woody",
      Intensity: "Controlled",
      Longevity: "8-10 Hours",
      Sillage: "Confident",
      Season: "All Season",
      "Time of Day": "Work / Evening",
    },
  },
  {
    id: "chestnut-rush",
    name: "Chestnut Rush",
    image: "assets/products/chestnutrush.png",
    cardImage: "assets/cards/chestnutrush_card.png",
    subtitle: "The Gentleman's Lounge",
    mood: "Dark mahogany library, leather books, amber rum glow, and cigar smoke.",
    color: "#6c4432",
    glow: "#d18a52",
    atmosphere: "atmos-chestnut",
    objects: ["books", "rum-glass", "smoke", "chestnut"],
    description:
      "An evocative blend of warmth and sophistication: rum, spices, rich tobacco, smooth leather, vanilla, and amber.",
    notes: {
      top: ["🥃 Rum", "🌰 Chestnut", "🔴 Saffron"],
      middle: ["🚬 Tobacco", "🧥 Leather", "💜 Lavender"],
      base: ["🤍 Vanilla", "🟠 Amber", "🪵 Sandalwood"],
    },
    accords: [
      ["Warm Spicy", 96, "#d94f2d"],
      ["Vanilla", 84, "#f1dfb7"],
      ["Aromatic", 76, "#92c9bd"],
      ["Rum", 68, "#bb652e"],
      ["Woody", 62, "#a56c43"],
      ["Tobacco", 56, "#9f784e"],
      ["Amber", 52, "#d87c36"],
      ["Leathery", 48, "#ba8a5e"],
      ["Smoky", 42, "#c4bbb5"],
      ["Sweet", 36, "#e26377"],
      ["Chestnut", 30, "#c89262"],
    ],
    facts: {
      Family: "Warm Spicy",
      Intensity: "Rich",
      Longevity: "9-11 Hours",
      Sillage: "Elegant",
      Season: "Fall / Winter",
      "Time of Day": "Evening",
    },
  },
  {
    id: "wavekiss",
    name: "Wavekiss",
    image: "assets/products/wavekiss.png",
    cardImage: "assets/cards/wavekiss_card.png",
    subtitle: "Aegean Zenith",
    mood: "Ocean wave splash, sea salt crystals, lemon peels, and frozen droplets.",
    color: "#9bcfe0",
    glow: "#8fd8ff",
    atmosphere: "atmos-wavekiss",
    objects: ["wave", "lemon lemon-a", "lemon lemon-b", "salt", "droplets"],
    description:
      "A surge of marine freshness. Sunlit citrus meets crystalline sea salt and airy waves: pure, invigorating, and clear.",
    notes: {
      top: ["🍋 Lemon", "🍋 Bergamot", "🧂 Sea Salt"],
      middle: ["🌊 Marine Notes", "🌼 Neroli", "💧 Aquatic Accord"],
      base: ["🪵 Driftwood", "☁️ White Musk", "🪨 Soft Ambergris"],
    },
    accords: [
      ["Citrus", 96, "#f1dc61"],
      ["Marine", 84, "#4fcaf0"],
      ["Fresh", 76, "#b7eff7"],
      ["Salty", 66, "#c8e0ea"],
      ["Watery", 54, "#67b8d8"],
      ["Aromatic", 48, "#66c1b1"],
      ["Ozonic", 42, "#8fc8ff"],
      ["Musky", 36, "#c5b8dc"],
      ["Lemon Zest", 32, "#f3d84e"],
      ["Mineral", 28, "#8dbabd"],
      ["Clean", 24, "#e0edf2"],
    ],
    facts: {
      Family: "Marine Citrus",
      Intensity: "Sparkling",
      Longevity: "6-8 Hours",
      Sillage: "Fresh",
      Season: "Summer",
      "Time of Day": "Daytime",
    },
  },
  {
    id: "seductress",
    name: "Seductress",
    image: "assets/products/seductress.png",
    cardImage: "assets/cards/seductress_card.png",
    subtitle: "Midnight Raspberry CEO",
    mood: "Black obsidian marble, silver veins, lace texture, raspberries, and black cherries.",
    color: "#41343f",
    glow: "#d44a68",
    atmosphere: "atmos-seductress",
    objects: ["lace", "raspberry raspberry-a", "raspberry raspberry-b", "cherry cherry-a", "cherry cherry-b"],
    description:
      "A bold, magnetic fragrance where juicy dark fruits meet luxurious florals and smoldering base notes.",
    notes: {
      top: ["🔴 Raspberry", "🍒 Black Cherry", "🌶️ Pink Pepper"],
      middle: ["🌹 Rose", "🤍 Jasmine", "🌸 Peony"],
      base: ["🤍 Vanilla", "🍃 Patchouli", "🟠 Amber"],
    },
    accords: [
      ["Fruity", 94, "#ea474d"],
      ["Sweet", 78, "#df638c"],
      ["Floral", 64, "#e087c2"],
      ["Cherry", 58, "#c93657"],
      ["Vanilla", 50, "#eadcaf"],
      ["Amber", 42, "#d77942"],
      ["Patchouli", 36, "#9ca765"],
      ["Musky", 32, "#cfbec9"],
      ["Powdery", 28, "#cabfb6"],
      ["Juicy Berry", 44, "#be3d73"],
      ["Dark Gourmand", 38, "#a66f55"],
    ],
    facts: {
      Family: "Fruity Floral",
      Intensity: "Intense",
      Longevity: "8-10 Hours",
      Sillage: "Strong",
      Season: "Fall / Winter",
      "Time of Day": "Evening / Night",
    },
  },
  {
    id: "celestia-rose",
    name: "Celestia Rose",
    image: "assets/products/celestiarose.png",
    cardImage: "assets/cards/celestiarose_card.png",
    subtitle: "Glacial Floral / Lotus / Ice",
    mood: "Glacial ice wall, frozen pink peony, lotus petals, and trapped air bubbles.",
    color: "#b9c8e6",
    glow: "#b5ddff",
    atmosphere: "atmos-celestia",
    objects: ["ice-wall", "peony", "lotus", "bubbles"],
    description:
      "Frozen petals and luminous freshness. Rose and lotus meet crystalline air in an icy floral haute couture composition.",
    notes: {
      top: ["🪷 Frosted Lotus", "❄️ Icy Accord", "🌸 Pink Peony"],
      middle: ["🌹 Rose", "🤍 Water Lily", "🌫️ Translucent Florals"],
      base: ["☁️ White Musk", "🪵 Pale Woods", "🟠 Clean Amber"],
    },
    accords: [
      ["Floral", 96, "#f0a0cf"],
      ["Fresh", 82, "#aee7f2"],
      ["Aquatic", 74, "#7bbcff"],
      ["Icy", 64, "#c8e6ff"],
      ["Rose", 56, "#d84b8a"],
      ["Lotus", 50, "#d7b2ef"],
      ["Watery", 44, "#7fbbe8"],
      ["Clean", 38, "#d7edf5"],
      ["Airy", 34, "#c8dff0"],
      ["White Floral", 32, "#efe2d2"],
      ["Mineral", 28, "#9bc9cb"],
    ],
    facts: {
      Family: "Floral Aquatic",
      Intensity: "Luminous",
      Longevity: "7-9 Hours",
      Sillage: "Refined",
      Season: "Winter / Spring",
      "Time of Day": "Day / Evening",
    },
  },
  {
    id: "berry-tease",
    name: "Berry Tease",
    image: "assets/products/berrytease.png",
    cardImage: "assets/cards/berrytease_card.png",
    subtitle: "Vineyard Opulence / Grape",
    mood: "Rich violet velvet drapery, whole frosted grapes, and plush silver light.",
    color: "#693450",
    glow: "#a65a93",
    atmosphere: "atmos-berry",
    objects: ["velvet", "grapes grapes-a", "grapes grapes-b", "silver-sphere sphere-a"],
    description:
      "A luscious celebration of whole frosted grapes and velvety sweetness with plush fruit and deep, indulgent warmth.",
    notes: {
      top: ["🍇 Grape", "🟣 Plum", "🔴 Red Berries"],
      middle: ["💜 Violet", "🪻 Heliotrope", "💧 Fruit Nectar"],
      base: ["🤍 Vanilla", "🍃 Patchouli", "🟠 Amber"],
    },
    accords: [
      ["Sweet", 96, "#d84b8a"],
      ["Vanilla", 76, "#eadfc8"],
      ["Fruity", 66, "#df4050"],
      ["Patchouli", 58, "#9caf72"],
      ["Grape", 54, "#9b6cb3"],
      ["Amber", 46, "#db8c65"],
      ["Soft Spice", 42, "#d99977"],
      ["Gourmand", 38, "#d9a295"],
      ["Powdery", 34, "#d2c2c4"],
      ["Musky", 30, "#cec0ca"],
      ["Velvety", 28, "#d899a5"],
    ],
    facts: {
      Family: "Sweet Fruity",
      Intensity: "Opulent",
      Longevity: "8-10 Hours",
      Sillage: "Moderate",
      Season: "Fall",
      "Time of Day": "Evening",
    },
  },
  {
    id: "lily-valley",
    name: "Lily in the Valley",
    image: "assets/products/litv.png",
    cardImage: "assets/cards/litv_card.png",
    subtitle: "Ethereal Vanilla / White Floral",
    mood: "Vanilla-white architectural garden, lily petals, orchids, silver spheres, and mist.",
    color: "#e4e0d6",
    glow: "#fff3d6",
    atmosphere: "atmos-lily",
    objects: ["arch", "orchid orchid-a", "orchid orchid-b", "petals", "silver-sphere sphere-a", "silver-sphere sphere-b"],
    description:
      "A soft radiance of white florals and creamy vanilla blooming like morning light through a veil of pure serenity.",
    notes: {
      top: ["🤍 Vanilla Orchid", "🌼 Neroli", "🍐 Soft Pear"],
      middle: ["🔔 Lily of the Valley", "🤍 Jasmine Petals", "🌸 White Floral Accord"],
      base: ["🤍 Vanilla", "☁️ White Musk", "🪵 Sandalwood"],
    },
    accords: [
      ["White Floral", 96, "#f3f2ed"],
      ["Vanilla", 78, "#e8ddb9"],
      ["Fresh", 68, "#b8e7e2"],
      ["Powdery", 64, "#c8c0bd"],
      ["Musky", 44, "#e2d9df"],
      ["Creamy", 42, "#dfd4b8"],
      ["Airy", 38, "#dfe8ed"],
      ["Green", 34, "#9ac7a4"],
      ["Floral Dew", 30, "#ebb7cb"],
      ["Soft Woody", 26, "#c2a98c"],
      ["Luminous Amber", 24, "#d79c83"],
    ],
    facts: {
      Family: "White Floral Vanilla",
      Intensity: "Soft Radiance",
      Longevity: "7-9 Hours",
      Sillage: "Graceful",
      Season: "Spring",
      "Time of Day": "Daytime",
    },
  },
];

const collectionGrid = document.querySelector("#collection-grid");
const scentSections = document.querySelector("#scent-sections");
const drawer = document.querySelector("#scent-drawer");
const backdrop = document.querySelector("#drawer-backdrop");

function bottleMarkup(scent, extraClass = "", loading = "lazy") {
  return `
    <img
      class="product-bottle ${extraClass}"
      src="${scent.image}"
      alt="BEAVIE ${scent.name} perfume bottle"
      loading="${loading}"
      decoding="async"
    />
  `;
}

function accordMarkup(accords, compact = false) {
  return accords
    .map(
      ([label, value, color]) => `
        <div class="accord-row ${compact ? "compact" : ""}">
          <span>${label}</span>
          <div class="accord-track">
            <i style="--value:${value}%; --bar:${color}"></i>
          </div>
        </div>
      `,
    )
    .join("");
}

function objectMarkup(objects) {
  return objects.map((item) => `<span class="scene-object ${item}" aria-hidden="true"></span>`).join("");
}

function atmosphereMarkup(scent) {
  if (scent.id === "verdius") {
    return `
      <div class="verdius-atmosphere" aria-hidden="true">
        <div class="verdius-bg"></div>
        <div class="verdius-rain"></div>
        <div class="verdius-mist-layer"></div>
        <div class="verdius-droplets"></div>
        <div class="verdius-reflection"></div>
      </div>
    `;
  }

  if (scent.id === "tonvira") {
    return `
      <div class="tonvira-atmosphere" aria-hidden="true">
        <div class="tonvira-architecture"></div>
        <div class="tonvira-glow"></div>
        <div class="tonvira-rays"></div>
        <div class="tonvira-dust"></div>
        <div class="tonvira-shimmer"></div>
        <div class="tonvira-marble-floor"></div>
        <div class="tonvira-greek-key"></div>
        <div class="tonvira-olive tonvira-olive-left"></div>
        <div class="tonvira-olive tonvira-olive-right"></div>
      </div>
    `;
  }

  return "";
}

collectionGrid.innerHTML = scents
  .map(
    (scent, index) => `
      <article class="collection-card ${scent.atmosphere}" style="--scent:${scent.color}; --glow:${scent.glow}; --card-bg:url('${scent.cardImage}')">
        <div class="noise"></div>
        ${objectMarkup(scent.objects.slice(0, 3))}
        ${bottleMarkup(scent, "card-bottle", "lazy")}
        <div class="card-copy">
          <p>${String(index + 1).padStart(2, "0")}</p>
          <h3>${scent.name}</h3>
          <span>${scent.subtitle}</span>
          <a href="#${scent.id}" class="view-link">View Scent</a>
        </div>
      </article>
    `,
  )
  .join("");

scentSections.innerHTML = scents
  .map(
    (scent, index) => `
      <section class="scent-section cinematic-section ${scent.atmosphere}" id="${scent.id}" style="--scent:${scent.color}; --glow:${scent.glow}">
        ${atmosphereMarkup(scent)}
        <div class="noise"></div>
        <div class="mist mist-a"></div>
        <div class="mist mist-b"></div>
        ${objectMarkup(scent.objects)}
        <div class="scent-copy reveal">
          <p class="eyebrow">Collection / ${String(index + 1).padStart(2, "0")}</p>
          <h2>${scent.name}</h2>
          <p class="subtitle">${scent.subtitle}</p>
          <span class="hairline"></span>
          <p>${scent.description}</p>
          <button class="lux-button discover-button" type="button" data-scent="${index}">
            Discover the Scent <span aria-hidden="true">-></span>
          </button>
        </div>
        <div class="scent-stage reveal" aria-hidden="true">
          ${bottleMarkup(scent, "scent-product-bottle", "lazy")}
          <div class="product-shadow"></div>
        </div>
        <aside class="accord-panel reveal">
          <p class="panel-title">Main Accords</p>
          ${accordMarkup(scent.accords.slice(0, 8), true)}
        </aside>
      </section>
    `,
  )
  .join("");

function openDrawer(index) {
  const scent = scents[index];
  document.querySelector("#drawer-kicker").textContent = `BEAVIE Parfums / ${scent.name}`;
  document.querySelector("#drawer-title").textContent = scent.name;
  document.querySelector("#drawer-subtitle").textContent = scent.mood;
  document.querySelector("#drawer-about").textContent = scent.description;
  document.querySelector("#drawer-notes").innerHTML = Object.entries(scent.notes)
    .map(
      ([group, notes]) => `
        <div class="note-group">
          <h3>${group} Notes</h3>
          <div class="note-chips">
            ${notes.map((note) => `<span>${note}</span>`).join("")}
          </div>
        </div>
      `,
    )
    .join("");
  document.querySelector("#drawer-accords").innerHTML = accordMarkup(scent.accords);
  document.querySelector("#drawer-facts").innerHTML = Object.entries(scent.facts)
    .map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  backdrop.hidden = false;
  requestAnimationFrame(() => {
    document.body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");
  });
}

function closeDrawer() {
  document.body.classList.remove("drawer-open");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    backdrop.hidden = true;
  }, 280);
}

document.addEventListener("click", (event) => {
  const discover = event.target.closest(".discover-button");
  if (discover) {
    openDrawer(Number(discover.dataset.scent));
    return;
  }

  const close = event.target.closest(".drawer-close");
  if (close || event.target === backdrop) {
    closeDrawer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("drawer-open")) {
    closeDrawer();
  }
});

const verdiusSection = document.querySelector("#verdius");
const allowsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (verdiusSection && allowsMotion) {
  let rafId = 0;
  let targetX = 0;
  let targetY = 0;

  function updateVerdiusParallax() {
    verdiusSection.style.setProperty("--rain-x", `${targetX * 10}px`);
    verdiusSection.style.setProperty("--rain-y", `${targetY * 6}px`);
    verdiusSection.style.setProperty("--mist-x", `${targetX * -16}px`);
    rafId = 0;
  }

  verdiusSection.addEventListener("pointermove", (event) => {
    const rect = verdiusSection.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = (event.clientY - rect.top) / rect.height - 0.5;

    if (!rafId) {
      rafId = requestAnimationFrame(updateVerdiusParallax);
    }
  });

  verdiusSection.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;

    if (!rafId) {
      rafId = requestAnimationFrame(updateVerdiusParallax);
    }
  });
}

const tonviraSection = document.querySelector("#tonvira");

if (tonviraSection && allowsMotion) {
  let rafId = 0;
  let targetX = 0;
  let targetY = 0;

  function updateTonviraParallax() {
    tonviraSection.style.setProperty("--tonvira-bg-x", `${targetX * 8}px`);
    tonviraSection.style.setProperty("--tonvira-bg-y", `${targetY * 4}px`);
    tonviraSection.style.setProperty("--tonvira-olive-x", `${targetX * -18}px`);
    tonviraSection.style.setProperty("--tonvira-olive-y", `${targetY * -8}px`);
    tonviraSection.style.setProperty("--tonvira-ray-x", `${targetX * 5}px`);
    rafId = 0;
  }

  tonviraSection.addEventListener("pointermove", (event) => {
    const rect = tonviraSection.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = (event.clientY - rect.top) / rect.height - 0.5;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTonviraParallax);
    }
  });

  tonviraSection.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTonviraParallax);
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
