"use client";

import { useEffect, useState } from "react";

// Renders the customer QR. Tap to enlarge full-screen, and keep the screen awake
// (Wake Lock) so it doesn't dim while staff are scanning it.
export function QrCard({ svg }: { svg: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    type WakeLockSentinel = { release: () => Promise<void> };
    let lock: WakeLockSentinel | null = null;
    let released = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
    };

    const request = async () => {
      try {
        if (nav.wakeLock) lock = await nav.wakeLock.request("screen");
      } catch {
        /* wake lock unavailable / denied — harmless */
      }
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible" && !released) request();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="qr qr-tap"
        aria-label="Vergroot QR-code"
        onClick={() => setOpen(true)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {open && (
        <div className="qr-overlay" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <span className="qr-hint">Tik om te sluiten</span>
        </div>
      )}
    </>
  );
}
