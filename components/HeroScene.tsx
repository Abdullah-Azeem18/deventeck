"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ServiceKey } from "@/lib/data";

// Three orbit rings around the core. Services share them, so there are fewer circles.
const rings: { radius: number; tilt: [number, number, number]; speed: number }[] = [
  { radius: 2.35, tilt: [0.35, 0, 0.18], speed: 0.3 },
  { radius: 2.5, tilt: [-0.55, 0.4, -0.12], speed: 0.24 },
  { radius: 2.65, tilt: [1.2, 0.2, -0.4], speed: 0.2 },
];

type Orbit = {
  key: ServiceKey;
  ring: number; // index into rings
  start: number; // starting angle on the ring (radians)
};

// Two services on a ring sit on opposite sides so they never bump into each other.
const orbits: Orbit[] = [
  { key: "ai", ring: 0, start: 0 },
  { key: "dev", ring: 0, start: Math.PI },
  { key: "cyber", ring: 1, start: 1.2 },
  { key: "ux", ring: 1, start: 1.2 + Math.PI },
  { key: "games", ring: 2, start: 2.4 },
];

// Same icons as the Services section, as SVG path data (24x24 grid).
const iconPaths: Record<ServiceKey, { stroke: string[]; dots?: [number, number][] }> = {
  ai: {
    stroke: [
      "M9 6h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z",
      "M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
      "M14 12a2 2 0 1 1-4 0a2 2 0 1 1 4 0Z",
    ],
  },
  cyber: { stroke: ["M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z", "m9 12 2 2 4-4"] },
  games: {
    stroke: ["M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7.2 2.4L14 14h-4l-.8 1.4A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4Z", "M7 11v3M5.5 12.5h3"],
    dots: [
      [16.5, 11.5],
      [18, 13.5],
    ],
  },
  dev: { stroke: ["m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"] },
  ux: { stroke: ["M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z", "M3 9h18M9 9v12"] },
};

const BADGE_PX = 256; // texture resolution
const BADGE_SIZE = 1.2; // size in the scene

// Draws a round badge with the service icon into a canvas.
function drawBadge(ctx: CanvasRenderingContext2D, key: ServiceKey, fill: string, ring: string, ink: string, glow: string) {
  const s = BADGE_PX;
  ctx.clearRect(0, 0, s, s);
  // soft glow
  const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.3, s / 2, s / 2, s / 2);
  g.addColorStop(0, glow);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  // disc
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s * 0.36, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = s * 0.022;
  ctx.strokeStyle = ring;
  ctx.stroke();
  // icon
  const icon = iconPaths[key];
  const scale = (s * 0.4) / 24;
  ctx.save();
  ctx.translate(s / 2 - 12 * scale, s / 2 - 12 * scale);
  ctx.scale(scale, scale);
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const d of icon.stroke) ctx.stroke(new Path2D(d));
  for (const [x, y] of icon.dots || []) {
    ctx.beginPath();
    ctx.arc(x, y, 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

type Satellite = {
  orbit: Orbit;
  mesh: THREE.Sprite;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  ring: number;
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

    // Orbit rings
    const ringPivots = rings.map((r) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(...r.tilt);
      world.add(pivot);
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 160; k++) {
        const a = (k / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r.radius, 0, Math.sin(a) * r.radius));
      }
      const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16 });
      pivot.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
      return { pivot, mat };
    });

    // Service badges on the rings
    const sats: Satellite[] = orbits.map((orbit) => {
      const c = document.createElement("canvas");
      c.width = c.height = BADGE_PX;
      const ctx = c.getContext("2d")!;
      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      const mesh = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
      mesh.scale.setScalar(BADGE_SIZE);
      ringPivots[orbit.ring].pivot.add(mesh);
      return { orbit, mesh, ctx, texture, ring: orbit.ring, angle: orbit.start, scale: 1 };
    });

    // Beams from the core to each satellite
    const beamPositions = new Float32Array(sats.length * 6);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPositions, 3));
    const beamMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 });
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
      // Keep every star well behind the core, so none drifts close to the camera and looks huge.
      starPos[s * 3 + 2] = -Math.abs(r * Math.cos(ph)) - 3;
    }
    // Round, soft-edged dots instead of square points.
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = dotCanvas.height = 32;
    const dctx = dotCanvas.getContext("2d")!;
    const dgrad = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dgrad.addColorStop(0, "rgba(255,255,255,1)");
    dgrad.addColorStop(0.5, "rgba(255,255,255,0.8)");
    dgrad.addColorStop(1, "rgba(255,255,255,0)");
    dctx.fillStyle = dgrad;
    dctx.fillRect(0, 0, 32, 32);
    const dotTexture = new THREE.CanvasTexture(dotCanvas);
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.07, map: dotTexture, transparent: true, opacity: 0.55, depthWrite: false, sizeAttenuation: true });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Theme colors
    const colAccent = new THREE.Color();
    const colGold = new THREE.Color();
    const colInk = new THREE.Color();
    // "#8A97FF" + 0.3 -> "rgba(138,151,255,0.3)"
    const hexA = (hex: string, a: number) => {
      const c = new THREE.Color(hex);
      return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
    };

    const paintActive = () => {
      const activeRing = sats.find((st) => st.orbit.key === activeRef.current)?.ring;
      ringPivots.forEach((r, i) => {
        r.mat.color.copy(i === activeRing ? colGold : colInk);
        r.mat.opacity = i === activeRing ? 0.6 : 0.16;
      });
      for (const st of sats) {
        const on = st.orbit.key === activeRef.current;
        drawBadge(
          st.ctx,
          st.orbit.key,
          cssVar("--surface"),
          on ? cssVar("--accent-2") : cssVar("--accent"),
          on ? cssVar("--accent-2") : cssVar("--ink"),
          on ? hexA(cssVar("--accent-2"), 0.45) : hexA(cssVar("--accent"), 0.3)
        );
        st.texture.needsUpdate = true;
        // The picked service stays visible even when it passes behind the core.
        st.mesh.material.depthTest = !on;
        st.mesh.renderOrder = on ? 10 : 0;
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
    const dir = new THREE.Vector3();
    const from = new THREE.Vector3();
    const to = new THREE.Vector3();
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
        const ring = rings[st.ring];
        st.angle += ring.speed * dt * motion; // same speed for both badges on a ring, so they stay apart
        st.mesh.position.set(Math.cos(st.angle) * ring.radius, 0, Math.sin(st.angle) * ring.radius);
        st.scale += ((on ? 1.35 : 1) - st.scale) * (motion ? 0.12 : 1);
        st.mesh.scale.setScalar(BADGE_SIZE * st.scale);
        st.mesh.getWorldPosition(tmp);
        world.worldToLocal(tmp);
        // Short wire: from the outer cage to the edge of the badge, not from the centre.
        const len = tmp.length();
        dir.copy(tmp).divideScalar(len || 1);
        from.copy(dir).multiplyScalar(2.1);
        to.copy(dir).multiplyScalar(Math.max(2.1, len - BADGE_SIZE * st.scale * 0.36));
        beamPositions.set([from.x, from.y, from.z, to.x, to.y, to.z], i * 6);
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
      // Keep everything (cage, orbits, badges) inside the frame.
      const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const fit = 3.3 / (half * Math.min(1, camera.aspect));
      // Camera sits a little low, so the model rides higher in the box, level with the heading.
      camera.position.set(0, -0.85, fit + 0.6);
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
      dotTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={boxRef} className={`scene-box${failed ? " failed" : ""}`}>
      <canvas
        ref={canvasRef}
        className="scene-canvas"
        role="img"
        aria-label="Interactive 3D model of Deventeck's core with its five services in orbit"
      />
      <div className="scene-fallback" aria-hidden="true" />
    </div>
  );
}