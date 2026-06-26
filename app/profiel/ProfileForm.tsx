"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ds/buttons/Button";
import { Input } from "@/components/ds/forms/Input";
import { useToast } from "@/components/Toast";
import { useT } from "@/components/LocaleProvider";
import { updateProfile, type ProfileResult } from "./actions";

export function ProfileForm({ displayName, birthdate }: { displayName: string; birthdate: string }) {
  const t = useT();
  const toast = useToast();
  const [state, action, pending] = useActionState(updateProfile, {} as ProfileResult);

  useEffect(() => {
    if (state.ok) toast(t("common.saved"));
    if (state.error) toast(state.error, "error");
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={action} className="stack-sm">
      <Input label={t("profile.displayName")} name="display_name" defaultValue={displayName} />
      <Input label={t("profile.birthdate")} name="birthdate" type="date" defaultValue={birthdate} />
      <Button type="submit" disabled={pending}>
        {pending ? "…" : t("common.save")}
      </Button>
    </form>
  );
}
