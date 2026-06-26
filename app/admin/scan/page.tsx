"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { Button } from "@/components/ds/buttons/Button";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractToken(text: string): string | null {
  const m = text.match(UUID_RE);
  return m ? m[0] : null;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef(0);
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // jsQR decodes camera frames on a canvas — works on iOS Safari and Android (needs HTTPS).
  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current!;
      v.srcObject = stream;
      await v.play();
      setScanning(true);

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const tick = () => {
        const video = videoRef.current;
        if (!video || !streamRef.current) return;
        if (video.readyState >= 2 && video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
          if (code) {
            const token = extractToken(code.data);
            if (token) {
              stop();
              router.push(`/admin/klant/${token}`);
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setScanning(false);
      setError(
        "Geen toegang tot de camera. Sta cameratoegang toe in je browser, of gebruik je camera-app / het codeveld hieronder."
      );
    }
  }, [router, stop]);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  function goManual(e: React.FormEvent) {
    e.preventDefault();
    const t = extractToken(manual);
    if (t) {
      stop();
      router.push(`/admin/klant/${t}`);
    } else {
      setError("Geen geldige klantcode gevonden.");
    }
  }

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Scan klant-QR</h1>
      </div>

      <div className="card stack-sm">
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%",
            borderRadius: "var(--radius-md)",
            background: "#000",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            display: scanning ? "block" : "none",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {scanning ? (
          <p className="muted-light caption">Richt de camera op de QR-code van de klant.</p>
        ) : (
          <>
            <p className="muted-light">
              {error ?? "Start de camera om de QR-code van de klant te scannen."}
            </p>
            <Button type="button" onClick={start}>
              Camera starten
            </Button>
          </>
        )}
      </div>

      <div className="card stack-sm">
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
        <p className="muted-light caption">
          Tip: je kunt de QR ook met je gewone camera-app scannen — die opent de klant vanzelf.
        </p>
      </div>
    </div>
  );
}
