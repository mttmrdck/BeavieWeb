/* =====================================================================
   BEAVIE Parfums — the flacon
   ---------------------------------------------------------------------
   One material recipe for the JETHA bottle, shared by the collection
   and the fragrance worlds so every bottle looks shot for the same
   campaign. Values follow the Blender source (glass IOR 1.50, liquid
   IOR 1.34, satin black cap, semi-matte paper label) and are tuned for
   real-time: thick glass with a faint green-grey edge tint, a separate
   additive reflection layer so softbox highlights stay on top of the
   liquid, and an amber body that deepens with thickness.
   ===================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "./assets/vendor/three/GLTFLoader.js";
import { DRACOLoader } from "./assets/vendor/three/DRACOLoader.js";

let modelPromise = null;
export function loadBottleModel() {
  if (!modelPromise) {
    const draco = new DRACOLoader().setDecoderPath("assets/vendor/three/draco/");
    modelPromise = new GLTFLoader()
      .setDRACOLoader(draco)
      .loadAsync("assets/models/bottle.glb")
      .then((gltf) => {
        draco.dispose();
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const scale = 1 / (bounds.max.y - bounds.min.y);
        return {
          scene: gltf.scene,
          scale, // the bottle is made exactly 1 unit tall
          lift: -bounds.min.y * scale, // and stands on y = 0
          radius: ((bounds.max.x - bounds.min.x) / 2) * scale,
        };
      });
  }
  return modelPromise;
}

/* The shared materials. `extra` lets a caller patch glass (rain beads, frost). */
export function bottleMaterials({ glassPatch, shellPatch } = {}) {
  const P = (o) => new THREE.MeshPhysicalMaterial({ metalness: 0, ...o });
  const glass = P({
    color: "#ffffff", roughness: 0.035, transmission: 1, ior: 1.5, thickness: 0.09,
    attenuationColor: new THREE.Color("#dfeee8"), attenuationDistance: 0.6,
    specularIntensity: 1, envMapIntensity: 0.75, depthWrite: false,
  });
  const shell = P({ color: "#000000", roughness: 0.04, ior: 1.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: 0.85 });
  shell.defines = { SHELL: "" };
  glassPatch?.(glass, "glass");
  shellPatch?.(shell, "shell");
  return {
    glass,
    shell,
    liquid: P({ color: "#fff6dd", roughness: 0, transmission: 1, ior: 1.34, thickness: 0.06, attenuationColor: new THREE.Color("#f1cf80"), attenuationDistance: 0.9, envMapIntensity: 0.55 }),
    cap: P({ color: "#0b0b0d", roughness: 0.4, specularIntensity: 0.6, clearcoat: 0.35, clearcoatRoughness: 0.32, envMapIntensity: 1 }),
    sprayer: P({ color: "#101012", roughness: 0.24, envMapIntensity: 1 }),
    tube: P({ color: "#9ba4ae", roughness: 0.2, transmission: 0.6, thickness: 0.01, envMapIntensity: 0.8 }),
    paper: new THREE.MeshStandardMaterial({ color: "#dcd8cf", roughness: 0.72, side: THREE.DoubleSide }),
  };
}

export const labelMaterial = () =>
  new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.46, metalness: 0, specularIntensity: 0.55, side: THREE.DoubleSide });

/* Dress a clone of the model. Returns { root, label, glassMeshes }. */
export function dressBottle(model, mats, labelMat, { shadows = false, depthMat = null } = {}) {
  const root = model.scene.clone(true);
  root.scale.setScalar(model.scale);
  root.position.y = model.lift;
  const meshes = [];
  root.traverse((o) => o.isMesh && meshes.push(o));
  const artMeshes = [];
  meshes.forEach((o) => {
    const part = o.name.startsWith("Bottle_Label") || o.parent.name === "Bottle_Label" ? "label" : o.name;
    o.castShadow = shadows;
    if (part === "label") {
      const art = (o.material.name || "").startsWith("M_Label_Art");
      o.material = art ? labelMat : mats.paper;
      if (art) artMeshes.push(o);
    } else if (part === "Bottle_Glass") {
      o.material = mats.glass;
      o.renderOrder = 1;
      o.castShadow = false;
      const shell = new THREE.Mesh(o.geometry, mats.shell);
      shell.renderOrder = 3;
      o.add(shell);
      if (depthMat) {
        const depth = new THREE.Mesh(o.geometry, depthMat);
        depth.renderOrder = 3.5;
        o.add(depth);
      }
    } else if (part === "Perfume_Liquid") {
      o.material = mats.liquid;
      o.renderOrder = 2;
    } else if (part === "Cap_Main") o.material = mats.cap;
    else if (part === "Dip_Tube") o.material = mats.tube;
    else o.material = mats.sprayer;
  });
  return { root, artMeshes };
}

/* Label texture loader with the right colour space, UV flip and filtering. */
export function loadLabel(renderer, url, onLoad) {
  return new THREE.TextureLoader().load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    onLoad?.(tex);
  });
}

/* Watches real frame times and steps quality down (then back up) to hold the frame rate.
   onChange(level) receives 0 (best) … 3 (lightest). */
export function qualityGovernor({ start = 0, max = 3, onChange }) {
  let level = start, acc = 0, n = 0, cool = 0;
  return {
    get level() {
      return level;
    },
    sample(dt) {
      if (dt <= 0 || dt > 0.5) return; // tab switch or stall: ignore
      acc += dt;
      n++;
      if (cool > 0) cool -= dt;
      if (acc < 1.5) return;
      const fps = n / acc;
      acc = n = 0;
      if (cool > 0) return;
      if (fps < 48 && level < max) {
        level++;
        cool = 2;
        onChange(level, fps);
      } else if (fps > 58 && level > start) {
        level--;
        cool = 6;
        onChange(level, fps);
      }
    },
  };
}
