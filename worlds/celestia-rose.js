/* Celestia Rose: the glacier. A frozen lake with air caught under its surface, a wall of ice,
   one crystal holding something pink, snow that barely falls. */
import { THREE, mat, ground, points, rng } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rand = rng(31);

  group.add(
    ground(
      mat({
        fbody: /* glsl */ `
          vec2 q = vWorld.xz;
          float w = fbm(q * .6 + fbm(q * 1.5));
          float crack = pow(1. - abs(w * 2. - 1.), 26.) + pow(1. - abs(fbm(q * 1.7 + 3.) * 2. - 1.), 40.) * .6;
          // Air bubbles locked below the surface: looked up where the view ray lands at depth, so they shift as the lens moves.
          vec2 bg = (q - V.xz / max(V.y, .1) * .22) * 5., bid = floor(bg), bf = fract(bg) - .5;
          float br = .07 + .2 * h21(bid);
          float bub = smoothstep(br, br * .55, length(bf - (vec2(h21(bid + 2.), h21(bid + 4.)) - .5) * .5)) * step(.5, h21(bid + 9.));
          float snow = smoothstep(.52, .68, fbm(q * .33 + 8.));
          vec3 ice = mix(vec3(.07, .15, .27), vec3(.24, .4, .58), fbm(q * .25)) + crack * .45 + bub * .22;
          float bump = .05 * (1. + snow * 5.);
          vec3 Ni = normalize(vec3((vnoise(q * 4.) - .5) * bump, 1., (vnoise(q * 4. + 5.) - .5) * bump));
          col = lit(mix(ice, vec3(.8, .86, .95), snow), Ni, V, mix(.06, .9, snow), .04);
        `,
      }),
    ),
  );

  // Hexagonal ice crystals.
  const crystal = new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0.02), new THREE.Vector2(0.42, 0.74), new THREE.Vector2(0, 1)], 6);
  const iceMat = (c, e) => new THREE.MeshPhysicalMaterial({ color: c, emissive: e, emissiveIntensity: 0.5, roughness: 0.1, flatShading: true, envMapIntensity: 1.7, clearcoat: 0.6 });
  const blue = iceMat("#9cc6ee", "#16304f"), rose = iceMat("#f0b0cc", "#6a2440");
  const place = (x, z, r, h, material) => {
    const m = new THREE.Mesh(crystal, material);
    m.position.set(x, -0.1, z);
    m.scale.set(r, h, r);
    m.rotation.set((rand() - 0.5) * 0.45, rand() * 3, (rand() - 0.5) * 0.45);
    group.add(m);
  };
  for (let i = 0; i < (lowTier ? 22 : 46); i++) place((rand() - 0.5) * 30, -6 - rand() * 12, 0.5 + rand() * 1.1, 2.5 + rand() * 8, blue);
  place(-2.4, -1.3, 0.28, 0.9, blue);
  place(-2.9, -1.7, 0.2, 0.55, blue);
  place(2.6, -2.0, 0.34, 1.3, blue);
  place(2.2, -2.5, 0.22, 0.7, blue);
  place(-1.3, -3.6, 0.42, 1.7, rose);
  place(-0.8, -3.9, 0.25, 0.9, rose);

  group.add(points({ count: lowTier ? 220 : 520, box: [14, 7, 14], centre: [0, 3, -1], vel: [0.05, -0.22, 0.02], size: 2.2, sway: 0.25, twinkle: 0.8, color: "#eef6ff", alpha: 0.8 }));

  return {
    group,
    sky: { top: "#081329", horizon: "#52739f", ground: "#16263f" },
    sun: { dir: [0.4, 0.5, -0.6], color: "#dfeaff", intensity: 2.3, glow: 1 },
    key: { color: "#eef4ff", intensity: 1.3 },
    rim: { color: "#b5ddff", intensity: 2.8 },
    fog: { color: "#33507c", density: 0.026 },
    amb: 0.9, frost: 0.55, reflect: 0.3, shadow: 0.6,
    cam: { az: [0.5, 0.15, -0.3], el: [0.17, 0.1, 0.07], dolly: [1.8, 1, 1.2] },
  };
}
