"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = ["#A30F0F", "#C11414", "#E1D2C4", "#EADDD1", "#caa472"];

function burst() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:140";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const parts = Array.from({ length: 90 }, (_, i) => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (((i * 73) % 100) / 100 - 0.5) * 12,
    vy: -Math.random() * 9 - 3,
    r: 3 + Math.random() * 4,
    c: COLORS[i % COLORS.length],
    a: 1,
  }));
  const start = performance.now();
  function frame(now: number) {
    const dt = (now - start) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of parts) {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.a = Math.max(0, 1 - dt / 1.4);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (dt < 1.4) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}

// Animated saldo number; confetti when the balance rose since the last visit.
export function BalanceCelebrate({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const key = "dh-last-balance";
    const prev = Number(localStorage.getItem(key) ?? "NaN");
    localStorage.setItem(key, String(value));

    if (reduce.current) {
      setN(value);
      return;
    }
    if (Number.isFinite(prev) && value > prev) burst();

    const dur = 700;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="points points-pop">{n}</span>;
}
