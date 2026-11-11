/* Lily in the Valley: a white garden at morning. Arcades over a still pool, silver spheres, petals on the air, sun through mist. */
import { THREE, mat, ground, points, shaft, standard, rng } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();
  const rand = rng(17);

  const pool = ground(
    mat({
      fhead: "float H(vec2 p){ return fbm(p * .7 + vec2(uTime * .03, uTime * .02)) * .4 + fbm(p * 2.2 - uTime * .04) * .1; }",
      fbody: /* glsl */ `
        vec2 q = vWorld.xz; float e = .1, h0 = H(q);
        vec3 Nw = normalize(vec3(h0 - H(q + vec2(e, 0.)), e * 3.5, h0 - H(q + vec2(0., e))));
        col = lit(vec3(.3, .27, .21), Nw, V, .04, .04);
      `,
    }),
  );
  pool.position.y = -0.09;
  group.add(pool);

  const plaster = standard("#d9cdb6", 0.9);
  const disc = (x, z, r) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.02, 0.1, 64), plaster);
    m.position.set(x, -0.05, z);
    group.add(m);
  };
  disc(0, 0, 1.25);
  disc(-2.5, -3.1, 0.9);
  disc(1.4, -6.2, 0.9);
  disc(-1.2, -9.4, 0.9);

  // Arcades.
  const pier = new THREE.BoxGeometry(1, 9, 1), arc = new THREE.TorusGeometry(2.2, 0.5, 10, 28, Math.PI), wall = new THREE.BoxGeometry(5.4, 5, 1);
  const arcade = (z, count, shift) => {
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * 5.4 + shift;
      const a = new THREE.Mesh(pier, plaster);
      a.position.set(x - 2.7, 4.4, z);
      const top = new THREE.Mesh(arc, plaster);
      top.position.set(x, 8.9, z);
      top.scale.z = 2;
      const over = new THREE.Mesh(wall, plaster);
      over.position.set(x, 13.9, z);
      group.add(a, top, over);
    }
  };
  arcade(-11, 9, 0);
  if (!lowTier) arcade(-27, 13, 2.7);

  const silver = new THREE.MeshStandardMaterial({ color: "#eceef0", metalness: 1, roughness: 0.05, envMapIntensity: 1.3 });
  [[-2.3, -1.9, 0.5], [-3.4, -0.9, 0.2], [4.6, -6.0, 0.85], [-1.4, -4.2, 0.28], [-6.2, -6.4, 0.42], [1.6, -2.6, 0.2]].forEach(([x, z, r]) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), silver);
    sphere.position.set(x, r - 0.09, z);
    group.add(sphere);
  });

  // Petals carried on a light wind.
  const count = lowTier ? 36 : 80;
  const petalGeo = new THREE.PlaneGeometry(0.26, 0.36, 2, 3);
  {
    const pos = petalGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, (pos.getX(i) ** 2 + pos.getY(i) ** 2) * 1.6);
    petalGeo.computeVertexNormals();
  }
  const petals = new THREE.InstancedMesh(
    petalGeo,
    mat({
      side: THREE.DoubleSide,
      vhead: "attribute vec4 aSeed;",
      vbody: /* glsl */ `
        float ph = uTime * (.25 + aSeed.w * .3) + aSeed.x * 30.;
        mat2 ra = mat2(cos(ph * 2.), -sin(ph * 2.), sin(ph * 2.), cos(ph * 2.));
        float pb = ph * 1.3 + aSeed.y * 6.; mat2 rb = mat2(cos(pb), -sin(pb), sin(pb), cos(pb));
        p.yz = ra * p.yz; n.yz = ra * n.yz; p.xz = rb * p.xz; n.xz = rb * n.xz;
        p += vec3(mod(aSeed.x * 18. + sin(ph) * .6 + uTime * .3, 18.) - 9., 6.5 - mod(uTime * (.3 + aSeed.w * .25) + aSeed.y * 6.5, 6.5), aSeed.z * 13. - 10.);
      `,
      fbody: "col = lit(vec3(.96, .92, .88), N, V, .7, .03) + vec3(.9, .8, .7) * uSunColor * pow(max(dot(-N, uSunDir), 0.), 1.5) * .1;",
    }),
    count,
  );
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < seeds.length; i++) seeds[i] = rand();
  petalGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 4));
  const identity = new THREE.Matrix4();
  for (let i = 0; i < count; i++) petals.setMatrixAt(i, identity);
  petals.frustumCulled = false;
  group.add(petals);

  group.add(shaft([-9, 16, -9], [-2, 0, -3], 3, "#fff1d0", 0.16), shaft([-4, 16, -12], [3.5, 0, -6], 2.6, "#fff1d0", 0.12));
  group.add(points({ count: lowTier ? 80 : 200, box: [12, 5, 12], centre: [0, 2.4, -2], vel: [0.03, 0.03, 0], size: 2, sway: 0.4, twinkle: 0.7, color: "#fff4d8", alpha: 0.5 }));

  return {
    group,
    sky: { top: "#9fb3c2", horizon: "#f6ead2", ground: "#a89878" },
    sun: { dir: [-0.5, 0.55, -0.35], color: "#fff0d2", intensity: 3.1, glow: 1.2 },
    key: { color: "#fff6e6", intensity: 0.9 },
    rim: { color: "#fff1d6", intensity: 1.2 },
    fog: { color: "#eadfc9", density: 0.011 },
    amb: 1.2, reflect: 0.18, shadow: 0.6, studio: 0.6, cursor: 0.4,
    cam: { az: [0.45, 0.12, -0.3], el: [0.17, 0.1, 0.07], dolly: [1.8, 1, 1.2] },
  };
}
