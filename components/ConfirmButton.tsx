"use client";

import { useState } from "react";
import { Button } from "@/components/ds/buttons/Button";

type Variant = "primary" | "secondary" | "ghost";

export function ConfirmButton({
  action,
  children,
  title,
  message,
  confirmLabel = "Bevestigen",
  cancelLabel = "Annuleren",
  variant = "primary",
  confirmVariant = "primary",
  size,
  hidden,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  confirmVariant?: Variant;
  size?: "sm" | "md";
  hidden?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant={variant} size={size} onClick={() => setOpen(true)}>
        {children}
      </Button>
      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="modal stack-sm" onClick={(e) => e.stopPropagation()}>
            {title && <h3 className="title-on-light">{title}</h3>}
            {message && <p className="muted-light">{message}</p>}
            <div className="row" style={{ justifyContent: "flex-end", marginTop: "var(--sp-2)" }}>
              <Button type="button" variant="ghost" size={size} onClick={() => setOpen(false)}>
                {cancelLabel}
              </Button>
              <form action={action}>
                {hidden}
                <Button type="submit" variant={confirmVariant} size={size}>
                  {confirmLabel}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
