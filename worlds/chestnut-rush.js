/* Chestnut Rush: the lounge. A mahogany table under lamplight, a wall of leather spines, cigar smoke climbing. */
import { THREE, mat, ground, points, smoke, standard, rng } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rand = rng(9);

  group.add(
    ground(
      mat({
        fbody: /* glsl */ `
          vec2 q = vWorld.xz;
          float plank = floor(q.x / 3.4);
          vec2 g = vec2(q.x, q.y + plank * 7.3);
          float grain = fbm(vec2(g.x * 9., g.y * .45));
          float rings = sin((g.x * 5. + fbm(g * vec2(1., .1)) * 7.) * 3.) * .5 + .5;
          vec3 a = mix(vec3(.07, .022, .009), vec3(.2, .07, .026), rings * .35 + grain * .65);
          a *= 1. - smoothstep(.47, .5, abs(fract(q.x / 3.4) - .5)) * .6;
          col = lit(a, normalize(vec3((grain - .5) * .025, 1., 0.)), V, .3, .04);
        `,
      }),
      80,
    ),
  );

  // The library wall.
  const spines = ["#3b1410", "#4a2413", "#1f2a1c", "#2a1a2e", "#5a3018", "#141a2a", "#3a2a14", "#501a14"];
  const shelfWood = standard("#170a05", 0.6);
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard("#ffffff", 0.55), 420);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), color = new THREE.Color();
  let n = 0;
  for (let row = 0; row < 5; row++) {
    const y0 = -3.2 + row * 2.9;
    const board = new THREE.Mesh(new THREE.BoxGeometry(44, 0.18, 1.9), shelfWood);
    board.position.set(0, y0 - 0.09, -8.2);
    group.add(board);
    for (let x = -21; x < 21 && n < 420; ) {
      const w = 0.22 + rand() * 0.3, h = 1.7 + rand() * 0.8, lean = rand() < 0.08 ? 0.22 : 0;
      e.set(0, 0, lean);
      books.setMatrixAt(n, m.compose(new THREE.Vector3(x + w / 2, y0 + h / 2, -8.2 + rand() * 0.25), q.setFromEuler(e), new THREE.Vector3(w, h, 1.4)));
      books.setColorAt(n++, color.set(spines[Math.floor(rand() * spines.length)]).multiplyScalar(0.7 + rand() * 0.6));
      x += w + (rand() < 0.06 ? 0.7 : 0.015);
    }
  }
  books.count = n;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(46, 18), standard("#0c0503", 0.9));
  back.position.set(0, 5, -9.2);
  group.add(books, back);

  // A few volumes left on the table.
  [["#3b1410", 1.7, 0.3, 1.2, 0.2], ["#1f2a1c", 1.5, 0.24, 1.05, -0.25], ["#5a3018", 1.3, 0.2, 0.95, 0.5]].reduce((y, [c, w, h, d, r]) => {
    const book = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), standard(c, 0.5));
    book.position.set(1.95, y + h / 2, -1.25);
    book.rotation.y = r;
    group.add(book);
    return y + h;
  }, 0);

  const lamp = new THREE.PointLight("#ffab5e", 120, 30, 2);
  lamp.position.set(-2.6, 2.8, -1.4);
  group.add(lamp);

  group.add(smoke([2.6, 0.6, -2.8], { height: 8, width: 2.2, strength: 0.42, seed: 1 }), smoke([-3.4, 0, -4], { height: 9, width: 2.6, strength: 0.3, seed: 6 }));
  group.add(points({ count: lowTier ? 50 : 110, box: [9, 4, 8], centre: [0, 1.8, -1], vel: [0.02, 0.05, 0], size: 2, sway: 0.3, twinkle: 0.8, color: "#ffb070", alpha: 0.55 }));

  return {
    group,
    sky: { top: "#120804", horizon: "#3a1d0d", ground: "#0a0402" },
    sun: { dir: [-0.5, 0.62, 0.6], color: "#ffb672", intensity: 3.6 },
    key: { color: "#ffd9ad", intensity: 1.2 },
    rim: { color: "#d18a52", intensity: 2.4 },
    fog: { color: "#1a0c06", density: 0.028 },
    amb: 1.4, reflect: 0.14, shadow: 0.85,
    cam: { az: [0.5, 0.14, -0.3], el: [0.2, 0.12, 0.09], dolly: [1.7, 1, 1.2] },
    update(time) {
      lamp.intensity = 120 * (0.88 + 0.08 * Math.sin(time * 7.3) + 0.06 * Math.sin(time * 13.1 + 1));   // a flame, not a bulb
    },
  };
}
