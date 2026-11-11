/* =====================================================================
   BEAVIE Parfums — collection page
   ---------------------------------------------------------------------
   Eight bottles, each a link into its fragrance world. With WebGL the
   links lie over the 3D rosette (collection.js); without it they show
   the product renders in a ring of their own.
   ===================================================================== */
const hubCount = $("#hub-count");
const hubName = $("#hub-name");
const hubSub = $("#hub-sub");
const ring = $("#rosette-ring");

$("#rosette-links").innerHTML = scents
  .map(
    (scent, i) => `
      <li>
        <a class="rosette-link" href="${scent.url}" data-index="${i}" style="--glow:${scent.glow}; --i:${i}" aria-label="${scent.name}, ${scent.subtitle}. Enter this fragrance.">
          <img src="${scent.thumb}" alt="" width="480" height="600" loading="lazy" decoding="async" />
          <span class="rosette-name">${scent.name}</span>
        </a>
      </li>`,
  )
  .join("");
const links = $$(".rosette-link");

$("#index-list").innerHTML = scents
  .map(
    (scent, i) => `
      <li class="reveal" style="--i:${i % 4}">
        <a class="index-row" href="${scent.url}" data-index="${i}" style="--glow:${scent.glow}">
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
watchReveals();

/* The hub in the middle of the ring names whichever bottle has the visitor's attention. */
let collection = null;
function attend(index) {
  links.forEach((link, i) => link.classList.toggle("is-active", i === index));
  ring.classList.toggle("has-active", index >= 0);
  collection?.setHover(index);
  if (index < 0) {
    hubCount.textContent = "Eight scents";
    hubName.textContent = "Choose yours";
    hubSub.textContent = "";
    return;
  }
  const scent = scents[index];
  hubCount.textContent = `No. ${pad(index + 1)}`;
  hubName.textContent = scent.name;
  hubSub.textContent = scent.subtitle;
}
links.forEach((link, i) => {
  link.addEventListener("pointerenter", () => attend(i));
  link.addEventListener("pointerleave", () => attend(-1));
  link.addEventListener("focus", () => attend(i));
  link.addEventListener("blur", () => attend(-1));
});

/* Choosing a bottle: the lens moves in on it, the veil takes its colour, then the page changes. */
document.addEventListener("click", (event) => {
  const link = event.target.closest(".rosette-link, .index-row");
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
  event.preventDefault();
  const index = Number(link.dataset.index);
  const scent = scents[index];
  const tone = scent.tone === "light" ? `rgb(${scent.tint})` : `rgb(${scent.tint})`;
  if (link.classList.contains("rosette-link")) {
    attend(index);
    (collection ? collection.select(index) : Promise.resolve()).then(() => leaveTo(scent.url, tone));
  } else leaveTo(scent.url, tone);
});

if (canWebGL()) {
  root.classList.add("gl");
  import("./collection.js")
    .then((m) => m.createCollection({ canvas: $("#stage"), anchor: ring, links, scents, reduceMotion, finePointer }))
    .then((api) => {
      collection = api;
      arrive();
    })
    .catch((error) => {
      console.warn("BEAVIE collection scene unavailable, showing product renders instead.", error);
      root.classList.remove("gl", "gl-ready");
      arrive();
    });
} else {
  arrive();
}
