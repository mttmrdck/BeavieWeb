/* Seductress: obsidian and velvet. A black stone floor veined with silver, crimson drapery, black cherries. Nothing moves but the cloth. */
import { THREE, mat, ground, drape, standard, rng } from "./kit.js";

export default function create() {
  const group = new THREE.Group();
  const rand = rng(4);

  group.add(
    ground(
      mat({
        fbody: /* glsl */ `
          vec2 q = vWorld.xz;
          float w = fbm(q * .2 + fbm(q * .45) * .8);
          float vein = pow(1. - abs(w * 2. - 1.), 80.) + pow(1. - abs(fbm(q * .7 + 3.) * 2. - 1.), 120.) * .5;
          vein = clamp(vein, 0., 1.);
          col = lit(mix(vec3(.004, .003, .005), vec3(.7, .73, .8), vein * .8), vec3(0., 1., 0.), V, mix(.03, .14, vein), mix(.05, .5, vein));
        `,
      }),
      90,
    ),
  );

  const velvet = { color: "#8a1230", sheen: "#ff6a86" };
  const backDrape = drape(40, 18, { ...velvet, folds: 1.5, depth: 0.7 });
  backDrape.position.set(0, 8.6, -8);
  const left = drape(22, 18, { ...velvet, folds: 1.9, depth: 0.6, seed: 2 });
  left.position.set(-12, 8.6, -2);
  left.rotation.y = 1.05;
  const rightDrape = drape(22, 18, { ...velvet, folds: 1.7, depth: 0.6, seed: 5 });
  rightDrape.position.set(12, 8.6, -2);
  rightDrape.rotation.y = -1.05;
  group.add(backDrape, left, rightDrape);

  // Black cherries, in pairs on their stems.
  const skin = new THREE.MeshPhysicalMaterial({ color: "#2b0209", roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4 });
  const stemMat = standard("#3d2c12", 0.7);
  const cherry = new THREE.SphereGeometry(0.135, 28, 20);
  const stem = new THREE.CylinderGeometry(0.008, 0.008, 0.42, 6);
  stem.translate(0, 0.21, 0);
  [[1.3, -0.6], [1.9, -1.5], [-1.5, -1.1], [-2.3, -2.4], [3.0, -2.6], [-0.9, -2.0]].forEach(([x, z]) => {
    for (const side of [-1, 1]) {
      const fruit = new THREE.Mesh(cherry, skin);
      fruit.position.set(x + side * 0.13, 0.135, z + (rand() - 0.5) * 0.12);
      const s = new THREE.Mesh(stem, stemMat);
      s.position.copy(fruit.position).setY(0.25);
      s.rotation.z = -side * 0.42;
      s.rotation.x = (rand() - 0.5) * 0.3;
      group.add(fruit, s);
    }
  });

  return {
    group,
    sky: { top: "#090205", horizon: "#2a0a12", ground: "#030001" },
    sun: { dir: [-0.45, 0.6, 0.65], color: "#f0e6ea", intensity: 3 },
    key: { color: "#f3ecf0", intensity: 1.3 },
    rim: { color: "#d44a68", intensity: 3.2 },
    fog: { color: "#0a0205", density: 0.028 },
    amb: 1.1, reflect: 0.45, shadow: 0.5,
    cam: { az: [-0.45, -0.12, 0.3], el: [0.15, 0.09, 0.065], dolly: [1.7, 1, 1.2] },
  };
}
