/* =====================================================================
   BEAVIE Parfums — the collection (WebGL)
   ---------------------------------------------------------------------
   The eight flacons laid in a rosette, bases to the centre, seen from
   above on a pale ground. Each one answers the pointer: it lifts, slides
   a little out of the ring and rolls to catch the light. Choosing one
   pulls the lens in before the page hands over to that fragrance.

   The page's own <a> elements sit over the bottles and do the hit
   testing, so every bottle is a real link (keyboard, new tab, touch).
   ===================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "./assets/vendor/three/GLTFLoader.js";
import { DRACOLoader } from "./assets/vendor/three/DRACOLoader.js";

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const FOV = 26;
const HALF_TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const RING = 0.66; // where each base sits from the centre (bottle = 1 unit long)
const RADIUS = RING + 1;

export async function createCollection({ canvas, anchor, links, scents, reduceMotion, finePointer }) {
  const still = reduceMotion.matches;
  const lowTier = !finePointer.matches || (navigator.hardwareConcurrency || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ("transmissionResolutionScale" in renderer) renderer.transmissionResolutionScale = lowTier ? 0.5 : 0.8;
  const dpr = Math.min(window.devicePixelRatio || 1, lowTier ? 1.5 : 2);

  const scene = new THREE.Scene();
  const ground = new THREE.Color(getComputedStyle(document.body).backgroundColor);
  scene.background = ground;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);

  // A bright studio: one broad key, long strips for the glass edges, pale walls.
  {
    const env = new THREE.Scene();
    env.background = new THREE.Color("#b9b4ab");
    const panel = (w, h, power, pos) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff8ee").multiplyScalar(power), side: THREE.DoubleSide }));
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      env.add(m);
    };
    panel(7, 7, 4.5, [-4, 7, 3]);
    panel(1, 9, 9, [7, 3, -2]);
    panel(1, 9, 6, [-7, 2.5, -4]);
    panel(10, 1, 2.2, [0, 1, 8]);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.03).texture;
    pmrem.dispose();
  }

  const key = new THREE.DirectionalLight("#fff4e4", 2.6);
  key.position.set(-3.2, 7, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(lowTier ? 1024 : 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -2.6;
  key.shadow.camera.right = key.shadow.camera.top = 2.6;
  key.shadow.radius = 9;
  key.shadow.bias = -0.0006;
  const cursorLight = new THREE.PointLight("#ffffff", 0, 6, 1.6);
  scene.add(key, new THREE.HemisphereLight("#ffffff", "#d8d2c6", 1.5), cursorLight);

  // The ground only shows shadows; the page's own colour is the surface.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.2, color: "#3a2f22" }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- Materials (same glass recipe as the fragrance worlds) ---------- */
  const P = (o) => new THREE.MeshPhysicalMaterial({ metalness: 0, ...o });
  const glassMat = P({ color: "#fbfffd", roughness: 0.02, transmission: 1, ior: 1.5, thickness: 0.026, specularIntensity: 1, envMapIntensity: 0.8, depthWrite: false });
  const shellMat = P({ color: "#000000", roughness: 0.03, ior: 1.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 0.9 });
  const liquidMat = P({ color: "#fff0c2", roughness: 0, transmission: 1, ior: 1.34, thickness: 0.03, attenuationColor: new THREE.Color("#eebd58"), attenuationDistance: 0.4, envMapIntensity: 0.6 });
  const capMat = P({ color: "#08080a", roughness: 0.34, specularIntensity: 0.7, clearcoat: 0.25, clearcoatRoughness: 0.45 });
  const sprayMat = P({ color: "#09090a", roughness: 0.2 });
  const tubeMat = P({ color: "#9aa2ad", roughness: 0.18 });
  const paperMat = new THREE.MeshStandardMaterial({ color: "#dbd8d0", roughness: 0.7, side: THREE.DoubleSide });

  const draco = new DRACOLoader().setDecoderPath("assets/vendor/three/draco/");
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync("assets/models/bottle.glb");
  draco.dispose();
  const bounds = new THREE.Box3().setFromObject(gltf.scene);
  const SCALE = 1 / (bounds.max.y - bounds.min.y);
  const HALF_WIDTH = ((bounds.max.x - bounds.min.x) / 2) * SCALE;
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  function makeBottle(scent) {
    const model = gltf.scene.clone(true);
    model.scale.setScalar(SCALE);
    model.position.y = -bounds.min.y * SCALE;
    const labelMat = P({ color: "#ffffff", roughness: 0.55, specularIntensity: 0.8, side: THREE.DoubleSide });
    loader.load(scent.labelSmall, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      tex.anisotropy = Math.min(8, maxAniso);
      labelMat.map = tex;
      labelMat.needsUpdate = true;
    });
    const meshes = [];
    model.traverse((o) => o.isMesh && meshes.push(o));
    meshes.forEach((o) => {
      const part = o.name.startsWith("Bottle_Label") || o.parent.name === "Bottle_Label" ? "label" : o.name;
      o.castShadow = true;
      if (part === "label") o.material = (o.material.name || "").startsWith("M_Label_Art") ? labelMat : paperMat;
      else if (part === "Bottle_Glass") {
        o.material = glassMat;
        o.renderOrder = 1;
        o.castShadow = false;
        const shell = new THREE.Mesh(o.geometry, shellMat);
        shell.renderOrder = 3;
        o.add(shell);
      } else if (part === "Perfume_Liquid") {
        o.material = liquidMat;
        o.renderOrder = 2;
      } else if (part === "Cap_Main") o.material = capMat;
      else if (part === "Dip_Tube") o.material = tubeMat;
      else o.material = sprayMat;
    });
    return model;
  }

  /* ---------- The rosette ---------- */
  const rosette = new THREE.Group();
  scene.add(rosette);
  const bottles = scents.map((scent, i) => {
    const spoke = new THREE.Group(); // points this bottle's cap outward
    spoke.rotation.y = -(i / scents.length) * Math.PI * 2;
    const slide = new THREE.Group(); // travels along the spoke
    const roll = new THREE.Group(); // turns the bottle about its own length
    const lay = new THREE.Group(); // lays it down, label up
    lay.rotation.x = -Math.PI / 2;
    lay.add(makeBottle(scent));
    roll.add(lay);
    roll.position.y = HALF_WIDTH;
    slide.add(roll);
    spoke.add(slide);
    rosette.add(spoke);
    return { spoke, slide, roll, hover: 0, enter: still ? 1 : 0 };
  });

  /* ---------- Framing: the rosette is docked to the page's anchor element ---------- */
  let vw = 0, vh = 0, box = { x: 0, y: 0, d: 1 }, dirty = true;
  const EL = 1.12; // lens elevation: nearly overhead, enough tilt to feel the depth
  const look = new THREE.Vector3(0, 0.12, 0);
  const focus = new THREE.Vector3();
  let zoom = 0, selected = -1;
  function resize() {
    const r = canvas.getBoundingClientRect();
    vw = r.width;
    vh = r.height;
    renderer.setPixelRatio(dpr);
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    const a = anchor.getBoundingClientRect();
    box = { x: a.left - r.left + a.width / 2, y: a.top - r.top + a.height / 2, d: Math.min(a.width, a.height) };
    dirty = true;
  }
  function frameCamera(px, py) {
    const D = ((2 * RADIUS * 1.04) / (2 * HALF_TAN)) * (vh / box.d) * (1 - 0.62 * smooth(zoom));
    const az = px * 0.1, el = EL - py * 0.05;
    focus.copy(look);
    if (selected >= 0) focus.lerp(bottles[selected].centre, smooth(zoom));
    camera.position.set(focus.x + Math.sin(az) * Math.cos(el) * D, focus.y + Math.sin(el) * D, focus.z + Math.cos(az) * Math.cos(el) * D);
    camera.lookAt(focus);
    const k = 1 - smooth(zoom);
    camera.setViewOffset(vw, vh, (vw / 2 - box.x) * k, (vh / 2 - box.y) * k, vw, vh);
    camera.updateMatrixWorld();
  }
  // Lay each page link over its bottle so pointer, touch and keyboard all hit the real thing.
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  function placeLinks() {
    frameCamera(0, 0);
    bottles.forEach((b, i) => {
      const angle = b.spoke.rotation.y;
      const dir = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
      b.centre = dir.clone().multiplyScalar(RING + 0.5).setY(HALF_WIDTH);
      v.copy(dir).multiplyScalar(RING - 0.02).setY(HALF_WIDTH).project(camera);
      v2.copy(dir).multiplyScalar(RADIUS + 0.02).setY(HALF_WIDTH).project(camera);
      const ax = (v.x * 0.5 + 0.5) * vw, ay = (-v.y * 0.5 + 0.5) * vh, bx = (v2.x * 0.5 + 0.5) * vw, by = (-v2.y * 0.5 + 0.5) * vh;
      const length = Math.hypot(bx - ax, by - ay);
      const el = links[i];
      el.style.width = `${length.toFixed(1)}px`;
      el.style.height = `${(length * 0.5).toFixed(1)}px`;
      el.style.left = `${((ax + bx) / 2).toFixed(1)}px`;
      el.style.top = `${((ay + by) / 2).toFixed(1)}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(by - ay, bx - ax).toFixed(3)}rad)`;
    });
  }
  new ResizeObserver(() => {
    resize();
    placeLinks();
  }).observe(canvas);
  resize();
  placeLinks();

  /* ---------- Pointer ---------- */
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  if (finePointer.matches && !still) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }
  let hovered = -1;

  /* ---------- Frame ---------- */
  let last = performance.now(), time = 0, clock = 0, raf = 0, ready = false;
  function render(now) {
    raf = requestAnimationFrame(render);
    const real = Math.max(0, (now - last) / 1000);
    const dt = Math.min(0.05, real);
    last = now;
    time += dt;
    clock += Math.min(0.25, real); // the entrance runs on wall time, so a slow device still finishes it
    let moving = dirty || selected >= 0;
    const ease = 1 - Math.exp(-dt * 4);
    if (Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.0005) moving = true;
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    if (selected >= 0) zoom = Math.min(1, zoom + dt / 0.6);

    bottles.forEach((b, i) => {
      const enterTarget = clamp01((clock - 0.25 - i * 0.07) / 1.1);
      if (b.enter < 1) {
        b.enter = still ? 1 : enterTarget;
        moving = true;
      }
      const target = i === hovered || i === selected ? 1 : 0;
      const others = (hovered >= 0 || selected >= 0) && target === 0 ? 1 : 0;   // the rest of the ring gives way
      b.recede = (b.recede ?? 0) + (others - (b.recede ?? 0)) * (1 - Math.exp(-dt * 6));
      if (Math.abs(others - b.recede) > 0.001) moving = true;
      if (Math.abs(target - b.hover) > 0.001) moving = true;
      b.hover += (target - b.hover) * (1 - Math.exp(-dt * 7));
      const e = smooth(b.enter), h = b.hover;
      // In: each bottle slides out from the centre and settles. Hover: lift, ease outward, roll toward the key light.
      b.slide.position.z = -(RING * e + 0.16 * h - 0.04 * b.recede) + (1 - e) * 0.5;
      b.slide.position.y = 0.16 * h;
      b.slide.scale.setScalar((0.6 + 0.4 * e) * (1 + 0.06 * h - 0.04 * b.recede));
      b.roll.rotation.z = (1 - e) * 1.2 + h * 0.5 * (i % 2 ? -1 : 1);
      b.spoke.visible = b.enter > 0.001;
    });
    // The whole ring leans a breath toward the pointer; it never spins.
    rosette.rotation.y = pointer.x * 0.05;
    cursorLight.intensity = finePointer.matches ? 5 : 0;
    cursorLight.position.set(pointer.x * 2.4, 1.3, -pointer.y * 2.0);

    if (!moving && ready) return; // nothing changed: keep the last frame
    dirty = false;
    frameCamera(pointer.x, pointer.y);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      document.documentElement.classList.add("gl-ready");
    }
  }

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !raf && !document.hidden) {
      last = performance.now();
      dirty = true;
      raf = requestAnimationFrame(render);
    } else if (!entry.isIntersecting && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(canvas);
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    document.documentElement.classList.remove("gl", "gl-ready");
  });

  return {
    setHover(index) {
      hovered = index;
    },
    // Pull the lens in on one bottle; resolves when the move has played.
    select(index) {
      selected = index;
      return new Promise((resolve) => setTimeout(resolve, still ? 0 : 480));
    },
  };
}
