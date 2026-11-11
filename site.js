/* =====================================================================
   BEAVIE Parfums — catalog data + shared site chrome
   ---------------------------------------------------------------------
   EDIT THE COLLECTION HERE. The collection page and every fragrance
   page are generated from this array — add, remove or reorder
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
   - world       each scent's environment lives in worlds/<id>.js
   - shopUrl     optional. Give a scent a product page URL and a "Buy"
                 button appears beside "Discover the scent".
   --------------------------------------------------------------------- */
const stageMeta = {
  verdius: { model: "bayu" },
  tonvira: { model: "nirmala" },
  "chestnut-rush": { model: "senja" },
  // Wavekiss is a daylight coast, so its page reads in ink on a pale wash.
  wavekiss: { model: "samudera", tone: "light", tint: "226, 244, 240" },
  seductress: { model: "purnama" },
  "celestia-rose": { model: "ratna" },
  "berry-tease": { model: "ranum" },
  "lily-valley": { model: "seroja" },
};
scents.forEach((scent) =>
  Object.assign(scent, stageMeta[scent.id], {
    label: `assets/images/labels/${scent.id}.webp`,
    labelSmall: `assets/images/labels/sm/${scent.id}.webp`,
    thumb: scent.bottle.replace(".webp", "-sm.webp"),
    url: `fragrance.html?scent=${scent.id}`,
  }),
);

/* ---------------------------------------------------------------------
   Shared helpers and chrome (both pages)
   --------------------------------------------------------------------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const pad = (n) => String(n).padStart(2, "0");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const root = document.documentElement;
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>';

function canWebGL() {
  if (new URLSearchParams(location.search).has("nogl")) return false;
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && c.getContext("webgl2"));
  } catch {
    return false;
  }
}

// Leaving a page: a veil in the destination's colour closes over it, then we navigate.
// Arriving: the veil (already drawn by CSS) lifts once the page says it is ready.
const veil = $("#page-veil");
function leaveTo(url, color) {
  if (color) veil.style.setProperty("--veil", color);
  document.body.classList.add("is-leaving");
  setTimeout(() => (location.href = url), reduceMotion.matches ? 0 : 520);
}
function arrive() {
  document.body.classList.add("is-loaded");
}
window.addEventListener("pageshow", (event) => {
  if (event.persisted) document.body.classList.remove("is-leaving"); // back/forward cache
});
setTimeout(arrive, 3500); // never leave the veil down if something stalls

// Scent lists in the menu and footer.
const scentLinks = scents.map((s, i) => `<li><a href="${s.url}"><span>${pad(i + 1)}</span>${s.name}</a></li>`).join("");
$$("[data-scent-list]").forEach((el) => (el.innerHTML = scentLinks));

// Header + small-screen menu.
const header = $("#site-header");
const menu = $("#menu");
const menuToggle = $("#nav-toggle");
let menuTimer = 0;
function setMenu(open) {
  clearTimeout(menuTimer);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  $("main").inert = open;
  if (open) {
    menu.hidden = false;
    void menu.offsetWidth;
    document.body.classList.add("menu-open", "scroll-locked");
  } else {
    document.body.classList.remove("menu-open", "scroll-locked");
    menuTimer = setTimeout(() => (menu.hidden = true), reduceMotion.matches ? 0 : 420);
  }
}
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (event) => event.target.closest("a") && setMenu(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && setMenu(false));
const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

// Reveals: blocks rise into place once, the first time they are seen.
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }),
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
);
const watchReveals = () => $$(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
