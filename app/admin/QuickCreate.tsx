"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/buttons/Button";
import { Input } from "@/components/ds/forms/Input";
import { useToast } from "@/components/Toast";
import { createWalkin } from "./actions";

export function QuickCreate() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const res = await createWalkin(new FormData(e.currentTarget));
    setPending(false);
    if (res?.token) {
      toast("Klant aangemaakt");
      router.push(`/admin/klant/${res.token}`);
    } else {
      toast(res?.error ?? "Aanmaken mislukt", "error");
    }
  }

  if (!open) {
    return (
      <div>
        <Button type="button" variant="secondary" onDark onClick={() => setOpen(true)}>
          + Nieuwe klant
        </Button>
      </div>
    );
  }

  return (
    <div className="card stack-sm">
      <h2 className="title-on-light">Nieuwe klant aan de kassa</h2>
      <form onSubmit={submit} className="stack-sm">
        <Input label="Naam" name="name" required />
        <Input label="E-mail (optioneel)" name="email" type="email" />
        <div className="row">
          <Button type="submit" disabled={pending}>
            {pending ? "…" : "Aanmaken & openen"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Annuleren
          </Button>
        </div>
      </form>
      <p className="muted-light caption">
        De klant kan later zelf inloggen met dit e-mailadres; het gespaarde saldo blijft behouden.
      </p>
    </div>
  );
}
