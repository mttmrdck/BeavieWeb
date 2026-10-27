/* =====================================================================
   BEAVIE Parfums — catalog data + interactions
   ---------------------------------------------------------------------
   EDIT THE COLLECTION HERE. Every card, scent section, accord bar, note
   chip and overlay is generated from this array — add, remove or reorder
   entries and the page follows.

   Field guide
   - id          used for the section anchor (#id) and asset file names
   - scene       full-bleed atmosphere image (assets/images/scenes)
   - bottle      transparent bottle render (assets/images/bottles)
   - glow        accent light for this scent (buttons, bars, halos)
   - tint        colour washed over the scene so copy stays legible
   - tone        "dark" (light text) or "light" (ink text) section theme
   - focus       CSS background-position for the scene image
   - particles   foreground layer: droplets | ticker | smoke | waves |
                 lace | bubbles | velvet | spheres
   - accords     [label, intensity 0-100, bar colour] — shown strongest
                 first, so order here doesn't matter
   - facts       "About this scent" rows, shown in this order
   ===================================================================== */
const scents = [
  {
    id: "verdius",
    name: "Verdius",
    subtitle: "Post-Shower Crispness",
    mood: "Clean cold lighting, green apple glow, crushed ice, and slate mist.",
    description:
      "A revitalizing breath of cool clarity. Verdius captures freshly washed skin, chilled green apple, and morning air with effortless polish.",
    scene: "assets/images/scenes/verdius.webp",
    bottle: "assets/images/bottles/verdius.webp",
    glow: "#9bd9c6",
    tint: "8, 20, 18",
    tone: "dark",
    focus: "35% 60%",
    particles: "droplets",
    notes: {
      top: ["Green Apple", "Bergamot", "Iced Aldehydes"],
      middle: ["Lavender", "Aromatic Herbs", "Rosemary"],
      base: ["Cedarwood", "Vetiver", "White Musk"],
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
      Longevity: "6–8 Hours",
      Sillage: "Clean Trail",
      Season: "Spring / Summer",
      "Time of Day": "Morning",
    },
  },
  {
    id: "tonvira",
    name: "Tonvira",
    subtitle: "The Peak / CEO",
    mood: "Midnight executive office, marble columns, frozen mint, and data-screen glow.",
    description:
      "Precision, composure, command. Cool mint meets warm vanilla and timeless woods, crafted for ambition without compromise.",
    scene: "assets/images/scenes/tonvira.webp",
    bottle: "assets/images/bottles/tonvira.webp",
    glow: "#86a8d5",
    tint: "6, 12, 30",
    tone: "dark",
    focus: "50% 50%",
    particles: "ticker",
    notes: {
      top: ["Mint", "Bergamot", "Cardamom"],
      middle: ["Lavender", "Sage", "Green Tea"],
      base: ["Vanilla", "Amberwood", "Cedar"],
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
      ["Citrus", 26, "#e6d86a"],
    ],
    facts: {
      Family: "Aromatic Woody",
      Intensity: "Controlled",
      Longevity: "8–10 Hours",
      Sillage: "Confident",
      Season: "All Season",
      "Time of Day": "Work / Evening",
    },
  },
  {
    id: "chestnut-rush",
    name: "Chestnut Rush",
    subtitle: "The Gentleman’s Lounge",
    mood: "Dark mahogany library, leather books, amber rum glow, and cigar smoke.",
    description:
      "An evocative blend of warmth and sophistication: rum, spices, rich tobacco, smooth leather, vanilla, and amber.",
    scene: "assets/images/scenes/chestnut-rush.webp",
    bottle: "assets/images/bottles/chestnut-rush.webp",
    glow: "#d18a52",
    tint: "22, 10, 6",
    tone: "dark",
    focus: "45% 50%",
    particles: "smoke",
    notes: {
      top: ["Rum", "Chestnut", "Saffron"],
      middle: ["Tobacco", "Leather", "Lavender"],
      base: ["Vanilla", "Amber", "Sandalwood"],
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
      ["Balsamic", 33, "#8a5a3a"],
      ["Chestnut", 30, "#c89262"],
      ["Soft Spice", 26, "#d99977"],
    ],
    facts: {
      Family: "Warm Spicy",
      Intensity: "Rich",
      Longevity: "9–11 Hours",
      Sillage: "Elegant",
      Season: "Fall / Winter",
      "Time of Day": "Evening",
    },
  },
  {
    id: "wavekiss",
    name: "Wavekiss",
    subtitle: "Aegean Zenith",
    mood: "Ocean wave splash, sea salt crystals, lemon peels, and frozen droplets.",
    description:
      "A surge of marine freshness. Sunlit citrus meets crystalline sea salt and airy waves: pure, invigorating, and clear.",
    scene: "assets/images/scenes/wavekiss.webp",
    bottle: "assets/images/bottles/wavekiss.webp",
    glow: "#8fd8ff",
    tint: "2, 16, 32",
    tone: "dark",
    focus: "50% 40%",
    particles: "waves",
    notes: {
      top: ["Lemon", "Bergamot", "Sea Salt"],
      middle: ["Marine Notes", "Neroli", "Aquatic Accord"],
      base: ["Driftwood", "White Musk", "Soft Ambergris"],
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
      ["Airy", 26, "#d6e8f2"],
      ["Clean", 22, "#e0edf2"],
    ],
    facts: {
      Family: "Marine Citrus",
      Intensity: "Sparkling",
      Longevity: "6–8 Hours",
      Sillage: "Fresh",
      Season: "Summer",
      "Time of Day": "Daytime",
    },
  },
  {
    id: "seductress",
    name: "Seductress",
    subtitle: "Midnight Raspberry CEO",
    mood: "Black obsidian marble, silver veins, lace texture, raspberries, and black cherries.",
    description:
      "A bold, magnetic fragrance where juicy dark fruits meet luxurious florals and smoldering base notes.",
    scene: "assets/images/scenes/seductress.webp",
    bottle: "assets/images/bottles/seductress.webp",
    glow: "#d44a68",
    tint: "16, 4, 10",
    tone: "dark",
    focus: "50% 50%",
    particles: "lace",
    notes: {
      top: ["Raspberry", "Black Cherry", "Pink Pepper"],
      middle: ["Rose", "Jasmine", "Peony"],
      base: ["Vanilla", "Patchouli", "Amber"],
    },
    accords: [
      ["Fruity", 94, "#ea474d"],
      ["Sweet", 78, "#df638c"],
      ["Floral", 64, "#e087c2"],
      ["Cherry", 58, "#c93657"],
      ["Vanilla", 50, "#eadcaf"],
      ["Juicy Berry", 44, "#be3d73"],
      ["Amber", 42, "#d77942"],
      ["Dark Gourmand", 38, "#a66f55"],
      ["Patchouli", 36, "#9ca765"],
      ["Musky", 32, "#cfbec9"],
      ["Powdery", 28, "#cabfb6"],
      ["Soft Woody", 24, "#a98468"],
    ],
    facts: {
      Family: "Fruity Floral",
      Intensity: "Intense",
      Longevity: "8–10 Hours",
      Sillage: "Strong",
      Season: "Fall / Winter",
      "Time of Day": "Evening / Night",
    },
  },
  {
    id: "celestia-rose",
    name: "Celestia Rose",
    subtitle: "Glacial Floral / Lotus / Ice",
    mood: "Glacial ice wall, frozen pink peony, lotus petals, and trapped air bubbles.",
    description:
      "Frozen petals and luminous freshness. Rose and lotus meet crystalline air in an icy floral haute couture composition.",
    scene: "assets/images/scenes/celestia-rose.webp",
    bottle: "assets/images/bottles/celestia-rose.webp",
    glow: "#b5ddff",
    tint: "10, 22, 44",
    tone: "dark",
    focus: "50% 50%",
    particles: "bubbles",
    notes: {
      top: ["Frosted Lotus", "Icy Accord", "Pink Peony"],
      middle: ["Rose", "Water Lily", "Translucent Florals"],
      base: ["White Musk", "Pale Woods", "Clean Amber"],
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
      ["Musky", 26, "#cfc3dc"],
      ["Soft Green", 24, "#a8cfa4"],
    ],
    facts: {
      Family: "Floral Aquatic",
      Intensity: "Luminous",
      Longevity: "7–9 Hours",
      Sillage: "Refined",
      Season: "Winter / Spring",
      "Time of Day": "Day / Evening",
    },
  },
  {
    id: "berry-tease",
    name: "Berry Tease",
    subtitle: "Vineyard Opulence / Grape",
    mood: "Rich violet velvet drapery, whole frosted grapes, and plush silver light.",
    description:
      "A luscious celebration of whole frosted grapes and velvety sweetness with plush fruit and deep, indulgent warmth.",
    scene: "assets/images/scenes/berry-tease.webp",
    bottle: "assets/images/bottles/berry-tease.webp",
    glow: "#b27ad6",
    tint: "14, 6, 26",
    tone: "dark",
    focus: "50% 55%",
    particles: "velvet",
    notes: {
      top: ["Grape", "Plum", "Red Berries"],
      middle: ["Violet", "Heliotrope", "Fruit Nectar"],
      base: ["Vanilla", "Patchouli", "Amber"],
    },
    accords: [
      ["Sweet", 96, "#d84b8a"],
      ["Vanilla", 76, "#eadfc8"],
      ["Fruity", 66, "#df4050"],
      ["Patchouli", 58, "#9caf72"],
      ["Grape", 54, "#9b6cb3"],
      ["Juicy Purple Fruit", 50, "#7d3f9e"],
      ["Amber", 46, "#db8c65"],
      ["Soft Spice", 42, "#d99977"],
      ["Gourmand", 38, "#d9a295"],
      ["Powdery", 34, "#d2c2c4"],
      ["Musky", 30, "#cec0ca"],
      ["Velvety", 28, "#d899a5"],
      ["Woody", 26, "#8f6a4a"],
    ],
    facts: {
      Family: "Sweet Fruity",
      Intensity: "Opulent",
      Longevity: "8–10 Hours",
      Sillage: "Moderate",
      Season: "Fall",
      "Time of Day": "Evening",
    },
  },
  {
    id: "lily-valley",
    name: "Lily in the Valley",
    subtitle: "Ethereal Vanilla / White Floral",
    mood: "Vanilla-white architectural garden, lily petals, orchids, silver spheres, and mist.",
    description:
      "A soft radiance of white florals and creamy vanilla blooming like morning light through a veil of pure serenity.",
    scene: "assets/images/scenes/lily-valley.webp",
    bottle: "assets/images/bottles/lily-valley.webp",
    glow: "#e8d3a6",
    tint: "236, 228, 212",
    tone: "light",
    focus: "50% 50%",
    particles: "spheres",
    notes: {
      top: ["Vanilla Orchid", "Neroli", "Soft Pear"],
      middle: ["Lily of the Valley", "Jasmine Petals", "White Floral Accord"],
      base: ["Vanilla", "White Musk", "Sandalwood"],
    },
    accords: [
      ["White Floral", 96, "#d9d2c0"],
      ["Vanilla", 78, "#e2c98a"],
      ["Fresh", 68, "#8fcfc8"],
      ["Powdery", 64, "#c8b6b0"],
      ["Musky", 44, "#cbbac6"],
      ["Creamy", 42, "#dcc79a"],
      ["Airy", 38, "#b8cfdc"],
      ["Green", 34, "#9ac7a4"],
      ["Floral Dew", 30, "#ebb7cb"],
      ["Clean", 28, "#c9dde2"],
      ["Soft Woody", 26, "#c2a98c"],
      ["Luminous Amber", 24, "#d79c83"],
    ],
    facts: {
      Family: "White Floral Vanilla",
      Intensity: "Soft Radiance",
      Longevity: "7–9 Hours",
      Sillage: "Graceful",
      Season: "Spring",
      "Time of Day": "Daytime",
    },
  },
];

/* ---------------------------------------------------------------------
   Small helpers
   --------------------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);
const pad = (n) => String(n).padStart(2, "0");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

// Deterministic pseudo-random numbers so particle layouts are stable per scent.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const byStrength = (accords) => [...accords].sort((a, b) => b[1] - a[1]);

// Tier icons for the fragrance pyramid (inline SVG, inherit currentColor).
const tierIcons = {
  top: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>',
  middle:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c0-4 2-7 5-8 0 4-2 7-5 8Zm0 0c0-4-2-7-5-8 0 4 2 7 5 8Zm0 0v9M12 16c2-2 4-2 6-1M12 18c-2-2-4-2-6-1"/></svg>',
  base: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l9-4 9 4-9 4-9-4Zm0 4 9 4 9-4M3 16l9 4 9-4"/></svg>',
};
const tierLabels = { top: "Top Notes", middle: "Heart Notes", base: "Base Notes" };

/* ---------------------------------------------------------------------
   Markup builders
   --------------------------------------------------------------------- */
function bottleRig(scent, extraClass = "") {
  return `
    <div class="bottle-rig ${extraClass}" style="--bottle:url('${scent.bottle}')">
      <img class="bottle-img" src="${scent.bottle}" alt="BEAVIE ${scent.name} perfume bottle" loading="lazy" decoding="async" />
      <span class="bottle-sheen" aria-hidden="true"><i></i></span>
      <img class="bottle-reflection" src="${scent.bottle}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <span class="bottle-shadow" aria-hidden="true"></span>
    </div>`;
}

function accordRows(accords, limit = accords.length) {
  return byStrength(accords)
    .slice(0, limit)
    .map(
      ([label, value, color], i) => `
        <div class="accord" style="--value:${value / 100}; --bar:${color}; --i:${i}">
          <span class="accord-label">${label}</span>
          <span class="accord-track"><i></i></span>
          <span class="accord-value">${value}</span>
        </div>`,
    )
    .join("");
}

function particleLayer(scent, index) {
  const rand = seeded(index * 97 + 13);
  const type = scent.particles;
  const counts = { droplets: 26, bubbles: 22, spheres: 7, lace: 14, waves: 18 };
  let inner = "";

  if (type === "ticker") {
    const rows = "BVE ▲ 2.41 · MINT ▲ 0.88 · CEDR ▼ 0.12 · AMBR ▲ 1.37 · VNLA ▲ 3.05 · SAGE ▲ 0.64 · ATHN ▲ 1.92 · ";
    inner = `<div class="ticker"><span>${rows.repeat(3)}</span><span>${rows.repeat(3)}</span></div>
             <div class="data-screen data-a"></div><div class="data-screen data-b"></div>`;
  } else if (type === "smoke") {
    inner = '<span class="smoke s1"></span><span class="smoke s2"></span><span class="smoke s3"></span>';
  } else if (type === "velvet") {
    inner = '<span class="velvet-sheen"></span><span class="velvet-sheen v2"></span>';
  } else {
    for (let i = 0; i < (counts[type] || 0); i++) {
      const size = type === "spheres" ? 14 + rand() * 46 : 3 + rand() * (type === "bubbles" ? 14 : 9);
      inner += `<span style="--x:${(rand() * 100).toFixed(1)}%; --y:${(rand() * 100).toFixed(1)}%; --s:${size.toFixed(1)}px; --d:${(rand() * -12).toFixed(2)}s; --t:${(8 + rand() * 10).toFixed(2)}s"></span>`;
    }
  }
  return `<div class="particles particles-${type}" data-parallax="0.12" aria-hidden="true">${inner}</div>`;
}

/* ---------------------------------------------------------------------
   Render: hero index, collection cards, scent sections
   --------------------------------------------------------------------- */
$("#hero-index").innerHTML = scents
  .map((s, i) => `<a href="#${s.id}"><span>${pad(i + 1)}</span>${s.name}</a>`)
  .join("");

$("#collection-grid").innerHTML = scents
  .map(
    (scent, i) => `
      <li class="card-item reveal" style="--i:${i % 4}">
        <a class="scent-card" href="#${scent.id}" style="--glow:${scent.glow}">
          <img class="card-scene" src="${scent.scene.replace(".webp", "-sm.webp")}" alt="" loading="lazy" decoding="async" style="object-position:${scent.focus}" />
          <span class="card-shade" aria-hidden="true"></span>
          <img class="card-bottle" src="${scent.bottle}" alt="" loading="lazy" decoding="async" />
          <span class="card-sweep" aria-hidden="true"></span>
          <span class="card-copy">
            <span class="card-num">${pad(i + 1)}</span>
            <span class="card-name">${scent.name}</span>
            <span class="card-sub">${scent.subtitle}</span>
            <span class="card-cta">View Scent
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>
            </span>
          </span>
        </a>
      </li>`,
  )
  .join("");

$("#scent-sections").innerHTML = scents
  .map(
    (scent, i) => `
      <section
        class="scent-section tone-${scent.tone} ${i % 2 ? "is-mirrored" : ""}"
        id="${scent.id}"
        aria-labelledby="${scent.id}-title"
        style="--glow:${scent.glow}; --tint:${scent.tint}"
      >
        <div class="scene" aria-hidden="true">
          <div class="scene-bg" data-parallax="0.22" style="background-image:url('${scent.scene}'); background-position:${scent.focus}"></div>
          <div class="scene-wash"></div>
          <div class="mist mist-a"></div>
          ${particleLayer(scent, i)}
          <div class="grain"></div>
        </div>

        <span class="scent-index" aria-hidden="true">${pad(i + 1)}</span>

        <div class="scent-copy">
          <p class="eyebrow stagger" style="--i:0">Collection &nbsp;·&nbsp; ${pad(i + 1)} / ${pad(scents.length)}</p>
          <h2 class="display stagger" id="${scent.id}-title" style="--i:1">${scent.name}</h2>
          <p class="scent-subtitle stagger" style="--i:2">${scent.subtitle}</p>
          <span class="hairline stagger" style="--i:3"></span>
          <p class="scent-desc stagger" style="--i:4">${scent.description}</p>
          <p class="scent-mood stagger" style="--i:5">${scent.mood}</p>
          <button class="lux-button discover-button stagger" style="--i:6" type="button" data-scent="${i}" aria-haspopup="dialog">
            <span>Discover the Scent</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-7-7h14" /></svg>
          </button>
        </div>

        <div class="scent-stage">
          <span class="stage-halo" aria-hidden="true"></span>
          ${bottleRig(scent)}
        </div>

        <aside class="accord-panel" aria-label="${scent.name} main accords preview">
          <p class="panel-title">Main Accords</p>
          <div class="accords compact">${accordRows(scent.accords, 6)}</div>
          <button class="text-link discover-button" type="button" data-scent="${i}" aria-haspopup="dialog">
            All ${scent.accords.length} accords &amp; notes
          </button>
        </aside>
      </section>`,
  )
  .join("");

/* ---------------------------------------------------------------------
   Header state
   --------------------------------------------------------------------- */
const header = $("#site-header");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
updateHeader();

// Plays the hero entrance once the first frame has painted.
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-loaded")));

/* ---------------------------------------------------------------------
   Scroll reveals — one observer for reveal blocks and scent sections
   --------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
);
document.querySelectorAll(".reveal, .scent-section").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------------------------
   Parallax — transforms set directly on each layer (no CSS-variable
   cascades), only for sections currently near the viewport.
   --------------------------------------------------------------------- */
const parallaxSections = [...document.querySelectorAll(".hero, .scent-section")].map((section) => ({
  section,
  layers: [...section.querySelectorAll("[data-parallax]")].map((el) => [el, Number(el.dataset.parallax)]),
}));
const nearViewport = new Set();
const parallaxObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      const item = parallaxSections.find((p) => p.section === e.target);
      e.isIntersecting ? nearViewport.add(item) : nearViewport.delete(item);
    }),
  { rootMargin: "20% 0px" },
);
parallaxSections.forEach((p) => parallaxObserver.observe(p.section));

let scrollTicking = false;
function applyParallax() {
  scrollTicking = false;
  updateHeader();
  if (reduceMotion.matches) return;
  const vh = window.innerHeight;
  nearViewport.forEach(({ section, layers }) => {
    const rect = section.getBoundingClientRect();
    // -1 when the section sits below the viewport, 0 centred, 1 above.
    const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
    layers.forEach(([el, depth]) => {
      el.style.transform = `translate3d(0, ${(progress * depth * 100).toFixed(2)}px, 0)`;
    });
  });
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(applyParallax);
    }
  },
  { passive: true },
);
window.addEventListener("resize", applyParallax);
applyParallax();

/* ---------------------------------------------------------------------
   Bottle tilt — decorative pointer tracking, eased toward the target
   so it carries momentum instead of snapping to the cursor.
   --------------------------------------------------------------------- */
document.querySelectorAll(".hero-stage, .scent-stage").forEach((stage) => {
  const rig = stage.querySelector(".bottle-rig");
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let frame = 0;

  const step = () => {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    rig.style.transform = `rotateY(${(current.x * 10).toFixed(2)}deg) rotateX(${(current.y * -6).toFixed(2)}deg)`;
    rig.style.setProperty("--sheen-x", `${(50 + current.x * 60).toFixed(1)}%`);
    const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
    frame = settled ? 0 : requestAnimationFrame(step);
  };
  const kick = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  const zone = stage.closest("section");
  zone.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reduceMotion.matches) return;
    const rect = zone.getBoundingClientRect();
    target = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    kick();
  });
  zone.addEventListener("pointerleave", () => {
    target = { x: 0, y: 0 };
    kick();
  });
});

/* ---------------------------------------------------------------------
   Discover the Scent — reusable overlay drawer
   --------------------------------------------------------------------- */
const drawer = $("#scent-drawer");
const backdrop = $("#drawer-backdrop");
const pageRegions = [$("main"), header, $(".site-footer")];
let activeIndex = 0;
let lastTrigger = null;
let closeTimer = 0;

function fillDrawer(index) {
  const scent = scents[index];
  activeIndex = index;
  drawer.style.setProperty("--glow", scent.glow);

  $("#drawer-bottle").src = scent.bottle;
  $("#drawer-bottle").alt = `BEAVIE ${scent.name} perfume bottle`;
  $("#drawer-kicker").textContent = `Collection · ${pad(index + 1)} / ${pad(scents.length)}`;
  $("#drawer-title").textContent = scent.name;
  $("#drawer-subtitle").textContent = scent.subtitle;
  $("#drawer-about").textContent = `${scent.description} ${scent.mood}`;

  $("#drawer-notes").innerHTML = ["top", "middle", "base"]
    .map(
      (tier, t) => `
        <div class="tier tier-${tier}" style="--t:${t}">
          <p class="tier-label">${tierIcons[tier]}<span>${tierLabels[tier]}</span></p>
          <ul class="chips">
            ${scent.notes[tier].map((note) => `<li class="chip"><span class="chip-mark">${note.charAt(0)}</span>${note}</li>`).join("")}
          </ul>
        </div>`,
    )
    .join("");

  $("#drawer-accords").innerHTML = accordRows(scent.accords);

  $("#drawer-facts").innerHTML = Object.entries(scent.facts)
    .map(([label, value]) => `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");

  // Restart the accord-bar fill each time content changes.
  drawer.classList.remove("bars-in");
  void drawer.offsetWidth;
  drawer.classList.add("bars-in");
  $(".drawer-inner", drawer).scrollTop = 0;
}

function openDrawer(index, trigger) {
  clearTimeout(closeTimer);
  lastTrigger = trigger || document.activeElement;
  fillDrawer(index);

  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--scrollbar", `${scrollbar}px`);
  document.body.classList.add("scroll-locked");
  pageRegions.forEach((el) => el && (el.inert = true));

  backdrop.hidden = false;
  drawer.hidden = false;
  void drawer.offsetWidth; // commit the closed state so the open transition plays
  document.body.classList.add("drawer-open");
  $(".drawer-close", drawer).focus({ preventScroll: true });
}

function closeDrawer() {
  if (!document.body.classList.contains("drawer-open")) return;
  document.body.classList.remove("drawer-open");
  pageRegions.forEach((el) => el && (el.inert = false));

  closeTimer = setTimeout(
    () => {
      drawer.hidden = true;
      backdrop.hidden = true;
      drawer.classList.remove("bars-in");
      document.body.classList.remove("scroll-locked");
    },
    reduceMotion.matches ? 160 : 420,
  );
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  const discover = event.target.closest(".discover-button");
  if (discover) {
    openDrawer(Number(discover.dataset.scent), discover);
    return;
  }
  const stepper = event.target.closest("[data-step]");
  if (stepper) {
    fillDrawer((activeIndex + Number(stepper.dataset.step) + scents.length) % scents.length);
    return;
  }
  if (event.target.closest(".drawer-close") || event.target === backdrop) closeDrawer();
});

document.addEventListener("keydown", (event) => {
  if (!document.body.classList.contains("drawer-open")) return;

  if (event.key === "Escape") {
    closeDrawer();
  } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    fillDrawer((activeIndex + (event.key === "ArrowRight" ? 1 : -1) + scents.length) % scents.length);
  } else if (event.key === "Tab") {
    // Keep focus inside the dialog.
    const focusables = [...drawer.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
