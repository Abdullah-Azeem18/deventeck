"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ServiceKey } from "@/lib/data";

type Orbit = {
  key: ServiceKey;
  geometry: () => THREE.BufferGeometry;
  radius: number;
  tilt: [number, number, number];
  speed: number;
};

const orbits: Orbit[] = [
  { key: "ai", geometry: () => new THREE.OctahedronGeometry(0.36), radius: 3.0, tilt: [0.35, 0, 0.18], speed: 0.34 },
  { key: "cyber", geometry: () => new THREE.BoxGeometry(0.46, 0.46, 0.46), radius: 3.55, tilt: [-0.55, 0.4, -0.12], speed: 0.26 },
  { key: "games", geometry: () => new THREE.TorusGeometry(0.26, 0.1, 12, 32), radius: 4.1, tilt: [0.9, -0.3, 0.3], speed: 0.21 },
  { key: "dev", geometry: () => new THREE.TetrahedronGeometry(0.42), radius: 3.3, tilt: [-0.2, 1.1, 0.5], speed: 0.3 },
  { key: "ux", geometry: () => new THREE.DodecahedronGeometry(0.34), radius: 3.85, tilt: [1.25, 0.2, -0.4], speed: 0.24 },
];

type Satellite = {
  orbit: Orbit;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  ringMat: THREE.LineBasicMaterial;
  angle: number;
  scale: number;
};

export default function HeroScene({ active }: { active: ServiceKey | null }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<ServiceKey | null>(active);
  const refreshRef = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    refreshRef.current();
  }, [active]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = reduceMotion ? 0 : 1;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 12);

    const world = new THREE.Group();
    scene.add(world);

    const cssVar = (name: string) => getComputedStyle(root).getPropertyValue(name).trim() || "#8A97FF";

    // Core
    const coreMat = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.28, flatShading: true });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.45, 1), coreMat);
    world.add(core);

    const innerMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 });
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 2), innerMat);
    world.add(inner);

    const shellMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32 });
    const shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.05, 1)), shellMat);
    world.add(shell);

    // Lights (decay 0 keeps the classic falloff-free look)
    scene.add(new THREE.AmbientLight(0xffffff, 0.45 * Math.PI));
    const key = new THREE.PointLight(0xffffff, 1.5 * Math.PI, 50, 0);
    key.position.set(6, 5, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 1.2 * Math.PI, 50, 0);
    rim.position.set(-7, -3, 3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5 * Math.PI);
    fill.position.set(0, 6, 10);
    scene.add(fill);

    // Satellites, one per service
    const sats: Satellite[] = orbits.map((orbit, i) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(...orbit.tilt);
      world.add(pivot);
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 160; k++) {
        const a = (k / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * orbit.radius, 0, Math.sin(a) * orbit.radius));
      }
      const ringMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16 });
      pivot.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
      const mat = new THREE.MeshStandardMaterial({ metalness: 0.4, roughness: 0.3, flatShading: true });
      const mesh = new THREE.Mesh(orbit.geometry(), mat);
      pivot.add(mesh);
      return { orbit, mesh, ringMat, angle: (i / orbits.length) * Math.PI * 2, scale: 1 };
    });

    // Beams from the core to each satellite
    const beamPositions = new Float32Array(sats.length * 6);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPositions, 3));
    const beamMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22 });
    world.add(new THREE.LineSegments(beamGeo, beamMat));

    // Star field
    const starCount = 900;
    const starPos = new Float32Array(starCount * 3);
    for (let s = 0; s < starCount; s++) {
      const r = 7 + Math.random() * 12;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[s * 3] = r * Math.sin(ph) * Math.cos(th);
      starPos[s * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPos[s * 3 + 2] = r * Math.cos(ph) - 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.05, transparent: true, opacity: 0.55, sizeAttenuation: true });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Theme colors
    const colAccent = new THREE.Color();
    const colGold = new THREE.Color();
    const colInk = new THREE.Color();
    const black = new THREE.Color(0x000000);

    const paintActive = () => {
      for (const st of sats) {
        const on = st.orbit.key === activeRef.current;
        st.ringMat.color.copy(on ? colGold : colInk);
        st.ringMat.opacity = on ? 0.75 : 0.16;
        st.mesh.material.color.copy(on ? colGold : colInk.clone().lerp(colAccent, 0.35));
        st.mesh.material.emissive.copy(on ? colGold : black).multiplyScalar(on ? 0.35 : 0);
      }
    };

    const applyTheme = () => {
      colAccent.set(cssVar("--accent"));
      colGold.set(cssVar("--accent-2"));
      colInk.set(cssVar("--ink"));
      coreMat.color.copy(colAccent);
      coreMat.emissive.copy(colAccent).multiplyScalar(0.18);
      innerMat.color.copy(colGold);
      shellMat.color.copy(colInk);
      beamMat.color.copy(colAccent);
      starMat.color.copy(colInk);
      key.color.copy(colAccent).lerp(new THREE.Color(0xffffff), 0.6);
      rim.color.copy(colGold);
      paintActive();
    };

    // Pointer: parallax and drag to rotate
    let targetX = 0;
    let targetY = 0;
    let dragY = 0;
    let dragging = false;
    let lastX = 0;
    let velocity = 0;

    const onWindowMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      targetY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      targetX = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      dragY += dx * 0.008;
      velocity = dx * 0.008;
    };
    const onUp = () => {
      dragging = false;
    };
    window.addEventListener("pointermove", onWindowMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // Animation
    const tmp = new THREE.Vector3();
    const clock = new THREE.Clock();
    let visible = true;
    let running = false;
    let frame = 0;

    const step = (dt: number) => {
      const t = clock.elapsedTime;
      core.rotation.y += dt * 0.18 * motion;
      core.rotation.x += dt * 0.07 * motion;
      shell.rotation.y -= dt * 0.08 * motion;
      shell.rotation.z += dt * 0.03 * motion;
      inner.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06 * motion);
      stars.rotation.y += dt * 0.01 * motion;

      if (!dragging) {
        dragY += velocity;
        velocity *= 0.92;
      }
      world.rotation.x += (targetX - world.rotation.x) * 0.05;
      world.rotation.y += (targetY + dragY - world.rotation.y) * 0.08;

      sats.forEach((st, i) => {
        const on = st.orbit.key === activeRef.current;
        st.angle += st.orbit.speed * dt * motion * (on ? 0.35 : 1);
        st.mesh.position.set(Math.cos(st.angle) * st.orbit.radius, 0, Math.sin(st.angle) * st.orbit.radius);
        st.mesh.rotation.x += dt * 0.9 * motion;
        st.mesh.rotation.y += dt * 0.6 * motion;
        st.scale += ((on ? 1.9 : 1) - st.scale) * (motion ? 0.12 : 1);
        st.mesh.scale.setScalar(st.scale);
        st.mesh.getWorldPosition(tmp);
        world.worldToLocal(tmp);
        beamPositions.set([0, 0, 0, tmp.x, tmp.y, tmp.z], i * 6);
      });
      beamGeo.attributes.position.needsUpdate = true;
    };

    const renderOnce = () => {
      step(0);
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      running = true;
      step(Math.min(clock.getDelta(), 0.05));
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        clock.getDelta();
        frame = requestAnimationFrame(loop);
      }
    };

    refreshRef.current = () => {
      paintActive();
      if (reduceMotion) renderOnce();
    };

    const resize = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderOnce();
    };

    applyTheme();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      applyTheme();
      renderOnce();
    };
    media.addEventListener("change", onScheme);
    const themeObserver = new MutationObserver(onScheme);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(box);

    const visObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start();
      },
      { threshold: 0.01 }
    );
    visObserver.observe(box);

    const onVisibility = () => {
      if (!document.hidden && visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      running = false;
      visible = false;
      refreshRef.current = () => {};
      window.removeEventListener("pointermove", onWindowMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onScheme);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      visObserver.disconnect();
      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        if (o.geometry) o.geometry.dispose();
        const m = o.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={boxRef} className={`scene-box${failed ? " failed" : ""}`}>
      <canvas
        ref={canvasRef}
        className="scene-canvas"
        role="img"
        aria-label="Interactive 3D model of Deventeck's core with five orbiting services"
      />
      <div className="scene-fallback" aria-hidden="true" />
    </div>
  );
}
