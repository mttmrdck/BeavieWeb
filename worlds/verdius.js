/* =====================================================================
   Verdius — the rain forest
   ---------------------------------------------------------------------
   After the art reference (testwebsite.pdf, page 3): a stand of tall
   trunks receding into mist, ferns and broad leaves in layers, rain at
   every depth. The bottle stands on a mossy stone above a wet floor.

   What moves, and why:
   - Rain falls in three depths, slanted by the wind; near drops are long
     and faint, far ones are lost in the mist.
   - Every drop that lands in standing water opens a ring.
   - Fronds dip under the rain and lift in the gusts.
   - Mist drifts between the trunks; light breaks through the canopy.
   ===================================================================== */
import { THREE, mat, ground, points, foliage, rockGeometry, shaft, rng } from "./kit.js";
import { paintedRock, ferns, PAINT } from "./painted.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rand = rng(21);

  /* ---------- The floor: dark loam, leaf litter, puddles taking the rain ---------- */
  group.add(
    ground(
      mat({
        fbody: /* glsl */ `
          vec2 q = vWorld.xz;
          float n = fbm(q * .7), litter = vnoise(q * 9.) * .6 + vnoise(q * 23.) * .4;
          vec3 loam = mix(vec3(.06, .055, .035), vec3(.17, .14, .07), n) * (.75 + .5 * litter);
          loam = mix(loam, vec3(.13, .2, .06), smoothstep(.55, .75, fbm(q * .5 + 7.)) * .7);   // moss
          float pud = smoothstep(.5, .6, fbm(q * .38 + 4.));
          vec2 g = q * 2.2, id = floor(g), f = fract(g) - .5;
          float ph = fract(uTime * .9 + h21(id) * 5.);
          vec2 c = (vec2(h21(id + 1.7), h21(id + 5.3)) - .5) * .6;
          float d = length(f - c), r = ph * .42;
          float ring = sin((d - r) * 50.) * smoothstep(.06, 0., abs(d - r)) * (1. - ph);
          vec2 dir = normalize(f - c + 1e-4);
          vec3 Np = normalize(vec3(dir.x * ring * .7, 1., dir.y * ring * .7));
          vec3 Ns = normalize(vec3((litter - .5) * .5, 1., (vnoise(q * 9. + 3.) - .5) * .5));
          col = lit(mix(loam, loam * .25, pud), normalize(mix(Ns, Np, pud)), V, mix(.5, .03, pud), .04);
        `,
      }),
    ),
  );

  /* ---------- The stone the bottle stands on, and its neighbours ---------- */
  const stone = paintedRock({ light: "#6f7a6c", mid: "#46514a", dark: "#232a28", moss: "#47702a" });
  const slab = new THREE.Mesh(rockGeometry(7, 0.18, 0.55, 6), stone);
  slab.scale.set(1.35, 0.32, 1.15);
  slab.position.y = -0.176;
  group.add(slab);
  [[-2.6, -0.2, -1.4, 0.8, 0.55, 0.7, 3], [2.4, -0.2, -2.6, 1.1, 0.7, 0.9, 9], [-1.2, -0.1, -4.6, 0.6, 0.4, 0.5, 13]].forEach(([x, y, z, sx, sy, sz, seed]) => {
    const r = new THREE.Mesh(rockGeometry(seed, 0.3, null, 4), stone);
    r.position.set(x, y, z);
    r.scale.set(sx, sy, sz);
    group.add(r);
  });

  /* ---------- Trunks: near ones dark and sharp, far ones fading into the mist ---------- */
  const bark = mat({
    fhead: PAINT,
    fbody: /* glsl */ `
      float streak = fbm(vec2(atan(vWorld.z, vWorld.x) * 0. + vUv.x * 18., vWorld.y * .35));
      vec3 c = paint(vec3(.05, .045, .035), vec3(.16, .13, .09), vec3(.3, .26, .18), N, streak);
      c *= .65 + .5 * streak;
      float moss = smoothstep(.45, .8, fbm(vec2(vUv.x * 9., vWorld.y * .25)) + max(N.z, 0.) * .2) * (1. - smoothstep(2., 9., vWorld.y));
      col = mix(c, vec3(.16, .26, .08) * (.6 + .5 * streak), moss * .8);
    `,
  });
  const trunks = [];
  for (let i = 0; i < (lowTier ? 18 : 30); i++) {
    const depth = 3.5 + Math.pow(rand(), 0.8) * 38;
    const x = (rand() - 0.5) * (8 + depth * 1.6);
    if (Math.abs(x) < 1.6 && depth < 6) continue;          // keep the stage clear
    const r = 0.18 + rand() * 0.35 + depth * 0.004;
    trunks.push([x, -depth, r]);
  }
  trunks.push([-3.4, -2.4, 0.42], [3.9, -3.6, 0.55], [-6.5, -6, 0.6]);
  trunks.forEach(([x, z, r]) => {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r * 1.15, 60, 14, 1, true), bark);
    t.position.set(x, 30 - 0.2, z);
    t.rotation.z = (rand() - 0.5) * 0.06;
    group.add(t);
  });

  /* ---------- Undergrowth: ferns and broad leaves in three bands of depth ---------- */
  const fernBeds = [
    { at: [-1.9, 0, 0.8], fronds: 9, size: 0.85 },
    { at: [2.1, 0, 0.3], fronds: 8, size: 0.75 },
    { at: [-3.2, 0, -0.6], fronds: 10, size: 1.2 },
    { at: [3.4, 0, -1.4], fronds: 10, size: 1.3 },
    { at: [0.6, 0, -3.2], fronds: 9, size: 1.1 },
    { at: [-1.7, 0, -2.6], fronds: 8, size: 0.9 },
  ];
  for (let i = 0; i < (lowTier ? 18 : 40); i++) {
    const z = -3 - rand() * 22;
    fernBeds.push({ at: [(rand() - 0.5) * (10 - z * 1.3), 0, z], fronds: 8, size: 1 + rand() * 1.2 - z * 0.03 });
  }
  group.add(ferns(fernBeds, { seed: 4, base: "#173f22", tip: "#5d9a3b" }));
  const broad = [
    { at: [-2.6, 0, 1.5], leaves: 6, size: 0.26 },
    { at: [2.9, 0, 1.2], leaves: 5, size: 0.24 },
    { at: [-4.2, 0, -2.2], leaves: 7, size: 0.36 },
    { at: [4.6, 0, -0.6], leaves: 7, size: 0.34 },
  ];
  for (let i = 0; i < (lowTier ? 8 : 16); i++) {
    const z = -4 - rand() * 18;
    broad.push({ at: [(rand() - 0.5) * (12 - z * 1.2), 0, z], leaves: 7, size: 0.3 + rand() * 0.35 });
  }
  group.add(foliage(broad, { seed: 5, color: "#16402a", tip: "#4f8a3a", wetness: 1 }));

  /* ---------- Light through the canopy, and the weather ---------- */
  group.add(shaft([-5, 22, -12], [-1.2, 0, -3.4], 2.6, "#d8f0d0", 0.14), shaft([5, 22, -16], [2.6, 0, -8], 2.2, "#d8f0d0", 0.1));
  const wind = [-0.9, -10.5, 0.2];
  group.add(points({ count: lowTier ? 260 : 600, box: [6, 6, 6], centre: [0, 2.6, 2.2], vel: wind, size: 2.4, stretch: 26, color: "#e8f3ee", alpha: 0.22, additive: false }));   // close and soft
  group.add(points({ count: lowTier ? 600 : 1400, box: [16, 10, 16], centre: [0, 4.5, -3], vel: wind, size: 1.4, stretch: 20, color: "#eef7f3", alpha: 0.5, additive: false }));
  group.add(points({ count: lowTier ? 500 : 1100, box: [40, 16, 30], centre: [0, 7, -20], vel: wind, size: 1, stretch: 16, color: "#dfece6", alpha: 0.4, additive: false }));
  group.add(points({ count: lowTier ? 40 : 90, box: [22, 3, 20], centre: [0, 1.2, -6], vel: [0.18, 0.01, 0.06], size: 34, sway: 0.5, color: "#a9bdb2", alpha: 0.04, additive: false }));   // mist

  return {
    group,
    sky: { top: "#56695f", horizon: "#9db0a5", ground: "#121a15", curve: 6 },
    sun: { dir: [-0.3, 0.85, -0.4], color: "#e3f0e2", intensity: 1.6, glow: 0.4 },
    key: { color: "#eaf4ec", intensity: 1.3 },
    rim: { color: "#9bd9c6", intensity: 2.2 },
    fog: { color: "#62786c", density: 0.052 },
    amb: 1.15, wet: 1, reflect: 0.06, shadow: 0.7,
    cam: { az: [0.3, 0.1, -0.2], el: [0.12, 0.08, 0.06], dolly: [1.8, 1, 1.2] },
  };
}
