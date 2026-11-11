/* =====================================================================
   BEAVIE Parfums — catalog data + interactions
   ---------------------------------------------------------------------
   EDIT THE COLLECTION HERE. Every card, scent section, accord bar, note
   chip and overlay is generated from this array — add, remove or reorder
   entries and the page follows.

   Field guide
   - id          used for the section anchor (#id) and asset file names
   - scene       atmosphere image the bottle stands in (assets/images/scenes)
   - bottle      product render of the flacon (assets/images/bottles),
                 shown until the 3D stage is ready and whenever it can't run
   - glow        this scent's light: rim light, haze, buttons, bars
   - tint        colour washed behind the copy so it stays legible
   - tone        "dark" (light text) or "light" (ink text) section theme
   - focus       CSS background-position for the scene image (fallback only)
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
   Bottle + atmosphere per scent
   ---------------------------------------------------------------------
   All eight scents share the JETHA flacon; what changes is the label and
   the world around it.
   - model       source file in JETHA-3D/website-assets/blend (see
                 assets/models/manifest.json)
   - atmosphere  weather + light preset in stage.js, chosen from the
                 scent's own description above
   - shopUrl     optional. Give a scent a product page URL and a "Buy"
                 button appears beside "Discover the scent".
   --------------------------------------------------------------------- */
const stageMeta = {
  verdius: { model: "bayu", atmosphere: "rain" },
  tonvira: { model: "nirmala", atmosphere: "snow" },
  "chestnut-rush": { model: "senja", atmosphere: "ember" },
  wavekiss: { model: "samudera", atmosphere: "spray" },
  seductress: { model: "purnama", atmosphere: "noir" },
  "celestia-rose": { model: "ratna", atmosphere: "frost" },
  "berry-tease": { model: "ranum", atmosphere: "velvet" },
  "lily-valley": { model: "seroja", atmosphere: "sun" },
};
scents.forEach((scent) =>
  Object.assign(scent, stageMeta[scent.id], {
    label: `assets/images/labels/${scent.id}.webp`,
    thumb: scent.bottle.replace(".webp", "-sm.webp"),
  }),
);
const HERO_SCENT = scents.findIndex((s) => s.id === "tonvira");

/* ---------------------------------------------------------------------
   Small helpers
   --------------------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pad = (n) => String(n).padStart(2, "0");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const root = document.documentElement;

const byStrength = (accords) => [...accords].sort((a, b) => b[1] - a[1]);
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>';

// Tier icons for the fragrance pyramid (inline SVG, inherit currentColor).
const tierIcons = {
  top: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>',
  middle:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c0-4 2-7 5-8 0 4-2 7-5 8Zm0 0c0-4-2-7-5-8 0 4 2 7 5 8Zm0 0v9M12 16c2-2 4-2 6-1M12 18c-2-2-4-2-6-1"/></svg>',
  base: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l9-4 9 4-9 4-9-4Zm0 4 9 4 9-4M3 16l9 4 9-4"/></svg>',
};
const tierLabels = { top: "Top notes", middle: "Heart notes", base: "Base notes" };

/* ---------------------------------------------------------------------
   Markup builders
   --------------------------------------------------------------------- */
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

const fallbackBottle = (scent, eager = false) =>
  `<img class="stage-fallback" src="${scent.bottle}" alt="BEAVIE ${scent.name} perfume bottle" width="960" height="1200" ${
    eager ? 'fetchpriority="high"' : 'loading="lazy"'
  } decoding="async" />`;

/* ---------------------------------------------------------------------
   Render: hero bottle, collection index, scent sections, menus
   --------------------------------------------------------------------- */
$$("[data-stage='hero'], [data-stage='macro']").forEach((el) => (el.dataset.scent = HERO_SCENT));
$("[data-stage='hero']").innerHTML = fallbackBottle(scents[HERO_SCENT], true);
$("#hero-shown").textContent = `${scents[HERO_SCENT].name} · ${scents[HERO_SCENT].subtitle}`;

$("#index-list").innerHTML = scents
  .map(
    (scent, i) => `
      <li class="reveal" style="--i:${i % 4}">
        <a class="index-row" href="#${scent.id}" style="--glow:${scent.glow}">
          <span class="index-num">${pad(i + 1)}</span>
          <span class="index-name">${scent.name}</span>
          <span class="index-sub">${scent.subtitle}</span>
          <span class="index-family">${scent.facts.Family}</span>
          <img class="index-thumb" src="${scent.thumb}" alt="" width="480" height="600" loading="lazy" decoding="async" />
          <span class="index-go">${arrow}</span>
        </a>
      </li>`,
  )
  .join("");

$("#scent-sections").innerHTML = scents
  .map(
    (scent, i) => `
      <section
        class="scent gl-section tone-${scent.tone} ${i % 2 ? "is-mirrored" : ""}"
        id="${scent.id}"
        aria-labelledby="${scent.id}-title"
        data-index="${i}"
        style="--glow:${scent.glow}; --tint:${scent.tint}"
      >
        <div class="scent-bg" aria-hidden="true" data-bg="${scent.scene}" style="background-position:${scent.focus}"></div>
        <div class="scent-scrim" aria-hidden="true"></div>

        <div class="scent-copy">
          <p class="eyebrow stagger" style="--i:0"><span class="eyebrow-num">No. ${pad(i + 1)}</span> of ${pad(scents.length)}</p>
          <h2 class="scent-name stagger" id="${scent.id}-title" style="--i:1">${scent.name}</h2>
          <p class="scent-subtitle stagger" style="--i:2">${scent.subtitle}</p>
          <p class="scent-desc stagger" style="--i:3">${scent.description}</p>
          <p class="scent-mood stagger" style="--i:4">${scent.mood}</p>
          <div class="scent-actions stagger" style="--i:5">
            <button class="btn btn-primary discover-button" type="button" data-scent="${i}" aria-haspopup="dialog">
              <span>Discover the scent</span>${arrow}
            </button>
            ${scent.shopUrl ? `<a class="btn btn-ghost" href="${scent.shopUrl}"><span>Buy ${scent.name}</span></a>` : ""}
          </div>
        </div>

        <div class="scent-stage">
          <div class="stage-anchor" data-stage="scent" data-world="${scent.id}" data-scent="${i}" data-yaw="${i % 2 ? 0.3 : -0.3}">
            ${fallbackBottle(scent)}
          </div>
          <aside class="accord-panel glass" aria-label="${scent.name} main accords preview">
            <p class="panel-title">Main accords</p>
            <div class="accords compact">${accordRows(scent.accords, 5)}</div>
            <button class="text-link discover-button" type="button" data-scent="${i}" aria-haspopup="dialog">
              All ${scent.accords.length} accords and notes
            </button>
          </aside>
        </div>
      </section>`,
  )
  .join("");

const scentLinks = scents.map((s, i) => `<li><a href="#${s.id}"><span>${pad(i + 1)}</span>${s.name}</a></li>`).join("");
$("#menu-scents").innerHTML = scentLinks;
$("#footer-scents").innerHTML = scentLinks;

/* ---------------------------------------------------------------------
   The stage: WebGL when the device can, product renders when it can't
   --------------------------------------------------------------------- */
const sections = $$(".scent");
function canWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && c.getContext("webgl2"));
  } catch {
    return false;
  }
}

function useFallbackScenes() {
  root.classList.remove("gl", "gl-ready");
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const bg = $(".scent-bg", e.target);
        bg.style.backgroundImage = `url('${bg.dataset.bg}')`;
        io.unobserve(e.target);
      }),
    { rootMargin: "60% 0px" },
  );
  sections.forEach((s) => io.observe(s));
}

if (canWebGL() && !new URLSearchParams(location.search).has("nogl")) {
  root.classList.add("gl");
  import("./stage.js")
    .then((m) => m.createStage({ canvas: $("#stage"), scents, reduceMotion, finePointer }))
    .catch((error) => {
      console.warn("BEAVIE stage unavailable, showing product renders instead.", error);
      useFallbackScenes();
    });
} else {
  useFallbackScenes();
}

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
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
);
$$(".reveal, .scent").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------------------------
   Header state, current nav link, and the statement's word-by-word reveal
   --------------------------------------------------------------------- */
const header = $("#site-header");
const statement = $("#statement-text");
statement.innerHTML = statement.textContent
  .trim()
  .split(/\s+/)
  .map((word) => `<span class="w">${word}</span>`)
  .join(" ");
const words = $$(".w", statement);

let scrollTicking = false;
function onScroll() {
  scrollTicking = false;
  header.classList.toggle("is-scrolled", window.scrollY > 40);
  if (reduceMotion.matches) return words.forEach((w) => w.classList.add("is-lit"));
  const rect = statement.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.bottom < 0 || rect.top > vh) return;
  const progress = (vh * 0.82 - rect.top) / (rect.height + vh * 0.3);
  const lit = Math.round(progress * words.length);
  words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true },
);
window.addEventListener("resize", onScroll);
onScroll();

const navLinks = $$(".site-nav a");
const navObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const group = e.target.closest("[data-nav]").dataset.nav;
      navLinks.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === `#${group}`));
    }),
  { rootMargin: "-45% 0px -45% 0px" },
);
$$("[data-nav]").forEach((el) => navObserver.observe(el));

/* ---------------------------------------------------------------------
   Scent rail — where you are in the collection, and the way to the next
   --------------------------------------------------------------------- */
const rail = $("#scent-rail");
let railIndex = -1;
const visibleScents = new Set();
function setRail(index) {
  railIndex = index;
  const scent = scents[index];
  $("#rail-count").textContent = `${pad(index + 1)} / ${pad(scents.length)}`;
  $("#rail-name").textContent = scent.name;
  $("#rail-notes").dataset.scent = index;
  rail.style.setProperty("--glow", scent.glow);
  $("[data-rail='-1']").disabled = index === 0;
  $("[data-rail='1']").disabled = index === scents.length - 1;
}
const railObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => (e.isIntersecting ? visibleScents.add(e.target) : visibleScents.delete(e.target)));
    rail.classList.toggle("is-on", visibleScents.size > 0);
    rail.inert = visibleScents.size === 0;
    const current = sections.find((s) => visibleScents.has(s));
    if (current && Number(current.dataset.index) !== railIndex) setRail(Number(current.dataset.index));
  },
  { rootMargin: "-50% 0px -49% 0px" },
);
sections.forEach((s) => railObserver.observe(s));
rail.inert = true;
const goToScent = (index) =>
  sections[index].scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });

/* ---------------------------------------------------------------------
   Menu (small screens) — full height panel, links arrive in order
   --------------------------------------------------------------------- */
const menu = $("#menu");
const menuToggle = $("#nav-toggle");
let menuTimer = 0;
function setMenu(open) {
  clearTimeout(menuTimer);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  $("main").inert = open;
  $(".site-footer").inert = open;
  if (open) {
    menu.hidden = false;
    void menu.offsetWidth;
    document.body.classList.add("menu-open", "scroll-locked");
  } else {
    document.body.classList.remove("menu-open");
    if (!document.body.classList.contains("drawer-open")) document.body.classList.remove("scroll-locked");
    menuTimer = setTimeout(() => (menu.hidden = true), reduceMotion.matches ? 0 : 420);
  }
}
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (event) => event.target.closest("a") && setMenu(false));
window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && setMenu(false));

/* ---------------------------------------------------------------------
   Discover the Scent — reusable overlay drawer
   --------------------------------------------------------------------- */
const drawer = $("#scent-drawer");
const backdrop = $("#drawer-backdrop");
const pageRegions = [$("main"), header, $(".site-footer"), rail];
let activeIndex = 0;
let lastTrigger = null;
let closeTimer = 0;

function fillDrawer(index) {
  const scent = scents[index];
  activeIndex = index;
  drawer.style.setProperty("--glow", scent.glow);

  $("#drawer-bottle").src = scent.thumb;
  $("#drawer-bottle").alt = `BEAVIE ${scent.name} perfume bottle`;
  $("#drawer-kicker").textContent = `No. ${pad(index + 1)} of ${pad(scents.length)}`;
  $("#drawer-title").textContent = scent.name;
  $("#drawer-subtitle").textContent = scent.subtitle;
  $("#drawer-about").textContent = `${scent.description} ${scent.mood}`;

  $("#drawer-notes").innerHTML = ["top", "middle", "base"]
    .map(
      (tier, t) => `
        <div class="tier tier-${tier}" style="--t:${t}">
          <p class="tier-label">${tierIcons[tier]}<span>${tierLabels[tier]}</span></p>
          <ul class="chips">
            ${scent.notes[tier].map((note) => `<li class="chip">${note}</li>`).join("")}
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
  rail.inert = visibleScents.size === 0;

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
  const railStep = event.target.closest("[data-rail]");
  if (railStep) {
    goToScent(railIndex + Number(railStep.dataset.rail));
    return;
  }
  const stepper = event.target.closest("[data-step]");
  if (stepper) {
    fillDrawer((activeIndex + Number(stepper.dataset.step) + scents.length) % scents.length);
    return;
  }
  if (event.target.closest(".drawer-close") || event.target === backdrop) closeDrawer();
});

function trapFocus(event, container) {
  const focusables = $$("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])", container).filter((el) => el.offsetParent);
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

document.addEventListener("keydown", (event) => {
  if (document.body.classList.contains("menu-open")) {
    if (event.key === "Escape") {
      setMenu(false);
      menuToggle.focus();
    }
    return;
  }
  if (!document.body.classList.contains("drawer-open")) return;

  if (event.key === "Escape") {
    closeDrawer();
  } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    fillDrawer((activeIndex + (event.key === "ArrowRight" ? 1 : -1) + scents.length) % scents.length);
  } else if (event.key === "Tab") {
    trapFocus(event, drawer); // keep focus inside the dialog
  }
});

/* ---------------------------------------------------------------------
   Pointer details (desktop only): a trailing ring and weighted buttons
   --------------------------------------------------------------------- */
if (finePointer.matches && !reduceMotion.matches) {
  const ring = $("#cursor-ring");
  const at = { x: -100, y: -100, tx: -100, ty: -100 };
  let ringFrame = 0;
  const follow = () => {
    at.x += (at.tx - at.x) * 0.18;
    at.y += (at.ty - at.y) * 0.18;
    ring.style.transform = `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0)`;
    ringFrame = Math.abs(at.tx - at.x) + Math.abs(at.ty - at.y) > 0.2 ? requestAnimationFrame(follow) : 0;
  };
  window.addEventListener(
    "pointermove",
    (event) => {
      at.tx = event.clientX;
      at.ty = event.clientY;
      ring.classList.add("is-on");
      ring.classList.toggle("is-over", !!event.target.closest?.("a, button"));
      if (!ringFrame) ringFrame = requestAnimationFrame(follow);
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => ring.classList.remove("is-on"));

  document.addEventListener("pointermove", (event) => {
    const button = event.target.closest?.(".btn-primary");
    $$(".btn-primary.is-pulled").forEach((b) => {
      if (b !== button) {
        b.classList.remove("is-pulled");
        b.style.transform = "";
      }
    });
    if (!button) return;
    const r = button.getBoundingClientRect();
    const dx = (event.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (event.clientY - (r.top + r.height / 2)) / r.height;
    button.classList.add("is-pulled");
    button.style.transform = `translate3d(${(dx * 10).toFixed(1)}px, ${(dy * 8).toFixed(1)}px, 0)`;
  });
}
