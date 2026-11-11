/* =====================================================================
   BEAVIE Parfums — fragrance page
   ---------------------------------------------------------------------
   fragrance.html?scent=<id>. One fragrance, one world, four acts:
   arrive (the place, wide) · story (the bottle, close) · notes (what it
   is made of) · own it (purchase, and the way on to the next world).

   Each act holds a [data-stage] element; stage.js frames the bottle on
   it, so scrolling through the acts is the camera move.
   ===================================================================== */
const index = scents.findIndex((s) => s.id === new URLSearchParams(location.search).get("scent"));
if (index < 0) location.replace("./"); // unknown fragrance: back to the collection

const scent = scents[Math.max(index, 0)];
const prev = scents[(index - 1 + scents.length) % scents.length];
const next = scents[(index + 1) % scents.length];
const toneOf = (s) => `rgb(${s.tint})`;

document.title = `${scent.name}, ${scent.subtitle} | BEAVIE Parfums`;
$("meta[name='description']").content = scent.description;
document.body.classList.add(`tone-${scent.tone}`);
if (scent.tone === "light") document.body.classList.add("theme-light");
document.body.style.setProperty("--glow", scent.glow);
document.body.style.setProperty("--tint", scent.tint);
$("meta[name='theme-color']").content = toneOf(scent);
$("#page-veil").style.setProperty("--veil", toneOf(scent));

const anchor = (className, az, el, eager) => `
  <div class="stage-anchor ${className}" data-stage="scent" data-world="${scent.id}" data-scent="${index}" data-az="${az}" data-el="${el}">
    <img class="stage-fallback" src="${scent.bottle}" alt="BEAVIE ${scent.name} perfume bottle" width="960" height="1200" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
  </div>`;
const tiers = { top: "Top notes", middle: "Heart notes", base: "Base notes" };
const strongest = [...scent.accords].sort((a, b) => b[1] - a[1]).slice(0, 6);

$("main").innerHTML = `
  <section class="act act-arrive gl-section" aria-labelledby="scent-title">
    ${anchor("anchor-arrive", -0.42, 0.07, true)}
    <div class="act-copy">
      <p class="eyebrow stagger" style="--i:0"><span class="eyebrow-num">No. ${pad(index + 1)}</span> of ${pad(scents.length)}</p>
      <h1 class="scent-title display stagger" id="scent-title" style="--i:1">${scent.name}</h1>
      <p class="scent-subtitle stagger" style="--i:2">${scent.subtitle}</p>
    </div>
    <a class="scroll-cue stagger" style="--i:4" href="#story"><span>Step closer</span><i aria-hidden="true"></i></a>
  </section>

  <section class="act act-story gl-section" id="story" aria-label="${scent.name}, the story">
    ${anchor("anchor-story", 0, 0, false)}
    <div class="act-copy reveal">
      <p class="eyebrow">The atmosphere</p>
      <p class="story-lead">${scent.description}</p>
      <p class="story-mood">${scent.mood}</p>
    </div>
  </section>

  <section class="act act-notes gl-section" aria-labelledby="notes-title">
    ${anchor("anchor-notes", 0.55, 0.02, false)}
    <div class="act-copy reveal">
      <p class="eyebrow">The composition</p>
      <h2 class="display" id="notes-title">What it is <em>made of</em></h2>
      <dl class="notes">
        ${Object.entries(tiers)
          .map(([tier, label]) => `<div><dt>${label}</dt><dd>${scent.notes[tier].join(", ")}</dd></div>`)
          .join("")}
        <div><dt>Main accords</dt><dd>${strongest.map(([label]) => label).join(", ")}</dd></div>
      </dl>
      <dl class="facts">
        ${Object.entries(scent.facts)
          .map(([label, value]) => `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`)
          .join("")}
      </dl>
    </div>
  </section>

  <section class="act act-own gl-section" aria-labelledby="own-title">
    ${anchor("anchor-own", 0.18, 0.04, false)}
    <div class="act-copy reveal">
      <p class="eyebrow">BEAVIE Parfums</p>
      <h2 class="display" id="own-title">${scent.name}</h2>
      <p class="scent-subtitle">${scent.subtitle}</p>
      <div class="own-actions">
        ${scent.shopUrl ? `<a class="btn btn-primary" href="${scent.shopUrl}"><span>Buy ${scent.name}</span>${arrow}</a>` : ""}
        <a class="btn ${scent.shopUrl ? "btn-ghost" : "btn-primary"} world-link" href="${next.url}" data-tone="${toneOf(next)}">
          <span>Next world: ${next.name}</span>${arrow}
        </a>
        <a class="btn btn-ghost world-link" href="./#collection" data-tone="rgb(245, 241, 234)"><span>All eight scents</span></a>
      </div>
    </div>
  </section>`;

$("#world-bar").innerHTML = `
  <a class="icon-button world-link" href="${prev.url}" data-tone="${toneOf(prev)}" aria-label="Previous fragrance: ${prev.name}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
  </a>
  <a class="bar-home world-link" href="./#collection" data-tone="rgb(245, 241, 234)">
    <span class="bar-count">${pad(index + 1)} / ${pad(scents.length)}</span><span class="bar-name">${scent.name}</span>
  </a>
  <a class="icon-button world-link" href="${next.url}" data-tone="${toneOf(next)}" aria-label="Next fragrance: ${next.name}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
  </a>
  <button class="icon-button" id="motion-toggle" type="button" aria-pressed="false" aria-label="Pause the scene">
    <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" /></svg>
    <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>
  </button>`;
watchReveals();

// Moving between worlds goes through the veil, in the colour of where you are headed.
document.addEventListener("click", (event) => {
  const link = event.target.closest(".world-link, .menu-scents a, .brand");
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
  event.preventDefault();
  const target = scents.find((s) => link.getAttribute("href") === s.url);
  leaveTo(link.href, link.dataset.tone || (target ? toneOf(target) : "rgb(245, 241, 234)"));
});

/* ---------------------------------------------------------------------
   The world: WebGL when the device can, the scene still + render when not
   --------------------------------------------------------------------- */
function useStill() {
  root.classList.remove("gl", "gl-ready");
  $("#world-still").style.backgroundImage = `url('${scent.scene}')`;
  $("#motion-toggle").hidden = true;
  arrive();
}

if (index >= 0 && canWebGL()) {
  root.classList.add("gl");
  import("./stage.js")
    .then((m) => m.createStage({ canvas: $("#stage"), scents, reduceMotion, finePointer }))
    .then((stage) => {
      arrive();
      const toggle = $("#motion-toggle");
      if (reduceMotion.matches) toggle.hidden = true;
      toggle.addEventListener("click", () => {
        const paused = toggle.getAttribute("aria-pressed") !== "true";
        toggle.setAttribute("aria-pressed", String(paused));
        toggle.setAttribute("aria-label", paused ? "Resume the scene" : "Pause the scene");
        stage.setPaused(paused);
      });
    })
    .catch((error) => {
      console.warn("BEAVIE world unavailable, showing the still instead.", error);
      useStill();
    });
} else if (index >= 0) {
  useStill();
}
