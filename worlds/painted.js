/* =====================================================================
   BEAVIE worlds — painted kit
   ---------------------------------------------------------------------
   Parts for the illustrated worlds (Wavekiss and those that follow its
   style): shading is banded and hue-driven rather than physical, the way
   a painted travel poster is lit. Everything still moves in 3D and is
   lit by the world's one sun, so the real bottle sits in the same light.
   ===================================================================== */
import { THREE, mat, rng } from "./kit.js";

/* Banded "painted" shading: three tones picked by how much a face sees the sun. */
export const PAINT = /* glsl */ `
  vec3 paint(vec3 dark, vec3 mid, vec3 light, vec3 N, float grain){
    float nl = dot(N, uSunDir) + (grain - .5) * .35;
    vec3 c = mix(dark, mid, smoothstep(-.12, .08, nl));
    return mix(c, light, smoothstep(.42, .58, nl));
  }
`;

/* Stone that looks brushed: warm lit faces, violet-brown shadows, sediment lines. */
export function paintedRock({ light = "#e0a06a", mid = "#a8694a", dark = "#5e3c3c", moss = null } = {}) {
  return mat({
    uniforms: {
      uL: { value: new THREE.Color(light) }, uM: { value: new THREE.Color(mid) }, uD: { value: new THREE.Color(dark) },
      uMoss: { value: new THREE.Color(moss ?? "#000000") }, uMossK: { value: moss ? 1 : 0 },
    },
    fhead: `uniform vec3 uL, uM, uD, uMoss; uniform float uMossK; ${PAINT}`,
    fbody: /* glsl */ `
      vec3 Nf = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
      if (dot(Nf, V) < 0.) Nf = -Nf;
      float g = fbm(vWorld.xz * .5 + vWorld.y * .3);
      vec3 c = paint(uD, uM, uL, Nf, g * .4 + .3);
      c *= .9 + .14 * smoothstep(.2, .8, sin(vWorld.y * 7. + g * 5.) * .5 + .5);
      float top = smoothstep(.7, .74, Nf.y + (fbm(vWorld.xz * .9) - .5) * .18) * uMossK;
      float tuft = vnoise(vWorld.xz * 14.) * .55 + vnoise(vWorld.xz * 45.) * .45;
      c = mix(c, paint(uMoss * .35, uMoss * .62, uMoss * .95, Nf, .5) * (.7 + .5 * tuft), top);
      col = c * (.82 + .25 * uAmb);
    `,
  });
}

/* A tapered, bending palm trunk with ring scars. */
function trunkGeometry(height, lean, dir, radius) {
  const off = (k) => new THREE.Vector3(Math.cos(dir) * lean * height * k, height * Math.pow(k, 0.92), Math.sin(dir) * lean * height * k);
  const curve = new THREE.CatmullRomCurve3([off(0), off(0.3 * 0.3), off(0.55 * 0.6), off(1)].map((v, i) => (i === 0 ? v : v)));
  const segments = 28, radial = 9;
  const g = new THREE.TubeGeometry(curve, segments, 1, radial, false);
  const pos = g.attributes.position, p = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    curve.getPointAt(i / segments, c);
    const r = radius * (1.25 - 0.55 * (i / segments) + 0.25 * Math.exp(-i * 0.8));
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, p.x, p.y, p.z);
    }
  }
  g.computeVertexNormals();
  return { geometry: g, top: curve.getPointAt(1), tangent: curve.getTangentAt(1) };
}

const trunkMat = () =>
  mat({
    fhead: PAINT,
    fbody: /* glsl */ `
      float ring = smoothstep(.15, .45, fract(vUv.x * 46.)) ;
      vec3 c = paint(vec3(.33, .2, .14), vec3(.55, .37, .24), vec3(.78, .58, .38), N, vnoise(vUv * vec2(80., 4.)));
      col = c * (.78 + .22 * ring);
    `,
  });

/* A pinnate frond: a long arching rib with leaflets cut by the shader. Base at the origin, tip along +y. */
function frondGeometry() {
  const g = new THREE.PlaneGeometry(1, 1, 8, 26);
  g.translate(0, 0.5, 0);
  return g;
}
const frondMat = (base, tip) =>
  mat({
    side: THREE.DoubleSide,
    uniforms: { uBase: { value: new THREE.Color(base) }, uTip: { value: new THREE.Color(tip) } },
    vhead: "attribute float aPhase; varying float vT;",
    vbody: /* glsl */ `
      float t = uv.y; vT = t; float u = uv.x * 2. - 1.;
      float gust = sin(uTime * .9 + aPhase * 6.28) * .6 + sin(uTime * 2.3 + aPhase * 19.) * .25;
      p.z += t * t * .62 + gust * .06 * t * t;           // the arch, and the breeze lifting it
      p.x += gust * .05 * t * t;
      p.z -= abs(u) * .1 * sin(3.14159 * t);              // leaflets fold up from the rib
      n = normalize(n + vec3(0., 0., 0.));
    `,
    fhead: `uniform vec3 uBase, uTip; varying float vT; ${PAINT}`,
    fbody: /* glsl */ `
      float u = vUv.x * 2. - 1., v = vUv.y;
      float reach = sin(3.14159 * pow(v, .75)) * .98;
      float comb = fract(v * 30. - abs(u) * 2.1);
      float leaflet = step(comb, .6) * step(abs(u), reach) * step(.04, v);
      float rib = step(abs(u), .045) * step(v, .96);
      if (max(leaflet, rib) < .5) discard;
      vec3 a = mix(uBase, uTip, smoothstep(.1, 1., v * .6 + abs(u) * .5));
      col = paint(a * .5, a, a * 1.3 + vec3(.06, .05, 0.), N, vnoise(vUv * 40.));
      col += a * uSunColor * pow(max(dot(-N, uSunDir), 0.), 2.) * .16;   // light through the leaves
    `,
  });

/* One palm: trunk plus a crown of fronds. Returns a Group placed at `at`. */
export function palm(at, { height = 9, lean = 0.28, dir = 0, fronds = 11, size = 3.4, seed = 1, base = "#2d6e36", tip = "#93c94e" } = {}) {
  const rand = rng(seed);
  const group = new THREE.Group();
  const { geometry, top } = trunkGeometry(height, lean, dir, height * 0.022);
  group.add(new THREE.Mesh(geometry, trunkMat()));
  const crown = new THREE.InstancedMesh(frondGeometry(), frondMat(base, tip), fronds);
  const phase = new Float32Array(fronds);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let k = 0; k < fronds; k++) {
    const yaw = (k / fronds) * Math.PI * 2 + rand() * 0.5;
    const lift = k % 3 === 0 ? 0.55 : 0.95 + rand() * 0.45; // a few young fronds stand up
    e.set(lift, yaw, 0, "YXZ");
    const s = size * (0.75 + rand() * 0.4);
    crown.setMatrixAt(k, m.compose(top, q.setFromEuler(e), new THREE.Vector3(s * 0.36, s, s)));
    phase[k] = rand();
  }
  crown.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
  crown.frustumCulled = false;
  group.add(crown);
  // Coconuts under the crown.
  const nut = new THREE.Mesh(new THREE.SphereGeometry(height * 0.018, 12, 8), mat({ fhead: PAINT, fbody: "col = paint(vec3(.2,.13,.06), vec3(.36,.24,.1), vec3(.55,.4,.18), N, .5);" }));
  for (let k = 0; k < 3; k++) {
    const c = nut.clone();
    c.position.copy(top).add(new THREE.Vector3(Math.cos(k * 2.1) * height * 0.03, -height * 0.025, Math.sin(k * 2.1) * height * 0.03));
    group.add(c);
  }
  group.position.set(...at);
  return group;
}

/* Ferns: clumps of pinnate fronds arching out from the ground. plants = [{ at, fronds, size }] */
export function ferns(plants, { seed = 5, base = "#1d4a26", tip = "#6fa843" } = {}) {
  const rand = rng(seed);
  const total = plants.reduce((n, p) => n + p.fronds, 0);
  const mesh = new THREE.InstancedMesh(frondGeometry(), frondMat(base, tip), total);
  const phase = new Float32Array(total);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), at = new THREE.Vector3();
  let i = 0;
  for (const plant of plants) {
    for (let k = 0; k < plant.fronds; k++, i++) {
      e.set(0.35 + rand() * 0.75, (k / plant.fronds) * Math.PI * 2 + rand() * 0.7, 0, "YXZ");
      const s = plant.size * (0.65 + rand() * 0.5);
      mesh.setMatrixAt(i, m.compose(at.fromArray(plant.at), q.setFromEuler(e), new THREE.Vector3(s * 0.34, s, s)));
      phase[i] = rand();
    }
  }
  mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
  mesh.frustumCulled = false;
  return mesh;
}

/* A hazy landmass on the horizon: a strip whose top edge is a range of peaks. */
export function silhouette({ width = 200, height = 20, seed = 1, peaks = 5, color = "#3f8a8c", top = "#6fb08f", z = -150, x = 0, y = -0.5 }) {
  const rand = rng(seed);
  const bumps = Array.from({ length: peaks }, () => [rand() * 2 - 1, 0.25 + rand() * 0.75, 0.08 + rand() * 0.16]);
  const g = new THREE.PlaneGeometry(width, height, 220, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) < 0) continue;
    const u = pos.getX(i) / (width / 2);
    let h = 0;
    for (const [c, a, w] of bumps) h = Math.max(h, a * Math.exp(-((u - c) ** 2) / (w * w)));
    h *= 1 - Math.pow(Math.abs(u), 6);
    pos.setY(i, -height / 2 + height * h + Math.sin(u * 40 + seed) * height * 0.012);
  }
  const mesh = new THREE.Mesh(
    g,
    mat({
      fog: false,
      uniforms: { uC: { value: new THREE.Color(color) }, uT: { value: new THREE.Color(top) }, uH: { value: height } },
      fhead: "uniform vec3 uC, uT; uniform float uH;",
      fbody: /* glsl */ `
        float k = clamp((vWorld.y + .5) / uH, 0., 1.);
        float tuft = vnoise(vec2(vWorld.x * .35, vWorld.y * .6));
        vec3 c = mix(uC, uT, smoothstep(.25, .9, k + (tuft - .5) * .3));
        c = mix(c, uSkyHorizon, .35 * (1. - k * .6));                  // the air between here and there
        col = mix(c, uFogColor, uVeil);
      `,
    }),
  );
  mesh.position.set(x, y + height / 2, z);
  return mesh;
}

/* A cumulus cloud on a camera-facing card: puffs carved from noise, lit from the sun's side. */
export function cloud({ at = [0, 30, -200], width = 60, height = 26, seed = 1, drift = 0.6, warm = "#f9e3cf" }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    mat({
      transparent: true, depthWrite: false, fog: false,
      uniforms: { uSeed: { value: seed }, uDrift: { value: drift }, uWarm: { value: new THREE.Color(warm) } },
      vhead: "uniform float uDrift;",
      vbody: "p.x += mod(uTime * uDrift + 40., 80.) - 40.;",
      fhead: "uniform float uSeed; uniform vec3 uWarm;",
      fbody: /* glsl */ `
        vec2 p = (vUv - vec2(.5, .22)) * vec2(2., 1.45);       // x -1..1, base near y 0
        float t = uTime * .008;
        float d = 9.;
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          float cx = -.68 + fi * .27 + (h21(vec2(fi, uSeed)) - .5) * .12;
          float r = .16 + .22 * h21(vec2(uSeed, fi + 3.)) * (1. - abs(cx) * .7);
          d = min(d, length(p - vec2(cx, r * .55)) - r);
        }
        d += (fbm(p * 5. + uSeed + t) - .5) * .09 + (vnoise(p * 16. + uSeed) - .5) * .025;
        float shape = (1. - smoothstep(-.012, .012, d)) * smoothstep(-.04, .04, p.y + .02 + (vnoise(vec2(p.x * 6., uSeed)) - .5) * .05);
        shape *= 1. - smoothstep(.82, .98, abs(p.x));      // never reaches the card edge
        if (shape < .01) discard;
        float lit = smoothstep(-.1, .55, p.y * 1.4 - p.x * .3 + (fbm(p * 4. + uSeed) - .5) * .5);
        vec3 c = mix(uWarm * .86, vec3(1., .985, .955), lit);
        c = mix(c, uSkyHorizon, .12 * (1. - lit));
        col = mix(c, uFogColor, uVeil);
        alpha = shape * (1. - uVeil * .6);
      `,
    }),
  );
  mesh.position.set(...at);
  mesh.renderOrder = -5;
  return mesh;
}
