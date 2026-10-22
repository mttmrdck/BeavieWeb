(() => {
  "use strict";

  const categoryById = {
    verdius: "fresh", tonvira: "warm", "chestnut-rush": "warm", wavekiss: "fresh",
    seductress: "fruity", "celestia-rose": "floral", "berry-tease": "fruity", "lily-valley": "floral",
  };
  const taglines = {
    verdius: "The quiet clarity of a new beginning.",
    tonvira: "Composure, with a presence of its own.",
    "chestnut-rush": "For evenings that stay with you.",
    wavekiss: "An open horizon. A breath of possibility.",
    seductress: "A little mystery. A lasting impression.",
    "celestia-rose": "Delicate by nature. Unforgettable by design.",
    "berry-tease": "An invitation to be a little unexpected.",
    "lily-valley": "Softly spoken. Beautifully remembered.",
  };
  const cleanNote = (note) => note.replace(/^[^\p{L}\p{N}]+/u, "");
  const scents = window.BEAVIE_SCENTS.map((scent, index) => ({
    ...scent,
    image: `assets/optimized/${scent.id}-bottle-1200.webp`,
    imageSmall: `assets/optimized/${scent.id}-bottle-640.webp`,
    cardImage: `assets/optimized/${scent.id}-scene-1000.webp`,
    cardImageSmall: `assets/optimized/${scent.id}-scene-640.webp`,
    index,
    category: categoryById[scent.id],
    tagline: taglines[scent.id],
    notes: Object.fromEntries(Object.entries(scent.notes).map(([group, notes]) => [group, notes.map(cleanNote)])),
  }));
  const isHome = document.body.dataset.page === "home";
  const home = isHome ? "" : "index.html";
  const fragranceUrl = (scent) => `fragrance.html?scent=${encodeURIComponent(scent.id)}`;
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>';
  const wordmark = '<span class="wordmark">BEAVIE</span><span class="brand-subtitle">Parfums</span>';
  const brand = `<a class="brand" href="index.html" aria-label="BEAVIE Parfums home">${wordmark}</a>`;
  const navigation = [ ["Collection", "collection"], ["Our story", "story"], ["The heritage", "heritage"] ];

  document.querySelector("#site-header").innerHTML = `
    ${brand}
    <nav class="desktop-nav" aria-label="Main navigation">${navigation.map(([label, id]) => `<a href="${home}#${id}">${label}</a>`).join("")}</nav>
    <a class="button header-cta" href="${home}#collection">Find your signature <span class="arrow" aria-hidden="true">↗</span></a>
    <button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="mobile-menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 8h18M3 16h18" /></svg></button>`;

  document.querySelector("#site-footer").innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">${brand}<p>A collection of atmospheres.<br />Inspired by heritage. Expressed through you.</p></div>
      <div class="footer-navigation">
        <div><p class="eyebrow">Explore</p><nav aria-label="Footer collection navigation"><a href="${home}#collection">The collection</a><a href="fragrance.html?scent=verdius">Verdius</a><a href="fragrance.html?scent=chestnut-rush">The evening edit</a></nav></div>
        <div><p class="eyebrow">The house</p><nav aria-label="Footer brand navigation"><a href="${home}#story">Our story</a><a href="${home}#heritage">Batik &amp; Songket</a><a href="index.html">Back to the beginning ↗</a></nav></div>
      </div>
    </div>
    <div class="footer-wordmark" aria-hidden="true">BEAVIE</div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} BEAVIE Parfums. All rights reserved.</span><span>A world of scent. A thread of heritage.</span></div>`;

  const menu = document.querySelector("#mobile-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  menu.innerHTML = `
    <div class="menu-top"><div class="brand">${wordmark}</div><button class="close-button" type="button" data-close-menu aria-label="Close navigation menu">${closeIcon}</button></div>
    <p class="eyebrow menu-heading" id="menu-title">Enter our world</p>
    <nav aria-label="Mobile navigation">${navigation.map(([label, id], index) => `<a href="${home}#${id}"><span>0${index + 1}</span>${label}</a>`).join("")}<a href="fragrance.html?scent=verdius"><span>04</span>In the spotlight</a></nav>
    <p class="menu-signature">Heritage, held in a bottle.</p>`;
  menuToggle.addEventListener("click", () => menu.showModal());
  menu.querySelector("[data-close-menu]").addEventListener("click", () => menu.close());
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.close()));

  // Native dialogs keep focus inside, support Escape, and restore the opener.
  const quickView = document.querySelector("#quick-view");
  let quickOpener = null;
  quickView.addEventListener("click", (event) => {
    if (event.target === quickView || event.target.closest("[data-close-quick]")) quickView.close();
  });
  quickView.addEventListener("close", () => {
    if (quickOpener?.isConnected) quickOpener.focus({ preventScroll: true });
  });

  function noteSummary(scent) {
    return [scent.notes.top[0], scent.notes.middle[0], scent.notes.base[0]].join(" · ");
  }

  function imageAttributes(scent, kind, sizes) {
    const bottle = kind === "bottle";
    const large = bottle ? scent.image : scent.cardImage;
    const small = bottle ? scent.imageSmall : scent.cardImageSmall;
    const width = bottle ? 1200 : 1000;
    return `src="${large}" srcset="${small} 640w, ${large} ${width}w" sizes="${sizes}" width="${width}" height="${width}"`;
  }

  function cardMarkup(scent) {
    return `<article class="collection-card" id="${scent.id}">
      <a class="card-visual" href="${fragranceUrl(scent)}" aria-label="Discover ${scent.name}">
        <img class="card-background" ${imageAttributes(scent, "scene", "(max-width: 600px) 100vw, (max-width: 800px) 50vw, 33vw")} alt="" loading="lazy" />
        <img class="card-bottle" ${imageAttributes(scent, "bottle", "(max-width: 600px) 100vw, (max-width: 800px) 50vw, 33vw")} alt="BEAVIE ${scent.name} perfume bottle" loading="lazy" decoding="async" />
        <span class="card-index">${String(scent.index + 1).padStart(2, "0")} / 08</span>
        <span class="card-family">${scent.facts.Family}</span>
      </a>
      <div class="card-copy"><div class="card-heading"><h3><a href="${fragranceUrl(scent)}">${scent.name}</a></h3><button class="quick-button" type="button" data-quick="${scent.id}" aria-label="Quick view of ${scent.name}" aria-haspopup="dialog" aria-controls="quick-view"><span aria-hidden="true">+</span></button></div>
        <p class="card-notes">${noteSummary(scent)}</p>
        <a class="text-link" href="${fragranceUrl(scent)}">View fragrance <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }

  function openQuickView(scent, opener) {
    quickOpener = opener;
    quickView.innerHTML = `<button class="close-button" data-close-quick type="button" aria-label="Close fragrance quick view" autofocus>${closeIcon}</button>
      <div class="quick-layout"><div class="detail-art quick-art"><img class="card-background" ${imageAttributes(scent, "scene", "(max-width: 600px) 100vw, 480px")} alt="" /><img class="detail-bottle" ${imageAttributes(scent, "bottle", "(max-width: 600px) 100vw, 480px")} alt="BEAVIE ${scent.name} perfume bottle" /></div>
      <div class="quick-copy"><p class="eyebrow">The signature collection / ${String(scent.index + 1).padStart(2, "0")}</p><h2 id="quick-title">${scent.name}</h2><p>${scent.description}</p>
      <dl class="quick-notes">${Object.entries(scent.notes).map(([group, notes]) => `<div><dt>${group === "middle" ? "Heart" : group} notes</dt><dd>${notes.join(" · ")}</dd></div>`).join("")}</dl>
      <a class="button" href="${fragranceUrl(scent)}">Explore this fragrance <span class="arrow" aria-hidden="true">↗</span></a></div></div>`;
    quickView.showModal();
    quickView.scrollTop = 0;
  }

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-quick]");
    if (!opener) return;
    const scent = scents.find((item) => item.id === opener.dataset.quick);
    if (scent) openQuickView(scent, opener);
  });

  function initializeCatalogue() {
    const grid = document.querySelector("#collection-grid");
    const search = document.querySelector("#catalogue-search");
    const status = document.querySelector("#catalogue-status");
    const empty = document.querySelector("#empty-state");
    const filterButtons = document.querySelectorAll("[data-filter]");
    let activeCategory = "all";

    // Keep the original card nodes so filtering does not recreate image requests.
    grid.innerHTML = scents.map(cardMarkup).join("");
    const cards = Array.from(grid.children);

    function applyFilters() {
      const term = search.value.trim().toLocaleLowerCase();
      let count = 0;
      scents.forEach((scent, index) => {
        const searchable = [scent.name, scent.description, scent.facts.Family, ...Object.values(scent.notes).flat()].join(" ").toLocaleLowerCase();
        const matches = (activeCategory === "all" || scent.category === activeCategory) && (!term || searchable.includes(term));
        cards[index].hidden = !matches;
        if (matches) count++;
      });
      empty.hidden = count > 0;
      grid.hidden = count === 0;
      status.textContent = activeCategory === "all" && !term ? "Showing all 8 fragrances" : `Showing ${count} of 8 fragrances`;
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === activeCategory;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    filterButtons.forEach((button) => button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      applyFilters();
    }));
    search.addEventListener("input", applyFilters);
    document.querySelector("#reset-filters").addEventListener("click", () => {
      activeCategory = "all";
      search.value = "";
      applyFilters();
      filterButtons[0].focus({ preventScroll: true });
    });
    document.querySelectorAll("[data-discover]").forEach((link) => link.addEventListener("click", () => {
      activeCategory = link.dataset.discover;
      search.value = "";
      applyFilters();
    }));
  }

  function renderFragrance() {
    const scent = scents.find((item) => item.id === new URLSearchParams(location.search).get("scent"));
    const main = document.querySelector("#main");
    if (!scent) {
      document.title = "Fragrance not found — BEAVIE Parfums";
      main.innerHTML = `<section class="not-found section-pad container"><p class="eyebrow">A new discovery awaits</p><h1>This scent is<br /><em>yet to be discovered.</em></h1><p>Explore the signature collection to find your fragrance.</p><a class="button" href="index.html#collection">Return to the collection <span aria-hidden="true">↗</span></a></section>`;
      return;
    }

    document.title = `${scent.name} — BEAVIE Parfums`;
    document.querySelector('meta[name="description"]').content = scent.description;
    const related = scents.filter((item) => item.id !== scent.id).sort((a, b) => Number(b.category === scent.category) - Number(a.category === scent.category)).slice(0, 3);
    main.innerHTML = `
      <nav class="detail-breadcrumb container" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="index.html#collection">The collection</a><span aria-hidden="true">/</span><span aria-current="page">${scent.name}</span></nav>
      <section class="detail-hero" aria-labelledby="fragrance-title">
        <div class="detail-art"><img class="card-background" ${imageAttributes(scent, "scene", "(max-width: 600px) 100vw, 50vw")} alt="" fetchpriority="high" /><img class="detail-bottle" ${imageAttributes(scent, "bottle", "(max-width: 600px) 100vw, 50vw")} alt="BEAVIE ${scent.name} perfume bottle" fetchpriority="high" /><span class="image-corner-label">The signature collection / ${String(scent.index + 1).padStart(2, "0")}</span></div>
        <div class="detail-copy"><p class="eyebrow">BEAVIE Parfums / The signature collection</p><h1 id="fragrance-title">${scent.name}</h1><p class="detail-family">${scent.facts.Family}</p><p class="detail-description">${scent.description}</p><p class="detail-signature">${scent.tagline}</p><a class="button" href="#composition">Discover the composition <span class="arrow" aria-hidden="true">↓</span></a></div>
      </section>
      <div class="songket-divider" aria-hidden="true"></div>
      <section class="detail-composition section-pad" id="composition" aria-labelledby="composition-title"><div class="container"><p class="eyebrow">The fragrance unfolds</p><h2 id="composition-title">Three chapters.<br /><em>One expression.</em></h2><div class="notes-grid">${Object.entries(scent.notes).map(([group, notes], index) => `<div class="note-group"><span class="note-number" aria-hidden="true">0${index + 1}</span><h3>${group === "middle" ? "Heart" : group[0].toUpperCase() + group.slice(1)} notes</h3><ul>${notes.map((note) => `<li>${note}</li>`).join("")}</ul></div>`).join("")}</div></div></section>
      <section class="experience section-pad" aria-labelledby="experience-title"><div class="experience-inner container"><div><p class="eyebrow">The character</p><h2 id="experience-title">An impression<br /><em>of its own.</em></h2><dl class="facts-grid">${Object.entries(scent.facts).map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></div><div><p class="eyebrow">The olfactory portrait</p><h3 class="accords-heading">Main accords</h3>${scent.accords.map(([label, value]) => `<div class="accord-row"><span class="accord-label">${label}</span><div class="accord-track" aria-hidden="true"><span style="width:${value}%"></span></div><span class="accord-strength">${value}<span class="sr-only"> out of 100</span></span></div>`).join("")}</div></div></section>
      <section class="related section-pad" aria-labelledby="related-title"><div class="section-heading container"><div><p class="eyebrow">Continue your discovery</p><h2 id="related-title">Another side <em>of you.</em></h2></div><a class="text-link" href="index.html#collection">View the collection <span aria-hidden="true">↗</span></a></div><div class="collection-grid container">${related.map(cardMarkup).join("")}</div></section>`;
  }

  if (isHome) initializeCatalogue();
  else renderFragrance();
})();
