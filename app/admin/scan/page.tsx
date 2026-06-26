"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/buttons/Button";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractToken(text: string): string | null {
  const m = text.match(UUID_RE);
  return m ? m[0] : null;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [manual, setManual] = useState("");

  useEffect(() => {
    let stream: MediaStream | undefined;
    let raf = 0;
    let stopped = false;

    // BarcodeDetector is available in Chrome/Android. iOS Safari users use the manual field
    // or the native camera app (the QR encodes a full URL).
    const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    if (!BD) {
      setSupported(false);
      return;
    }
    const detector = new BD({ formats: ["qr_code"] });

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        const v = videoRef.current!;
        v.srcObject = stream;
        await v.play();
        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(v);
            if (codes.length) {
              const token = extractToken(codes[0].rawValue);
              if (token) {
                stopped = true;
                router.push(`/admin/klant/${token}`);
                return;
              }
            }
          } catch {
            /* transient detect error, keep scanning */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setError("Geen toegang tot de camera. Sta cameratoegang toe of gebruik je camera-app.");
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [router]);

  function goManual(e: React.FormEvent) {
    e.preventDefault();
    const t = extractToken(manual);
    if (t) router.push(`/admin/klant/${t}`);
    else setError("Geen geldige klantcode gevonden.");
  }

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Scan klant-QR</h1>
      </div>

      <div className="card stack-sm">
        {supported ? (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              style={{ width: "100%", borderRadius: "var(--radius-md)", background: "#000", aspectRatio: "1 / 1", objectFit: "cover" }}
            />
            <p className="muted-light caption">Richt de camera op de QR-code van de klant.</p>
          </>
        ) : (
          <p className="muted-light">
            Scannen in de browser wordt op dit toestel niet ondersteund. Scan de QR met je gewone
            camera-app (die opent de klant vanzelf), of plak de code hieronder.
          </p>
        )}

        <form className="stack-sm" onSubmit={goManual}>
          <label className="field-label" htmlFor="manual">
            Code handmatig invoeren
          </label>
          <input
            id="manual"
            className="control"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Plak de klantcode of -link"
          />
          <Button type="submit" variant="secondary">
            Openen
          </Button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
