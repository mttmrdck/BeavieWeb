/* =====================================================================
   Wavekiss — the cove
   ---------------------------------------------------------------------
   After the art reference wavekissreference: a curving tropical beach,
   turquoise shallows over sand, a rocky headland crowned with palms,
   hazy islands on the horizon and towering cumulus.

   What moves, and why:
   - Swell lines travel in from the horizon, closer together and slower
     as the water shoals.
   - Each breaker rolls toward the beach, turns to foam and dissolves.
   - The swash runs up the sand and drains back, leaving it darker and
     glossy where it has just been.
   - Fronds lift in the sea breeze; clouds drift; the sun glitters on
     the swell.
   ===================================================================== */
import { THREE, mat, foliage, rockGeometry } from "./kit.js";
import { paintedRock, palm, silhouette, cloud, PAINT } from "./painted.js";

// The beach curves away to the right; all water and sand shaders share this line.
const SHORE = /* glsl */ `
  uniform vec4 uRocks[4];
  float shoreZ(float x){ return -1.65 - .42 * x + .021 * x * x; }
  float swash(float x){ return .5 * sin(uTime * .55 + vnoise(vec2(x * .22, 1.)) * 3.) + .2 * vnoise(vec2(x * .6, uTime * .2)) - .12; }
  float edgeZ(float x){ return shoreZ(x) + swash(x); }
  float rockFoam(vec2 q, float lace){
    float f = 0.;
    for (int i = 0; i < 4; i++) {
      float d = length(q - uRocks[i].xy) - uRocks[i].z;
      float burst = pow(max(0., sin(uTime * .8 + uRocks[i].w)), 6.);
      f += (1. - smoothstep(0., .4 + .9 * burst, d)) * smoothstep(.3, .62, lace + .25 * burst);
    }
    return f;
  }
`;

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rocks = [
    // x, z, footprint radius, wave phase — rocks the swash breaks against
    [3.3, -3.6, 0.9, 0.0],
    [5.1, -4.4, 0.7, 1.7],
    [-6.2, 1.6, 1.4, 3.1],
    [15.5, -30.5, 6.5, 0.8],
  ];
  const uRocks = { value: rocks.map((r) => new THREE.Vector4(r[0], r[1], r[2], r[3])) };

  /* ---------- Sand ---------- */
  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    mat({
      uniforms: { uRocks },
      fhead: SHORE + PAINT,
      fbody: /* glsl */ `
        vec2 q = vWorld.xz;
        float s = shoreZ(q.x), ez = edgeZ(q.x);
        float n = fbm(q * .45), fine = vnoise(q * 14.) * .5 + vnoise(q * 40.) * .5;
        // soft dunes and wind ripples, lit as if they had relief
        float rip = sin(q.x * 2.1 + q.y * .7 + fbm(q * .8) * 3.) * .5 + .5;
        float relief = (fbm(q * .35 + vec2(.25, .1)) - fbm(q * .35)) * 3. + (rip - .5) * .12;
        vec3 dry = mix(vec3(.93, .76, .52), vec3(1., .9, .69), smoothstep(.3, .75, n + relief * .6));
        dry *= .95 + .08 * fine;
        float wet = 1. - smoothstep(s + .2, s + 1.05, q.y + (n - .5) * .5);
        float sheen = 1. - smoothstep(ez, ez + .65, q.y);                 // just drained
        vec3 damp = vec3(.74, .56, .36) * (.9 + .1 * fine);
        vec3 c = mix(dry, damp, wet);
        c = mix(c, c * .75 + uSkyHorizon * .4, sheen * wet * .7);
        c *= .92 + .1 * dot(N, uSunDir);
        vec2 sd = normalize(-uSunDir.xz);
        float len = sqrt(1. - uSunDir.y * uSunDir.y) / max(uSunDir.y, .15);
        float along = dot(q, sd), across = dot(q, vec2(-sd.y, sd.x));
        float width = mix(.2, .12, smoothstep(len * .55, len * .7, along));          // the cap is narrower than the body
        float shade = exp(-pow(abs(across) / width, 3.)) * smoothstep(-.22, .04, along) * (1. - smoothstep(len * .85, len * 1.02, along));
        shade = max(shade * .8, exp(-dot(q, q) * 9.) * .55);
        c = mix(c, c * vec3(.6, .66, .82), shade);
        col = c;
      `,
    }),
  );
  sand.rotation.x = -Math.PI / 2;
  group.add(sand);

  /* ---------- Sea ---------- */
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600, 1, 1),
    mat({
      uniforms: { uRocks },
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      fhead: SHORE,
      fbody: /* glsl */ `
        vec2 q = vWorld.xz;
        float ez = edgeZ(q.x);
        float dn = ez - q.y;                 // how far out from the live edge of the water
        if (dn < 0.) discard;
        float off = shoreZ(q.x) - q.y;       // how far out from the mean shoreline
        float far = clamp(off / 140., 0., 1.);

        // Colour by depth: sand showing through, turquoise shallows, ocean blue beyond.
        vec3 c = mix(vec3(.47, .9, .82), vec3(.1, .76, .8), smoothstep(.4, 4.5, off));
        c = mix(c, vec3(.03, .5, .7), smoothstep(5., 26., off));
        c = mix(c, vec3(.12, .48, .7), smoothstep(30., 140., off));
        float caustic = smoothstep(.55, .9, fbm(q * 1.4 + vec2(uTime * .15, -uTime * .1)) ) * (1. - smoothstep(.5, 4., off));
        c += caustic * .12;
        c = mix(vec3(.92, .78, .55), c, smoothstep(0., .75, dn));
        c = mix(c, uSkyHorizon, pow(1. - max(V.y, 0.), 5.) * .55);    // the sky in the water toward the horizon

        // Swell lines travelling ashore, shorter and more crowded as they shoal.
        float gap = 1. + off * .045;
        float ph = off / gap * 1.25 + uTime * 1.05 + fbm(vec2(q.x * .09, off * .03)) * 5.;
        float line = smoothstep(.88, .985, sin(ph));
        line *= smoothstep(.42, .68, fbm(vec2(q.x * .9 / gap, off * .2 - uTime * .07)));   // broken into strokes
        line *= smoothstep(2., 5., off) * (1. - smoothstep(40., 160., off));
        c = mix(c, vec3(.9, .99, 1.), line * .7);

        // Far chop: short white strokes that come and go, like a painter's flecks.
        vec2 g = vec2(q.x * .22, off * 1.5) / gap;
        vec2 id = floor(g), f = fract(g) - .5;
        float fleck = (1. - smoothstep(.0, .09, abs(f.y))) * (1. - smoothstep(.1, .38, abs(f.x)))
          * step(.66, h21(id)) * max(0., sin(uTime * 1.6 + h21(id + 4.) * 40.));
        c = mix(c, vec3(1.), fleck * smoothstep(6., 18., off) * (1. - far) * .55);

        // Sun glitter on the swell.
        vec3 Nw = normalize(vec3((vnoise(q * 3. + uTime * .6) - .5) * .5, 1., (vnoise(q * 3. - uTime * .5 + 9.) - .5) * .5));
        c += uSunColor * pow(max(dot(reflect(-V, Nw), uSunDir), 0.), 90.) * .9 * (1. - smoothstep(.0, 3., off) * 0.);

        // Breakers: each one rolls in, crests white, and dissolves into the swash.
        float lace = fbm(q * 2.3 + vec2(0., -uTime * .45));
        float foam = 0.;
        for (int w = 0; w < 2; w++) {
          float cyc = fract(uTime * .12 + float(w) * .5 + vnoise(vec2(q.x * .06, 3. + float(w))) * .4);
          float bpos = mix(4.6, .4, cyc);
          float life = smoothstep(0., .14, cyc) * (1. - smoothstep(.7, 1., cyc));
          float face = smoothstep(.0, .35, off - bpos + .9) * (1. - smoothstep(.2, .55, off - bpos)) ;   // the rising water just behind the crest
          c = mix(c, vec3(.42, .93, .88), face * life * .55);
          float brk = (1. - smoothstep(0., .14 + .5 * cyc, abs(off - bpos))) * life;
          foam += brk * smoothstep(.2, .55, lace + .25 * cyc);
        }
        foam += (1. - smoothstep(0., .3, dn)) * smoothstep(.22, .55, lace + .35);                    // the running edge
        foam += (1. - smoothstep(.1, 1.8, dn)) * smoothstep(.56, .72, fbm(q * vec2(2.2, 3.2) + vec2(0., uTime * .22))) * .85;   // left behind
        foam += rockFoam(q, lace);
        c = mix(c, vec3(.98, 1., 1.), clamp(foam, 0., 1.));
        col = c;
      `,
    }),
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = 0.004;
  sea.renderOrder = 0.05;
  group.add(sea);

  /* ---------- Rocks, the islet and the palms ---------- */
  const rock = paintedRock({ light: "#eaa56a", mid: "#b06e4c", dark: "#62404a", moss: "#4f8a3c" });
  const boulder = (x, y, z, sx, sy, sz, seed, ry = 0, detail = 2) => {
    const m = new THREE.Mesh(rockGeometry(seed, 0.3, null, detail), rock);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.rotation.y = ry;
    group.add(m);
  };
  boulder(3.3, -0.2, -3.6, 0.95, 0.75, 0.8, 4);
  boulder(4.2, -0.1, -3.2, 0.45, 0.35, 0.4, 14, 1.3);
  boulder(5.1, -0.15, -4.4, 0.7, 0.5, 0.6, 9, 1);
  boulder(-3.4, -0.3, 2.2, 1.05, 0.8, 0.9, 2, 0.4, 3);
  boulder(-2.5, -0.1, 2.9, 0.38, 0.28, 0.34, 12);
  boulder(2.9, -0.15, 1.6, 0.5, 0.36, 0.45, 33, 0.8);

  // The islet across the cove: stacked stone, a jungle crown, palms leaning out over the water.
  boulder(15, -1.2, -30, 6, 5.5, 5, 21, 0.6, 6);
  boulder(20.5, -1.4, -33, 5, 7.5, 4.5, 5, 1.2, 6);
  boulder(11.2, -0.6, -28.5, 2.6, 2.1, 2.2, 17, 0.2, 4);
  boulder(24.5, -0.8, -31, 3, 3.2, 2.8, 27, 2, 4);
  [
    [14.2, 3, -29.5, { height: 2.8, lean: 0.4, dir: Math.PI * 0.9, seed: 3 }],
    [16.6, 3.4, -30.8, { height: 3.5, lean: 0.28, dir: Math.PI * 0.82, seed: 7 }],
    [19.6, 4.6, -32.5, { height: 3, lean: 0.16, dir: Math.PI * 0.6, seed: 11 }],
    // and on the beach where it curves round to the right, leaning out toward the water
    [10.6, 0, -3.1, { height: 4.4, lean: 0.42, dir: Math.PI * 0.96, seed: 23 }],
    [12.6, 0, -2.7, { height: 5.2, lean: 0.3, dir: Math.PI * 0.86, seed: 29 }],
    [14.6, 0, -3.5, { height: 3.8, lean: 0.22, dir: Math.PI * 0.72, seed: 31 }],
  ].forEach(([x, y, z, o]) => group.add(palm([x, y, z], { ...o, size: o.height * 0.4 })));

  // Tropical undergrowth on the islet, behind the palms on the beach, and framing the foreground.
  const bush = [];
  for (let i = 0; i < (lowTier ? 8 : 16); i++) bush.push({ at: [12 + i * 0.75, 3.4 + Math.sin(i * 1.7) * 0.5 + (i > 9 ? 1.5 : 0), -29.5 - i * 0.22], leaves: 8, size: 0.55, spread: 1.1 });
  for (let i = 0; i < (lowTier ? 5 : 10); i++) bush.push({ at: [11 + i * 0.9, 0, -1.4 - (i % 3) * 0.9], leaves: 9, size: 0.45 + (i % 2) * 0.2, spread: 1 });
  bush.push({ at: [-3.9, 0, 3.2], leaves: 10, size: 0.42 }, { at: [-4.6, 0, 2.1], leaves: 9, size: 0.5 }, { at: [3.6, 0, 2.3], leaves: 9, size: 0.36 }, { at: [4.4, 0, 1.3], leaves: 8, size: 0.44 });
  group.add(foliage(bush, { seed: 8, color: "#1f5e33", tip: "#7fbf4a", wetness: 0.2 }));

  /* ---------- Horizon: islands in haze, and the sky's weather ---------- */
  group.add(
    silhouette({ width: 260, height: 26, seed: 4, peaks: 4, color: "#7aa9b7", top: "#93bfc2", z: -260, x: -60 }),
    silhouette({ width: 120, height: 18, seed: 9, peaks: 3, color: "#4f8f86", top: "#6fae7a", z: -150, x: -95 }),
    silhouette({ width: 70, height: 9, seed: 13, peaks: 3, color: "#3f7d6b", top: "#5f9e5a", z: -95, x: -30 }),
  );

  [
    { at: [-150, 22, -290], width: 200, height: 70, seed: 1.3, drift: 0.5 },
    { at: [-30, 30, -295], width: 120, height: 40, seed: 4.1, drift: 0.35 },
    { at: [95, 26, -295], width: 170, height: 58, seed: 7.7, drift: 0.42 },
    { at: [215, 16, -285], width: 120, height: 36, seed: 2.6, drift: 0.55 },
  ].forEach((c) => group.add(cloud(c)));

  return {
    group,
    toneMapping: "neutral",
    sky: { top: "#1aa6dc", horizon: "#cdf0ea", ground: "#e8c891", curve: 22 },
    sun: { dir: [-0.6, 0.42, -0.68], color: "#fff2d8", intensity: 2.4, disc: 0.5, glow: 1.1 },
    key: { color: "#fff6e6", intensity: 1.0 },
    rim: { color: "#fff1da", intensity: 1.8 },
    fog: { color: "#cdeef0", density: 0.0026 },
    amb: 1.15, studio: 0.8, shadow: 0.35, reflect: 0, wet: 0, cursor: 0.4,
    cam: { az: [0.3, 0.12, -0.2], el: [0.12, 0.06, 0.05], dolly: [1.8, 1, 1.2] },
  };
}
