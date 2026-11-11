/* The opening: a stone disc on still black water, far monoliths, a low band of cold light. */
import { THREE, mat, ground, points, standard } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();

  const water = ground(
    mat({
      fhead: /* glsl */ `float H(vec2 p){ return fbm(p * .5 + vec2(uTime * .035, uTime * .028)) * .5 + fbm(p * 1.7 - uTime * .045) * .15
        + sin(length(p) * 5. - uTime * 1.05) * .03 * exp(-length(p) * .2); }`,
      fbody: /* glsl */ `
        vec2 q = vWorld.xz; float e = .09, h0 = H(q);
        vec3 Nw = normalize(vec3(h0 - H(q + vec2(e, 0.)), e * 2.6, h0 - H(q + vec2(0., e))));
        col = lit(vec3(.003, .007, .014), Nw, V, .035, .03);
        col += uSunColor * pow(max(dot(reflect(-V, Nw), uSunDir), 0.), 90.) * .5;
      `,
    }),
  );
  water.position.y = -0.075;
  group.add(water);

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.12, 0.075, 72), standard("#0b0d12", 0.55));
  plinth.position.y = -0.0375;
  group.add(plinth);


  group.add(points({ count: lowTier ? 60 : 140, box: [10, 4, 10], centre: [0, 1.6, 0], vel: [0.02, 0.012, 0.01], size: 2, sway: 0.25, twinkle: 0.5, color: "#c9d6ee", alpha: 0.4 }));

  return {
    group,
    sky: { top: "#02040a", horizon: "#16243f", ground: "#010204" },
    sun: { dir: [0.5, 0.085, -0.86], color: "#a9c4ff", intensity: 2.2, glow: 0.45 },
    key: { color: "#fff1de", intensity: 1.7 },
    rim: { color: "#86a8d5", intensity: 2.6 },
    fog: { color: "#121c31", density: 0.012 },
    amb: 0.5, reflect: 0.22, shadow: 0.55,
    cam: { az: [-0.5, -0.3, 0.12], el: [0.14, 0.085, 0.06], dolly: [1.5, 1, 1.2] },
  };
}
