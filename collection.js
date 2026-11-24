/* =====================================================================
   BEAVIE Parfums — the collection (WebGL)
   ---------------------------------------------------------------------
   An exhibition: the eight flacons stand on a round stone plinth and
   travel slowly around a shared centre, about one turn every two
   minutes. Lit like a product shoot (studio environment for the glass,
   a warm key, a cool rim), with soft contact shadows that follow each
   bottle.

   - Pointing at a bottle eases the orbit to a halt and brings that
     bottle forward; leaving lets the orbit drift on again.
   - Choosing one stops the orbit and moves the lens in on it before
     the page hands over to its fragrance world.
   - The page's own <a> elements are moved over the bottles every frame,
     so every bottle is a real link (keyboard, new tab, touch).
   - A governor watches real frame times and lowers the render
     resolution on devices that cannot hold the frame rate.
   ===================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "./assets/vendor/three/RoomEnvironment.js";
import { loadBottleModel, bottleMaterials, labelMaterial, dressBottle, loadLabel, qualityGovernor } from "./bottle.js";

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const FOV = 30;
const HALF_TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const R = 1.6; // orbit radius; the bottle is 1 unit tall
const TURN = (Math.PI * 2) / 120; // one revolution every two minutes

export async function createCollection({ canvas, anchor, links, scents, reduceMotion, finePointer }) {
  const still = reduceMotion.matches;
  const coarse = !finePointer.matches;
  const deviceDpr = window.devicePixelRatio || 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.NeutralToneMapping; // keeps the label colours true
  renderer.toneMappingExposure = 1.0;
  const levels = [
    { dpr: Math.min(deviceDpr, 2), trans: 0.85 },
    { dpr: Math.min(deviceDpr, 1.6), trans: 0.7 },
    { dpr: Math.min(deviceDpr, 1.25), trans: 0.5 },
    { dpr: 1, trans: 0.4 },
  ];
  let quality = coarse ? 1 : 0;
  const applyQuality = () => {
    renderer.setPixelRatio(levels[quality].dpr);
    if ("transmissionResolutionScale" in renderer) renderer.transmissionResolutionScale = levels[quality].trans;
    resize();
  };
  const governor = qualityGovernor({ start: quality, onChange: (level) => ((quality = level), applyQuality()) });

  const scene = new THREE.Scene();
  // A soft pool of light on the ivory ground, brightest behind the plinth.
  {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(256, 230, 20, 256, 256, 360);
    grad.addColorStop(0, "#fffdf9");
    grad.addColorStop(0.55, "#f8f4ee");
    grad.addColorStop(1, "#f5f1ea");
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.background = tex;
  }
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80);

  // Studio reflections: softboxes all round, so glass edges and the cap catch long, clean highlights.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  scene.environmentIntensity = 0.85;
  pmrem.dispose();
  const key = new THREE.DirectionalLight("#fff3e2", 1.5);
  key.position.set(-4, 6, 5);
  const rim = new THREE.DirectionalLight("#e8eefc", 1.1);
  rim.position.set(3, 3, -6);
  const cursorLight = new THREE.PointLight("#ffffff", 0, 7, 1.7);
  scene.add(key, rim, cursorLight, new THREE.HemisphereLight("#fffaf2", "#d9cfbf", 0.6));

  /* ---------- The plinth: pale stone, a faint polish, a soft shadow on the ground ---------- */
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.62, R + 0.66, 0.1, 128),
    new THREE.MeshPhysicalMaterial({ color: "#e7dfd1", roughness: 0.48, clearcoat: 0.5, clearcoatRoughness: 0.18, envMapIntensity: 0.7 }),
  );
  plinth.position.y = -0.05;
  scene.add(plinth);
  const blob = (k) =>
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { uK: { value: k }, uOff: { value: new THREE.Vector2() } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: `uniform float uK; uniform vec2 uOff; varying vec2 vUv;
        void main(){ vec2 p = (vUv - .5) * 2.; float d = length(p), e = length((p - uOff) * vec2(1., 1.4));
          float a = exp(-d * d * 30.) * .75 + exp(-e * e * 7.) * .3;     // a tight contact core and a soft fall-off away from the key
          a *= 1. - smoothstep(.75, 1., max(abs(p.x), abs(p.y)));
          gl_FragColor = vec4(.24, .18, .11, a * uK); }`,
      polygonOffset: true, polygonOffsetFactor: -2,
    });
  const groundShadow = new THREE.Mesh(new THREE.CircleGeometry(R + 1.9, 64), blob(0.3));
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -0.099;
  scene.add(groundShadow);

  /* ---------- The eight ---------- */
  const ready = { labels: 0 };
  const model = await loadBottleModel();
  const mats = bottleMaterials();
  const orbit = new THREE.Group();
  scene.add(orbit);
  const bottles = scents.map((scent, i) => {
    const labelMat = labelMaterial();
    loadLabel(renderer, scent.labelSmall, (tex) => {
      labelMat.map = tex;
      labelMat.needsUpdate = true;
      ready.labels++;
    });
    const { root } = dressBottle(model, mats, labelMat);
    const holder = new THREE.Group(); // position on the orbit
    const turn = new THREE.Group(); // which way the label faces
    turn.add(root);
    holder.add(turn);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), blob(0.6));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    shadow.material.uniforms.uOff.value.set(0.35, 0.3); // stretched away from the key light
    holder.add(shadow);
    orbit.add(holder);
    return { scent, holder, turn, base: (i / scents.length) * Math.PI * 2, hover: 0, enter: still ? 1 : 0, centre: new THREE.Vector3() };
  });

  /* ---------- Framing: the plinth is fitted to the page's anchor element ---------- */
  let vw = 0, vh = 0, box = { x: 0, y: 0, w: 1, h: 1 };
  let EL = 0.3;
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    vw = r.width;
    vh = r.height;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    const a = anchor.getBoundingClientRect();
    box = { x: a.left - r.left + a.width / 2, y: a.top - r.top + a.height / 2, w: a.width, h: a.height };
    EL = box.h / box.w > 1.05 ? 0.4 : 0.24; // a tall frame (phones) looks down a little more, so the ring opens up
  }
  new ResizeObserver(resize).observe(canvas);
  applyQuality();

  const look = new THREE.Vector3(0, 0.42, 0);
  const focus = new THREE.Vector3();
  let zoom = 0, selected = -1;
  function frameCamera(px, py) {
    // Distance that fits the whole ring (width) and its front-to-back depth (height) into the anchor box.
    const tall = box.h / box.w > 1.05; // phones and portrait tablets: the plinth may run off the sides, the bottles may not
    const halfW = tall ? R + 0.3 : (R + 0.5) * 1.02, halfH = (R * Math.sin(EL) + 0.64) * 1.04;
    const byW = halfW / (HALF_TAN * camera.aspect * (box.w / vw));
    const byH = halfH / (HALF_TAN * (box.h / vh));
    const D = Math.max(byW, byH) * (1 - 0.7 * smooth(zoom));
    const az = px * 0.06, el = EL - py * 0.035;
    focus.copy(look);
    if (selected >= 0) focus.lerp(bottles[selected].centre, smooth(zoom));
    camera.position.set(focus.x + Math.sin(az) * Math.cos(el) * D, focus.y + Math.sin(el) * D, focus.z + Math.cos(az) * Math.cos(el) * D);
    camera.lookAt(focus);
    const k = 1 - smooth(zoom);
    camera.setViewOffset(vw, vh, (vw / 2 - box.x) * k, (vh / 2 - box.y) * k, vw, vh);
    camera.updateMatrixWorld();
  }

  // Lay each page link over its bottle; nearer bottles sit above farther ones.
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  function placeLinks() {
    bottles.forEach((bt, i) => {
      bt.holder.getWorldPosition(a);
      bt.centre.copy(a).setY(0.5);
      b.copy(a).setY(1.02).project(camera);
      a.setY(-0.02).project(camera);
      const top = (-b.y * 0.5 + 0.5) * vh, bottom = (-a.y * 0.5 + 0.5) * vh, x = (a.x * 0.5 + 0.5) * vw;
      const h = bottom - top, w = h * 0.55;
      const el = links[i];
      el.style.transform = `translate3d(${(x - w / 2).toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
      el.style.width = `${w.toFixed(1)}px`;
      el.style.height = `${h.toFixed(1)}px`;
      el.style.zIndex = String(Math.round((1 - a.z) * 10000));
    });
  }

  /* ---------- Pointer ---------- */
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  if (!coarse && !still) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }
  let hovered = -1;

  /* ---------- Frame ---------- */
  let last = performance.now(), clock = 0, angle = 0, speed = still ? 0 : TURN, raf = 0, shown = false;
  function render(now) {
    raf = requestAnimationFrame(render);
    const real = Math.max(0, (now - last) / 1000);
    const dt = Math.min(0.05, real);
    last = now;
    clock += Math.min(0.25, real);
    governor.sample(real);

    // The orbit glides; it eases to a halt while a bottle has the visitor's attention.
    const want = still || hovered >= 0 || selected >= 0 ? 0 : TURN;
    speed += (want - speed) * (1 - Math.exp(-dt * 2.2));
    angle += speed * dt;
    if (selected >= 0) zoom = Math.min(1, zoom + real / 0.65);

    const e = 1 - Math.exp(-dt * 3.5);
    pointer.x += (pointer.tx - pointer.x) * e;
    pointer.y += (pointer.ty - pointer.y) * e;
    frameCamera(pointer.x, pointer.y);

    bottles.forEach((bt, i) => {
      bt.enter = still ? 1 : clamp01((clock - 0.2 - i * 0.08) / 1.2);
      const target = i === hovered || i === selected ? 1 : 0;
      bt.hover += (target - bt.hover) * (1 - Math.exp(-dt * 6));
      const t = angle + bt.base;
      const en = smooth(bt.enter), h = bt.hover;
      const r = R * (0.55 + 0.45 * en) + 0.3 * h; // the chosen one steps forward, out of the ring
      bt.holder.position.set(Math.sin(t) * r, 0.06 * h + (1 - en) * -0.25, Math.cos(t) * r);
      bt.holder.scale.setScalar((0.85 + 0.15 * en) * (1 + 0.07 * h));
      bt.holder.visible = bt.enter > 0.001;
      // Each label turns toward the lens, with a slow sway so the glass shows its depth.
      const toCam = Math.atan2(camera.position.x - bt.holder.position.x, camera.position.z - bt.holder.position.z);
      bt.turn.rotation.y = toCam + Math.sin(clock * 0.25 + i * 1.7) * 0.28 * (1 - h);
    });
    cursorLight.intensity = coarse || still ? 0 : 3.5;
    cursorLight.position.set(pointer.x * 3.2, 1.6 + pointer.y * 0.8, 2.6);

    placeLinks();
    renderer.render(scene, camera);
    if (!shown && ready.labels >= scents.length) {
      shown = true;
      document.documentElement.classList.add("gl-ready");
    }
  }

  const start = () => {
    if (raf || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(render);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  let onScreen = true;
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    onScreen ? start() : stop();
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : onScreen && start()));
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    stop();
    document.documentElement.classList.remove("gl", "gl-ready");
  });

  return {
    setHover(index) {
      hovered = index;
    },
    // Halt the orbit and move the lens in on one bottle; resolves when the move has played.
    select(index) {
      selected = index;
      return new Promise((resolve) => setTimeout(resolve, still ? 0 : 560));
    },
    get quality() {
      return quality;
    },
  };
}
