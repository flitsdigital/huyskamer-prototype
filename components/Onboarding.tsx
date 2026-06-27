"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ds/buttons/Button";

export function Onboarding({
  steps,
  storageKey,
}: {
  steps: { title: string; body: string }[];
  storageKey: string;
}) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) setShow(true);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  if (!show || steps.length === 0) return null;
  const step = steps[i];
  const last = i === steps.length - 1;
  function done() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal stack-sm">
        <h3 className="title-on-light">{step.title}</h3>
        <p className="muted-light">{step.body}</p>
        <div className="row-between" style={{ marginTop: "var(--sp-2)" }}>
          <div className="row" style={{ gap: 6 }}>
            {steps.map((_, idx) => (
              <span key={idx} className={`onb-dot ${idx === i ? "active" : ""}`} />
            ))}
          </div>
          <div className="row">
            <Button type="button" variant="ghost" size="sm" onClick={done}>
              Overslaan
            </Button>
            <Button type="button" size="sm" onClick={() => (last ? done() : setI(i + 1))}>
              {last ? "Klaar" : "Volgende"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
