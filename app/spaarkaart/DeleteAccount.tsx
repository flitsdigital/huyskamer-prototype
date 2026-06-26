"use client";

import { Button } from "@/components/ds/buttons/Button";
import { deleteAccount } from "./actions";

export function DeleteAccount() {
  return (
    <form
      action={deleteAccount}
      onSubmit={(e) => {
        if (!confirm("Weet je zeker dat je je account en al je punten wilt verwijderen?")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="ghost" size="sm">
        Account verwijderen
      </Button>
    </form>
  );
}
