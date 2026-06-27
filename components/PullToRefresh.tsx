"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Lightweight pull-to-refresh for the customer card on mobile.
export function PullToRefresh() {
  const router = useRouter();
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const [pull, setPull] = useState(0);

  useEffect(() => {
    function onStart(e: TouchEvent) {
      startY.current = window.scrollY <= 0 ? e.touches[0].clientY : null;
    }
    function onMove(e: TouchEvent) {
      if (startY.current == null) return;
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) {
        const v = Math.min(80, d * 0.5);
        pullRef.current = v;
        setPull(v);
      }
    }
    function onEnd() {
      if (pullRef.current > 55) router.refresh();
      pullRef.current = 0;
      setPull(0);
      startY.current = null;
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [router]);

  return (
    <div
      aria-hidden="true"
      style={{
        height: pull,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-on-dark-muted)",
        fontSize: "var(--fs-caption)",
        transition: startY.current == null ? "height 120ms ease" : undefined,
      }}
    >
      {pull > 10 ? "Loslaten om te verversen…" : ""}
    </div>
  );
}
