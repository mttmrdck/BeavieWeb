/* =====================================================================
   BEAVIE worlds — shared kit
   ---------------------------------------------------------------------
   Every fragrance world is built from these parts: one lighting model
   (sun + sky + fog, shared by all custom shaders), a shader-material
   factory, and a few builders (rocks, leaves, drapes, weather, smoke).

   Scale: the bottle is 1 unit tall and stands at the origin on y = 0,
   so 1 unit ≈ 9 cm. Worlds are composed at tabletop scale, the way a
   product film is shot.
   ===================================================================== */
import * as THREE from "three";
import { mergeVertices } from "../assets/vendor/three/BufferGeometryUtils.js";

export { THREE };

/* Shared, live uniforms. stage.js writes them; every world shader reads them. */
export const env = {
  uTime: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  uSunColor: { value: new THREE.Color(1, 1, 1) },
  uSunDisc: { value: 0 },
  uSunGlow: { value: 0 },
  uSkyTop: { value: new THREE.Color() },
  uSkyHorizon: { value: new THREE.Color() },
  uGroundCol: { value: new THREE.Color() },
  uAmb: { value: 1 },
  uFogColor: { value: new THREE.Color() },
  uFogDensity: { value: 0.02 },
  uVeil: { value: 0 },
  uSkyK: { value: 5 }, // how fast the sky deepens above the horizon
};

export const NOISE = /* glsl */ `
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
  float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 11.7; a *= .5; } return s; }
`;

const LIGHTING = /* glsl */ `
  uniform float uTime, uSunDisc, uSunGlow, uAmb, uFogDensity, uVeil, uSkyK;
  uniform vec3 uSunDir, uSunColor, uSkyTop, uSkyHorizon, uGroundCol, uFogColor;
  ${NOISE}
  vec3 skyColor(vec3 d){
    vec3 c = mix(uSkyHorizon, uSkyTop, 1. - exp(-max(d.y, 0.) * uSkyK));
    c = mix(c, uGroundCol, smoothstep(0., -.3, d.y));
    float s = max(dot(d, uSunDir), 0.);
    return c + uSunColor * (pow(s, 900.) * uSunDisc + pow(s, 14.) * .16 * uSunGlow + pow(s, 3.) * .04 * uSunGlow);
  }
  // Sun + sky ambient + sky reflection. rough 0..1, f0 = reflectance at normal incidence.
  vec3 lit(vec3 albedo, vec3 N, vec3 V, float rough, float f0){
    float nl = max(dot(N, uSunDir), 0.);
    vec3 amb = mix(uGroundCol, uSkyTop * .55 + uSkyHorizon * .45, N.y * .5 + .5) * uAmb;
    vec3 H = normalize(uSunDir + V);
    float a = max(rough * rough, .003), nh = max(dot(N, H), 0.);
    float d = a * a / (3.14159 * pow(nh * nh * (a * a - 1.) + 1., 2.));
    float fres = f0 + (1. - f0) * pow(1. - max(dot(N, V), 0.), 5.);
    vec3 refl = skyColor(reflect(-V, N)) * (1. - rough) * (1. - rough);
    return albedo * (amb + uSunColor * nl * .32) * (1. - fres * (1. - rough)) + uSunColor * min(d, 60.) * nl * fres * .08 + refl * fres;
  }
  vec3 fogged(vec3 c, float dist){ return mix(c, uFogColor, 1. - exp(-pow(uFogDensity * dist, 2.))); }
`;

/* One factory for every world shader. `vbody` may move `p` (object space) and `n`;
   `fbody` must set `col` (and may set `alpha`). N, V, dist, vWorld, vUv are provided. */
export function mat({ uniforms = {}, vhead = "", vbody = "", fhead = "", fbody, fog = true, ...options }) {
  return new THREE.ShaderMaterial({
    uniforms: { ...env, ...uniforms },
    vertexShader: /* glsl */ `
      uniform float uTime; varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
      ${NOISE} ${vhead}
      void main(){
        vec3 p = position; vec3 n = normal; vUv = uv;
        #ifdef USE_INSTANCING
          mat4 mm = modelMatrix * instanceMatrix;
        #else
          mat4 mm = modelMatrix;
        #endif
        ${vbody}
        vec4 w = mm * vec4(p, 1.);
        vWorld = w.xyz; vNormal = normalize(mat3(mm) * n);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      ${LIGHTING} varying vec3 vWorld; varying vec3 vNormal; varying vec2 vUv;
      ${fhead}
      void main(){
        vec3 V = normalize(cameraPosition - vWorld); float dist = distance(cameraPosition, vWorld);
        vec3 N = normalize(vNormal); if (!gl_FrontFacing) N = -N;
        vec3 col = vec3(0.); float alpha = 1.;
        ${fbody}
        ${fog ? "col = fogged(col, dist);" : ""}
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    ...options,
  });
}

/* A large ground plane (y = 0 unless moved). */
export function ground(material, size = 500, segments = 1) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size, segments, segments), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function skyDome() {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(320, 32, 16),
    mat({
      side: THREE.BackSide, depthWrite: false, fog: false,
      fbody: "col = mix(skyColor(normalize(vWorld - cameraPosition)), uFogColor, uVeil);",
    }),
  );
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

/* Deterministic random + smooth 3D noise for geometry work. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const hash3 = (x, y, z) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const f = (t) => t * t * (3 - 2 * t);
  const u = f(x - xi), v = f(y - yi), w = f(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  return l(
    l(l(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), l(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
    l(l(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), l(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v),
    w,
  );
}

/* A weathered boulder. flatTop cuts the top off level so the bottle can stand on it. */
export function rockGeometry(seed = 1, rough = 0.32, flatTop = null, detail = 5) {
  const ico = new THREE.IcosahedronGeometry(1, detail);
  ico.deleteAttribute("normal");
  ico.deleteAttribute("uv");
  const g = mergeVertices(ico);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = noise3(v.x * 1.3 + seed, v.y * 1.3, v.z * 1.3) * 0.6 + noise3(v.x * 3.1, v.y * 3.1 + seed, v.z * 3.1) * 0.28 + noise3(v.x * 8, v.y * 8, v.z * 8 + seed) * 0.08;
    v.multiplyScalar(1 + (n - 0.5) * rough * 2);
    if (flatTop !== null && v.y > flatTop) v.y = flatTop + (v.y - flatTop) * 0.04;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* Stone with a tide line: dry and matt above, dark and glossy where water reaches. */
export function rockMaterial(color = "#30343a", wetLine = -10) {
  return mat({
    uniforms: { uColor: { value: new THREE.Color(color) }, uWetY: { value: wetLine } },
    fhead: "uniform vec3 uColor; uniform float uWetY;",
    fbody: /* glsl */ `
      vec3 pp = vWorld * 1.6;
      float n = fbm(pp.xz + pp.y * 1.3) * .6 + fbm(pp.xy * 2.3 + pp.z) * .4;
      float wet = 1. - smoothstep(uWetY, uWetY + .3, vWorld.y + (n - .5) * .25);
      vec3 a = uColor * (.4 + 1.1 * n);
      col = lit(mix(a, a * .35, wet), N, V, mix(.8, .14, wet), .04);
    `,
  });
}

/* A broad leaf: a pointed blade that arches along its length, creased at the midrib. Base at the origin, tip along +y. */
export function leafGeometry(length = 3, width = 1) {
  const g = new THREE.PlaneGeometry(1, 1, 6, 14);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) + 0.5, x = pos.getX(i) * 2;
    const profile = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.8);
    pos.setXYZ(i, x * 0.5 * width * profile, t * length, -Math.abs(x) * 0.12 * width * profile + 0.0);
  }
  g.computeVertexNormals();
  return g;
}

/* Foliage: instanced leaves that sway in wind and dip when rain strikes them.
   plants = [{ at:[x,y,z], leaves, size, spread }] */
export function foliage(plants, { seed = 3, color = "#1d4a2c", tip = "#5c8f3a", wetness = 0.7 } = {}) {
  const rand = rng(seed);
  const total = plants.reduce((n, p) => n + p.leaves, 0);
  const material = mat({
    side: THREE.DoubleSide,
    uniforms: { uBase: { value: new THREE.Color(color) }, uTip: { value: new THREE.Color(tip) }, uWet: { value: wetness } },
    vhead: "attribute float aPhase; varying float vT;",
    vbody: /* glsl */ `
      float t = uv.y; vT = t;
      float sway = sin(uTime * 1.1 + aPhase * 6.28 + t * 2.) * .5 + sin(uTime * 2.7 + aPhase * 17.) * .2;
      float hit = pow(max(0., sin(uTime * (1.6 + aPhase) + aPhase * 40.)), 30.);
      p.z += (sway * .1 - hit * .22) * t * t * 3.;
      p.x += sway * .04 * t * t * 3.;
      p.z -= t * t * 1.1;                       // the arch
    `,
    fhead: "uniform vec3 uBase, uTip; uniform float uWet; varying float vT;",
    fbody: /* glsl */ `
      float vein = smoothstep(.03, .0, abs(vUv.x - .5)) * .5 + smoothstep(.06, .0, abs(fract((vUv.y + abs(vUv.x - .5) * .7) * 9.) - .5)) * .12;
      vec3 albedo = mix(uBase, uTip, vT * .7 + vein * .5) * (.75 + .5 * vnoise(vUv * vec2(8., 30.)));
      col = lit(albedo, N, V, mix(.55, .16, uWet), .04);
      col += albedo * uSunColor * pow(max(dot(-N, uSunDir), 0.), 1.5) * .22;   // light through the leaf
    `,
  });
  const mesh = new THREE.InstancedMesh(leafGeometry(), material, total);
  const phase = new Float32Array(total);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), at = new THREE.Vector3();
  let i = 0;
  plants.forEach((plant) => {
    for (let k = 0; k < plant.leaves; k++, i++) {
      const yaw = (k / plant.leaves) * Math.PI * 2 + rand() * 0.8;
      const lean = 0.25 + rand() * (plant.spread ?? 0.9);
      e.set(lean, yaw, 0, "YXZ");
      q.setFromEuler(e);
      const size = plant.size * (0.6 + rand() * 0.6);
      s.set(size, size, size);
      at.fromArray(plant.at);
      mesh.setMatrixAt(i, m.compose(at, q, s));
      phase[i] = rand();
    }
  });
  mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
  mesh.frustumCulled = false;
  return mesh;
}

/* Hanging cloth with deep folds that breathe slowly. Lies in the XY plane, hangs from the top edge. */
export function drape(width, height, { color = "#5a0f1e", sheen = "#ff9aa8", folds = 1.6, depth = 0.5, seed = 0 } = {}) {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, Math.round(width * 6), 12),
    mat({
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(color) }, uSheen: { value: new THREE.Color(sheen) }, uFold: { value: new THREE.Vector3(folds, depth, seed) } },
      vhead: /* glsl */ `uniform vec3 uFold; float fold(float x, float y){ float hang = 1. - y * .35;
        return (sin(x * uFold.x + uFold.z + sin(x * .37 + uFold.z) * 2.) * .65 + sin(x * uFold.x * 2.3 + 1.7) * .35) * uFold.y * hang
          + sin(uTime * .35 + x * .5 + y * 1.5) * .05 * (1. - y); }`,
      vbody: /* glsl */ `
        float fx = position.x, fy = uv.y;
        p.z += fold(fx, fy);
        float dx = (fold(fx + .05, fy) - fold(fx - .05, fy)) / .1;
        n = normalize(vec3(-dx, 0., 1.));
      `,
      fhead: "uniform vec3 uColor, uSheen;",
      fbody: /* glsl */ `
        float nv = max(dot(N, V), 0.);
        col = lit(uColor, N, V, .95, .0) * (.35 + .65 * nv);        // pile absorbs light face-on
        col += uSheen * uSunColor * pow(1. - nv, 2.5) * .12 * (.3 + max(dot(N, uSunDir), 0.));   // and glows at grazing angles
      `,
    }),
  );
}

/* Weather and dust: a pool of points that wraps around a box centred on the bottle. */
export function points({ count = 600, box = [9, 5, 9], centre = [0, 2, 0], vel = [0, 0, 0], size = 2, stretch = 1, sway = 0, twinkle = 0, color = "#ffffff", alpha = 0.5, additive = true }) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3), rnd = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    pos[i] = Math.random();
    rnd[i] = Math.random();
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 3));
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false,
    uniforms: {
      uTime: env.uTime, uFogDensity: env.uFogDensity, uPx: { value: 1 }, uOpacity: { value: alpha },
      uBox: { value: new THREE.Vector3(...box) }, uCentre: { value: new THREE.Vector3(...centre) }, uVel: { value: new THREE.Vector3(...vel) },
      uShape: { value: new THREE.Vector4(size, stretch, sway, twinkle) }, uColor: { value: new THREE.Color(color) },
    },
    vertexShader: /* glsl */ `
      uniform float uTime, uPx, uFogDensity; uniform vec3 uBox, uCentre, uVel; uniform vec4 uShape;
      attribute vec3 aRnd; varying float vA; varying float vR;
      void main(){
        vec3 p = position * uBox + uVel * uTime * (.6 + .8 * aRnd.y);
        p.x += sin(uTime * (.3 + aRnd.z) + aRnd.x * 40.) * uShape.z;
        p.z += cos(uTime * (.25 + aRnd.y) + aRnd.z * 40.) * uShape.z;
        p = mod(p, uBox) - .5 * uBox + uCentre;
        vec4 mv = viewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        gl_PointSize = uShape.x * (.5 + aRnd.z) * uPx * (6. / depth) * max(1., uShape.y);
        // Nearer drops are larger and fainter, distant ones dissolve into the fog: rain has depth.
        vA = smoothstep(.4, 1.6, depth) * (.35 + .65 * aRnd.y) * exp(-pow(uFogDensity * depth * .8, 2.));
        vR = aRnd.y;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uOpacity, uTime; uniform vec4 uShape; varying float vA; varying float vR;
      void main(){
        vec2 c = gl_PointCoord - .5; c.x *= max(1., uShape.y);
        float a = smoothstep(1., .15, length(c * 2.));
        float tw = mix(1., .5 + .5 * sin(uTime * 3. * (.5 + vR) + vR * 90.), uShape.w);
        gl_FragColor = vec4(uColor, a * uOpacity * vA * tw);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Points(g, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  mesh.userData.isWeather = true;
  return mesh;
}

/* Rising smoke: tall ribbons whose shape is carved out of flowing noise. */
export function smoke(at, { height = 7, width = 1.6, color = "#d8c8b8", strength = 0.5, seed = 0 } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, 1, 1),
    mat({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
      uniforms: { uColor: { value: new THREE.Color(color) }, uS: { value: new THREE.Vector2(strength, seed) } },
      fhead: "uniform vec3 uColor; uniform vec2 uS;",
      fbody: /* glsl */ `
        vec2 q = vUv; float rise = uTime * .11;
        float bend = (fbm(vec2(q.y * 2.2 - rise, uS.y)) - .5) * (.25 + q.y * .9);
        float core = abs(q.x - .5 - bend * .5);
        float thin = mix(.05, .32, q.y);
        float wisp = smoothstep(thin, 0., core) * (.45 + .55 * fbm(vec2(q.x * 5. + uS.y, q.y * 3.5 - rise * 2.)));
        alpha = wisp * uS.x * smoothstep(0., .08, q.y) * smoothstep(1., .45, q.y);
        col = uColor * (uSkyHorizon * 1.5 + uSunColor * .25);
      `,
    }),
  );
  mesh.position.set(at[0], at[1] + height / 2, at[2]);
  mesh.renderOrder = 3.8;
  return mesh;
}

/* A soft shaft of light, for canopies and windows. */
export function shaft(from, to, radius, color = "#ffffff", strength = 0.2) {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.35, radius, a.distanceTo(b), 20, 1, true),
    mat({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uColor: { value: new THREE.Color(color) }, uK: { value: strength } },
      fhead: "uniform vec3 uColor; uniform float uK;",
      fbody: /* glsl */ `
        float rim = pow(abs(dot(N, V)), 1.6);
        alpha = rim * uK * smoothstep(0., .25, vUv.y) * smoothstep(1., .5, vUv.y) * (.7 + .3 * fbm(vec2(vUv.x * 9., vUv.y * 2. - uTime * .05))) * (1. - uVeil);
        col = uColor * uSunColor;
      `,
    }),
  );
  mesh.position.copy(a).lerp(b, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
  mesh.renderOrder = 3.9;
  return mesh;
}

export const standard = (color, roughness = 0.6, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...extra });

/* Free every GPU resource a world owns. */
export function disposeWorld(group) {
  group.traverse((o) => {
    o.geometry?.dispose();
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m?.dispose());
  });
}
