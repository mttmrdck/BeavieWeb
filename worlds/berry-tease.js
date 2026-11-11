/* Berry Tease: violet velvet. The bottle rests in folds of cloth, drapery closes the room, frosted grapes lie where they fell. */
import { THREE, mat, ground, drape, points, standard, rng } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rand = rng(12);

  group.add(
    ground(
      mat({
        fhead: /* glsl */ `float H(vec2 q){ float away = smoothstep(.9, 3.2, length(q));     // the cloth lies flat under the bottle
          return (sin(q.x * .9 + sin(q.y * .5) * 1.4 + fbm(q * .4) * 4.) * .5 + sin(q.y * 1.3 + q.x * .4) * .25) * .5 * away; }`,
        fbody: /* glsl */ `
          vec2 q = vWorld.xz; float e = .06, h0 = H(q);
          vec3 Nf = normalize(vec3(h0 - H(q + vec2(e, 0.)), e, h0 - H(q + vec2(0., e))));
          float nv = max(dot(Nf, V), 0.);
          col = lit(vec3(.12, .035, .2), Nf, V, .95, 0.) * (.35 + .65 * nv);
          col += vec3(.75, .6, .95) * uSunColor * pow(1. - nv, 2.5) * .1 * (.3 + max(dot(Nf, uSunDir), 0.));
        `,
      }),
      90,
    ),
  );

  const velvet = { color: "#4c1a80", sheen: "#d4b2f4" };
  [[0, -7.5, 0, 36, 1.4, 0], [-11, -1.5, 1.1, 22, 1.8, 3], [11, -1.5, -1.1, 22, 1.6, 7]].forEach(([x, z, ry, w, folds, seed]) => {
    const d = drape(w, 18, { ...velvet, folds, depth: 0.75, seed });
    d.position.set(x, 8.6, z);
    d.rotation.y = ry;
    group.add(d);
  });

  // Grape clusters, dusted with bloom.
  const skin = new THREE.MeshPhysicalMaterial({ color: "#2c1446", roughness: 0.5, sheen: 1, sheenColor: new THREE.Color("#b9a8d8"), sheenRoughness: 0.45, envMapIntensity: 0.9 });
  const grape = new THREE.SphereGeometry(0.115, 20, 14);
  const cluster = (x, y, z, rz, ry, rows) => {
    const g = new THREE.Group();
    const spots = [];
    for (let j = 0; j < rows; j++) {
      const r = 0.36 * (1 - j / (rows + 1.5)), count = Math.max(1, Math.round((2 * Math.PI * r) / 0.2));
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + j * 0.6;
        spots.push([Math.cos(a) * r + (rand() - 0.5) * 0.05, -j * 0.17, Math.sin(a) * r + (rand() - 0.5) * 0.05]);
      }
      if (r > 0.16) spots.push([(rand() - 0.5) * 0.1, -j * 0.17, (rand() - 0.5) * 0.1]);
    }
    const mesh = new THREE.InstancedMesh(grape, skin, spots.length);
    const m = new THREE.Matrix4();
    spots.forEach((p, i) => mesh.setMatrixAt(i, m.makeScale(0.85 + rand() * 0.3, 0.9 + rand() * 0.3, 0.85 + rand() * 0.3).setPosition(...p)));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6), standard("#3a2c18", 0.8));
    stem.position.y = 0.3;
    g.add(mesh, stem);
    g.position.set(x, y, z);
    g.rotation.set(0, ry, rz);
    group.add(g);
  };
  cluster(1.75, 0.34, -0.5, 1.25, 0.4, 7);
  cluster(-1.9, 0.3, -1.3, -1.2, 2.2, 6);
  if (!lowTier) cluster(3.2, 0.3, -2.4, 1.35, 1.2, 6);

  group.add(points({ count: lowTier ? 30 : 70, box: [8, 4, 8], centre: [0, 2, -1], vel: [0.01, 0.01, 0], size: 2.2, sway: 0.3, twinkle: 0.4, color: "#d8c8f4", alpha: 0.35 }));

  return {
    group,
    sky: { top: "#07030f", horizon: "#26133f", ground: "#040108" },
    sun: { dir: [-0.3, 0.75, 0.45], color: "#dcd8f2", intensity: 2 },
    key: { color: "#ece8fa", intensity: 1.4 },
    rim: { color: "#b27ad6", intensity: 2.8 },
    fog: { color: "#0f0720", density: 0.03 },
    amb: 0.6, shadow: 0.95,
    cam: { az: [-0.45, -0.15, 0.28], el: [0.22, 0.14, 0.1], dolly: [1.7, 1, 1.2] },
  };
}
