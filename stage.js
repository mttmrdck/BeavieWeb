/* =====================================================================
   BEAVIE Parfums — the stage (WebGL)
   ---------------------------------------------------------------------
   One fixed canvas sits behind the page and plays the film.

   - The bottle (the JETHA model) stands at the origin of whichever
     fragrance world is on screen. Worlds live in /worlds, one module
     each, loaded only when the visitor gets near them.
   - The camera is directed by scroll: every world opens wide, pushes in
     as its section centres, and drifts off as it leaves. A lens shift
     keeps the bottle framed on the page's [data-stage] element, so the
     layout and the film stay in register on any screen.
   - Between worlds, fog rolls in, the bottle makes one turn and changes
     its label, and the fog lifts on the next place.

   Loaded on demand by script.js; the page is complete without it.
   ===================================================================== */
import { THREE, env, skyDome, disposeWorld, NOISE } from "./worlds/kit.js";
import { GLTFLoader } from "./assets/vendor/three/GLTFLoader.js";
import { DRACOLoader } from "./assets/vendor/three/DRACOLoader.js";

const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const mix = (a, b, t) => a + (b - a) * t;
const FOV = 28;
const HALF_TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

export async function createStage({ canvas, scents, reduceMotion, finePointer }) {
  const still = reduceMotion.matches;
  const lowTier = !finePointer.matches || (navigator.deviceMemory || 8) <= 4 || (navigator.hardwareConcurrency || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  if ("transmissionResolutionScale" in renderer) renderer.transmissionResolutionScale = lowTier ? 0.5 : 0.75;
  let dpr = Math.min(window.devicePixelRatio || 1, lowTier ? 1.5 : 1.75);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.02);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 700);
  const TARGET = new THREE.Vector3(0, 0.5, 0);
  scene.add(skyDome());

  /* ---------- Lights. Colour and direction come from the world on screen. ---------- */
  const sun = new THREE.DirectionalLight("#ffffff", 0);
  const hemi = new THREE.HemisphereLight("#ffffff", "#000000", 0);
  const rimA = new THREE.DirectionalLight("#ffffff", 0);
  const rimB = new THREE.DirectionalLight("#ffffff", 0);
  const keyLight = new THREE.DirectionalLight("#ffffff", 0); // the product key: always from over the lens' left shoulder
  const cursorLight = new THREE.PointLight("#fff3df", 0, 8, 1.8);
  scene.add(sun, hemi, rimA, rimB, keyLight, cursorLight);

  /* ---------- Reflections: each world's own sky, plus studio strips for the glass ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(skyDome());
  const strips = [];
  {
    const panel = (w, h, power, pos) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.DoubleSide, fog: false }));
      m.position.set(...pos);
      m.lookAt(0, 0, 0);
      m.userData.power = power;
      envScene.add(m);
      strips.push(m);
    };
    panel(4, 5.5, 5, [-5, 3.5, 4.5]);
    panel(0.9, 8, 11, [6, 1.5, -2.2]);
    panel(0.9, 8, 8, [-6.2, 1, -3]);
  }
  function bakeEnv(world) {
    if (!world.envMap) {
      const veil = env.uVeil.value;
      env.uVeil.value = 0;
      strips.forEach((s) => s.material.color.setScalar(s.userData.power * (world.studio ?? 1)));
      world.envMap = pmrem.fromScene(envScene, 0.03, 0.1, 1000).texture;
      env.uVeil.value = veil;
    }
    scene.environment = world.envMap;
  }

  /* ---------- Glass: shared surface effects (rain beads, frost) ---------- */
  const surface = { uWet: { value: 0 }, uFrost: { value: 0 }, uTime: env.uTime };
  const withSurface = (material, key) => {
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, surface);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vObj; varying vec3 vTan; varying vec3 vBit;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vObj = position;
           vTan = normalize(normalMatrix * normalize(vec3(-position.z, 0., position.x) + 1e-6));
           vBit = normalize(normalMatrix * vec3(0., 1., 0.));`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform float uWet, uFrost, uTime; varying vec3 vObj; varying vec3 vTan; varying vec3 vBit;
           ${NOISE}
           vec3 beads(vec2 g){
             vec2 id = floor(g), f = fract(g) - .5; float n = h21(id);
             vec2 c = (vec2(h21(id + 3.1), h21(id + 7.7)) - .5) * .5;
             float r = mix(.12, .32, fract(n * 7.3)) * step(.42, n);
             vec2 d = f - c; float m = smoothstep(r, r * .65, length(d));
             return vec3(d / max(r, 1e-3) * m, m);
           }
           vec2 surfUv(){ return vec2(atan(vObj.z, vObj.x) * .021, vObj.y); }
           vec3 wetField(){ vec2 uv = surfUv();
             return beads(uv * 820.) * .7 + beads(uv * vec2(380., 250.) + vec2(0., uTime * .22)); }
           float frostField(){ vec2 uv = surfUv();
             float n = vnoise(uv * 260.) * .6 + vnoise(uv * 900.) * .4;
             float line = uFrost * 1.3;
             float creep = 1. - smoothstep(line - .55, line, vObj.y / .06 + (n - .5) * .5);
             return creep * (.6 + .4 * vnoise(uv * 2600.)) * step(.001, uFrost); }`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           float fr = frostField();
           #ifdef SHELL
             diffuseColor.rgb += vec3(.5, .58, .68) * fr * .16;
           #endif`,
        )
        .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + fr * .5, 0., 1.);")
        .replace(
          "#include <normal_fragment_maps>",
          `#include <normal_fragment_maps>
           // Beads only where the surface faces the lens; at the silhouette they would alias into noise.
           vec3 wf = wetField() * uWet * step(.0195, length(vObj.xz)) * smoothstep(.4, .8, dot(normal, normalize(vViewPosition)))
             * (1. - smoothstep(.25, .9, fwidth(vObj.y) * 820.));     // and only while a bead is wider than a pixel
           normal = normalize(normal + (vTan * wf.x + vBit * wf.y) * .9 + vTan * (vnoise(surfUv() * 1800.) - .5) * fr * .5);`,
        );
    };
    material.customProgramCacheKey = () => key;
    return material;
  };

  const P = (o) => new THREE.MeshPhysicalMaterial({ metalness: 0, fog: false, ...o });
  const glassMat = withSurface(P({ color: "#fbfffd", roughness: 0.02, transmission: 1, ior: 1.5, thickness: 0.026, specularIntensity: 1, envMapIntensity: 0.7, depthWrite: false }), "glass");
  // Reflections live on their own additive layer so they survive on top of the liquid.
  const shellMat = withSurface(P({ color: "#000000", roughness: 0.03, ior: 1.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 1.5 }), "shell");
  shellMat.defines.SHELL = "";
  const liquidMat = P({ color: "#fff1c9", roughness: 0, transmission: 1, ior: 1.34, thickness: 0.03, attenuationColor: new THREE.Color("#f0c466"), attenuationDistance: 0.55, envMapIntensity: 0.6 });
  const capMat = P({ color: "#060607", roughness: 0.34, specularIntensity: 0.7, clearcoat: 0.25, clearcoatRoughness: 0.45, envMapIntensity: 1.1 });
  const sprayMat = P({ color: "#070708", roughness: 0.2 });
  const tubeMat = P({ color: "#7d8794", roughness: 0.18, envMapIntensity: 0.9 });
  const labelMat = P({ color: "#ffffff", roughness: 0.55, specularIntensity: 0.8, side: THREE.DoubleSide });
  const paperMat = new THREE.MeshStandardMaterial({ color: "#dbd8d0", roughness: 0.7, side: THREE.DoubleSide, fog: false });
  const depthMat = new THREE.MeshBasicMaterial({ colorWrite: false, transparent: true });
  // The label mirrored in polished floors and wet sand, fading with distance from the surface.
  const reflLabelMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide, toneMapped: false,
    uniforms: { map: { value: null }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `varying vec2 vUv; varying float vY; void main(){ vUv = uv; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float uOpacity; varying vec2 vUv; varying float vY;
      void main(){
        gl_FragColor = vec4(texture2D(map, vUv).rgb * .7, uOpacity * (1. - smoothstep(.004, .034, vY)));
        #include <colorspace_fragment>
      }`,
  });

  /* ---------- The bottle ---------- */
  const turn = new THREE.Group();
  const refl = new THREE.Group();
  refl.scale.y = -1;
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.75, 40),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { uK: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
      fragmentShader: `uniform float uK; varying vec2 vUv; void main(){ float d = length(vUv - .5) * 2.; gl_FragColor = vec4(0., 0., 0., (exp(-d * d * 9.) * .85 + exp(-d * d * 2.5) * .2) * uK); }`,
      polygonOffset: true, polygonOffsetFactor: -4,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.004;
  shadow.renderOrder = 0.1;
  const bottle = new THREE.Group();
  bottle.visible = false;
  bottle.add(shadow, refl, turn);
  scene.add(bottle);

  const draco = new DRACOLoader().setDecoderPath("assets/vendor/three/draco/");
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync("assets/models/bottle.glb");
  draco.dispose();
  const model = gltf.scene;
  const bounds = new THREE.Box3().setFromObject(model);
  const SCALE = 1 / (bounds.max.y - bounds.min.y); // exactly 1 unit tall, standing on y = 0
  model.scale.setScalar(SCALE);
  model.position.y = -bounds.min.y * SCALE;
  const reflModel = new THREE.Group();
  reflModel.scale.setScalar(SCALE);
  reflModel.position.y = model.position.y;
  const meshes = [];
  model.traverse((o) => o.isMesh && meshes.push(o));
  meshes.forEach((o) => {
    const part = o.name.startsWith("Bottle_Label") || o.parent.name === "Bottle_Label" ? "label" : o.name;
    if (part === "label") {
      const art = (o.material.name || "").startsWith("M_Label_Art");
      o.material = art ? labelMat : paperMat;
      if (art) {
        const r = new THREE.Mesh(o.geometry, reflLabelMat);
        r.renderOrder = 0.2;
        reflModel.add(r);
      }
    } else if (part === "Bottle_Glass") {
      o.material = glassMat;
      o.renderOrder = 1;
      const shell = new THREE.Mesh(o.geometry, shellMat);
      shell.renderOrder = 3;
      const depth = new THREE.Mesh(o.geometry, depthMat);
      depth.renderOrder = 3.5;
      o.add(shell, depth);
    } else if (part === "Perfume_Liquid") {
      o.material = liquidMat;
      o.renderOrder = 2;
    } else if (part === "Cap_Main") o.material = capMat;
    else if (part === "Dip_Tube") o.material = tubeMat;
    else o.material = sprayMat;
  });
  turn.add(model);
  refl.add(reflModel);

  /* ---------- Label textures, kept only for the scents near the viewport ---------- */
  const loader = new THREE.TextureLoader();
  const labels = new Map();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  function label(url) {
    let entry = labels.get(url);
    if (!entry) {
      entry = { tex: null };
      labels.set(url, entry);
      loader.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;
        tex.anisotropy = Math.min(8, maxAniso);
        entry.tex = tex;
        dirty = true;
      });
    }
    return entry.tex;
  }

  /* ---------- Worlds: imported, built and disposed on demand ---------- */
  const worlds = new Map();
  const C = (hex) => new THREE.Color(hex);
  let px = 1;
  function ensure(name) {
    let entry = worlds.get(name);
    if (!entry) {
      entry = { world: null };
      worlds.set(name, entry);
      import(`./worlds/${name}.js`)
        .then((m) => {
          const w = m.default({ lowTier, still });
          w.c = { top: C(w.sky.top), horizon: C(w.sky.horizon), ground: C(w.sky.ground), sun: C(w.sun.color), fog: C(w.fog.color), rim: C(w.rim?.color ?? "#ffffff"), key: C(w.key?.color ?? "#ffffff"), dir: new THREE.Vector3(...w.sun.dir).normalize() };
          w.group.visible = false;
          w.group.traverse((o) => o.userData.isWeather && (o.material.uniforms.uPx.value = px));
          scene.add(w.group);
          entry.world = w;
          dirty = true;
        })
        .catch((error) => console.warn(`BEAVIE world "${name}" failed to load.`, error));
    }
    return entry.world;
  }
  let active = null;
  function activate(w) {
    if (active === w) return;
    if (active) active.group.visible = false;
    active = w;
    w.group.visible = true;
    env.uSkyTop.value.copy(w.c.top);
    env.uSkyHorizon.value.copy(w.c.horizon);
    env.uGroundCol.value.copy(w.c.ground);
    env.uSunDir.value.copy(w.c.dir);
    env.uSunColor.value.copy(w.c.sun).multiplyScalar(w.sun.intensity);
    env.uSunDisc.value = w.sun.disc ?? 0;
    env.uSunGlow.value = w.sun.glow ?? 0;
    env.uAmb.value = w.amb ?? 1;
    env.uSkyK.value = w.sky.curve ?? 5;
    renderer.toneMappingExposure = w.exposure ?? 1;
    // Illustrated worlds keep their hues with the neutral curve; the rest use ACES.
    const curve = w.toneMapping === "neutral" ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
    if (renderer.toneMapping !== curve) {
      renderer.toneMapping = curve;
      scene.traverse((o) => o.material && (o.material.needsUpdate = true));
    }
    bakeEnv(w);
  }
  function prune(keep) {
    worlds.forEach((entry, name) => {
      if (keep.has(name) || !entry.world || entry.world === active) return;
      scene.remove(entry.world.group);
      disposeWorld(entry.world.group);
      entry.world.envMap?.dispose();
      worlds.delete(name);
    });
    labels.forEach((entry, url) => {
      if (keep.has(url) || !entry.tex || entry.tex === labelMat.map) return;
      entry.tex.dispose();
      labels.delete(url);
    });
  }

  /* ---------- Anchors: where the page wants the bottle, in document space ---------- */
  const anchors = [...document.querySelectorAll("[data-stage]")].map((el) => {
    const scent = scents[Number(el.dataset.scent)];
    return {
      el, scent, world: el.dataset.world, label: scent.label,
      yaw: Number(el.dataset.yaw || 0), az: Number(el.dataset.az || 0), el2: Number(el.dataset.el || 0),
      glow: C(scent.glow), x: 0, y: 0, h: 1,
    };
  });
  let vw = 0, vh = 0, dirty = true;
  function measure() {
    const sy = window.scrollY;
    anchors.forEach((a) => {
      const r = a.el.getBoundingClientRect();
      a.x = r.left + r.width / 2;
      a.y = r.top + r.height / 2 + sy;
      a.h = r.height;
    });
    anchors.sort((a, b) => a.y - b.y);
    dirty = true;
  }
  function resize() {
    // Mobile browsers resize the viewport as the URL bar slides; don't rebuild the buffer for that.
    if (window.innerWidth === vw && Math.abs(window.innerHeight - vh) < 130 && !finePointer.matches) return measure();
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    px = dpr * (vh / 900);
    worlds.forEach((e) => e.world?.group.traverse((o) => o.userData.isWeather && (o.material.uniforms.uPx.value = px)));
    measure();
  }
  new ResizeObserver(measure).observe(document.body);
  window.addEventListener("resize", resize);
  document.fonts?.ready.then(measure);
  resize();

  /* ---------- Pointer: the camera leans, the light trails (or drifts on touch) ---------- */
  const pointer = { tx: 0, ty: 0, x: 0, y: 0, used: false };
  if (finePointer.matches && !still) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / vw) * 2 - 1;
      pointer.ty = -((e.clientY / vh) * 2 - 1);
      pointer.used = true;
    }, { passive: true });
  }

  /* ---------- Frame ---------- */
  const DEFAULT_CAM = { az: [0.4, 0.1, -0.3], el: [0.16, 0.1, 0.08], dolly: [1.6, 1, 1.25] };
  const tmpA = new THREE.Color(), right = new THREE.Vector3(), up = new THREE.Vector3(), white = C("#ffffff");
  let time = still ? 24 : 0, reveal = still ? 1 : 0, veilNow = 1, shown = false, last = performance.now(), slow = 0, frames = 0, lastScroll = -1;

  function update(dt, real = dt) {
    time += dt;
    env.uTime.value = time;
    const sy = window.scrollY, c = sy + vh / 2;

    // Which two anchors are we between, and how far along?
    let k = 0;
    while (k < anchors.length - 2 && c > anchors[k + 1].y) k++;
    const A = anchors[k], B = anchors[Math.min(k + 1, anchors.length - 1)];
    const raw = B === A ? 0 : clamp01((c - A.y) / (B.y - A.y));
    const t = smooth(clamp01((raw - 0.26) / 0.48));
    const near = raw < 0.5 ? A : B;
    const same = A.world === B.world;
    const wA = ensure(A.world), wB = ensure(B.world), w = near === A ? wA : wB;
    if (w) activate(w);

    reveal = Math.min(1, reveal + real / 2.6);
    const rIn = smooth(reveal);

    // Fog between worlds: rises with the scroll, lifts in its own time.
    const want = Math.max(same ? 0 : smooth(clamp01(1 - Math.abs(raw - 0.5) / 0.17)), w ? 0 : 1, 1 - smooth(clamp01(reveal / 0.7)));
    veilNow = still ? want : Math.max(want, veilNow - real * 1.4);
    const veil = veilNow;
    if (wA && wB) tmpA.copy(wA.c.fog).lerp(wB.c.fog, t);
    else if (w) tmpA.copy(w.c.fog);
    scene.fog.color.copy(tmpA);
    env.uFogColor.value.copy(tmpA);
    scene.fog.density = env.uFogDensity.value = (w?.fog.density ?? 0.05) + veil * veil * 1.3;
    env.uVeil.value = veil;

    // Pointer, eased so the world lags behind the hand.
    if (!pointer.used && !still) {
      pointer.tx = Math.sin(time * 0.23) * 0.5;
      pointer.ty = Math.cos(time * 0.17) * 0.3;
    }
    const ease = 1 - Math.exp(-dt * 3);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;

    // Camera direction.
    const cam = w?.cam ?? DEFAULT_CAM;
    let az, el, dolly = 1, u = 0;
    if (same) {
      az = mix(cam.az[1] + A.az, cam.az[1] + B.az, t);
      el = mix(cam.el[1] + A.el2, cam.el[1] + B.el2, t);
    } else {
      u = near === A ? raw * 2 : (raw - 1) * 2; // −1 entering … 0 centred … +1 leaving
      const side = u < 0 ? 0 : 2, s = smooth(Math.abs(u));
      az = mix(cam.az[1] + near.az, cam.az[side], s);
      el = mix(cam.el[1] + near.el2, cam.el[side], s);
      dolly = mix(1, cam.dolly[side], s);
    }
    az += pointer.x * 0.07;
    el = Math.max(0.025, el - pointer.y * 0.03);
    const x = mix(A.x, B.x, t), y = mix(A.y, B.y, t) - sy, h = mix(A.h, B.h, t) / dolly;
    const D = vh / (h * 2 * HALF_TAN);
    camera.position.set(Math.sin(az) * Math.cos(el) * D, 0.5 + Math.sin(el) * D, Math.cos(az) * Math.cos(el) * D);
    camera.lookAt(TARGET);
    camera.setViewOffset(vw, vh, vw / 2 - x, vh / 2 - y, vw, vh);
    camera.updateMatrixWorld();

    // The bottle: faces the lens, turns once and changes label when the scent changes.
    const tex = label(near.label);
    label((near === A ? B : A).label);
    if (tex && labelMat.map !== tex) {
      labelMat.map = reflLabelMat.uniforms.map.value = tex;
      labelMat.needsUpdate = true;
    }
    const spin = A.scent !== B.scent && !still ? Math.PI * 2 : 0;
    turn.rotation.y = az * 0.7 + mix(A.yaw, B.yaw + spin, t) + pointer.x * 0.12;
    refl.rotation.y = turn.rotation.y;

    // Light: blended across the hand-over so the bottle never jumps.
    const a = wA ?? w, b = wB ?? w;
    if (a && b) {
      sun.color.copy(a.c.sun).lerp(b.c.sun, t);
      sun.intensity = mix(a.sun.intensity, b.sun.intensity, t) * rIn;
      sun.position.copy(a.c.dir).lerp(b.c.dir, t).multiplyScalar(10);
      hemi.color.copy(a.c.top).lerp(b.c.top, t).lerp(tmpA.copy(a.c.horizon).lerp(b.c.horizon, t), 0.5);
      hemi.groundColor.copy(a.c.ground).lerp(b.c.ground, t);
      hemi.intensity = mix(a.amb ?? 1, b.amb ?? 1, t) * 2.2 * rIn;
      const rimK = mix(a.rim?.intensity ?? 1.5, b.rim?.intensity ?? 1.5, t) * rIn;
      rimA.color.copy(a.c.rim).lerp(b.c.rim, t);
      rimB.color.copy(rimA.color).lerp(white, 0.4);
      keyLight.color.copy(a.c.key).lerp(b.c.key, t);
      keyLight.intensity = mix(a.key?.intensity ?? 1.2, b.key?.intensity ?? 1.2, t) * rIn;
      rimA.intensity = rimK;
      rimB.intensity = rimK * 0.8;
      surface.uWet.value = mix(a.wet ?? 0, b.wet ?? 0, t);
      surface.uFrost.value = mix(a.frost ?? 0, b.frost ?? 0, t);
      reflLabelMat.uniforms.uOpacity.value = mix(a.reflect ?? 0, b.reflect ?? 0, t) * (1 - veil) * rIn;
      shadow.material.uniforms.uK.value = mix(a.shadow ?? 0.8, b.shadow ?? 0.8, t) * (1 - veil);
      scene.environmentIntensity = mix(a.reflections ?? 1, b.reflections ?? 1, t) * rIn * (1 - 0.5 * veil);
    }
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    rimA.position.copy(camera.position).multiplyScalar(-0.6).addScaledVector(right, -3).addScaledVector(up, 1.5);
    rimB.position.copy(camera.position).multiplyScalar(-0.5).addScaledVector(right, 3.4).addScaledVector(up, 0.8);
    keyLight.position.copy(camera.position).addScaledVector(right, -3.2).addScaledVector(up, 3);
    cursorLight.color.copy(near.glow).lerp(white, 0.75);
    cursorLight.intensity = (w?.cursor ?? 1) * 2.4 * rIn;
    cursorLight.position.copy(TARGET).addScaledVector(camera.position, 0.22).addScaledVector(right, pointer.x * 1.3).addScaledVector(up, 0.25 + pointer.y * 0.7);

    w?.update?.(time, dt, { u, veil, pointer });
    if (frames % 150 === 0) prune(new Set([A.world, B.world, anchors[Math.min(k + 2, anchors.length - 1)].world, A.label, B.label]));
  }

  function render(now) {
    raf = requestAnimationFrame(render);
    const real = (now - last) / 1000;
    const dt = Math.min(0.05, real);
    last = now;
    if (still || paused) {
      // Reduced motion, or the visitor paused: the film holds still and only re-frames when the page moves.
      if (!dirty && window.scrollY === lastScroll) return;
      update(0);
    } else {
      update(dt, Math.min(1, Math.max(0, real))); // fades run on wall time, so slow devices finish them too
      // Shed resolution if the device can't hold the frame rate.
      slow = dt > 0.034 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 90 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        slow = 0;
        vw = 0;
        resize();
      }
    }
    lastScroll = window.scrollY;
    dirty = false;
    frames++;
    bottle.visible = true;
    renderer.render(scene, camera);
    if (!shown && labelMat.map && active) {
      shown = true;
      document.documentElement.classList.add("gl-ready");
    }
  }

  /* ---------- Run only while a stage section is on screen and the tab is visible ---------- */
  let raf = 0, paused = false;
  const onScreen = new Set();
  const sync = () => {
    const run = onScreen.size > 0 && !document.hidden;
    if (run && !raf) {
      last = performance.now();
      dirty = true;
      raf = requestAnimationFrame(render);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      sync();
    },
    { rootMargin: "10% 0px" },
  );
  document.querySelectorAll(".gl-section").forEach((el) => io.observe(el));
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    document.documentElement.classList.remove("gl-ready", "gl");
    cancelAnimationFrame(raf);
  });

  label(anchors[0].label);
  ensure(anchors[0].world);
  return {
    measure,
    setPaused(value) {
      paused = value;
      dirty = true;
      last = performance.now();
    },
  };
}
