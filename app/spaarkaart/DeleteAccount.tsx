"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
import { useT } from "@/components/LocaleProvider";
import { deleteAccount } from "./actions";

export function DeleteAccount() {
  const t = useT();
  return (
    <ConfirmButton
      action={deleteAccount}
      variant="ghost"
      confirmVariant="primary"
      size="sm"
      title={t("card.deleteAccount")}
      message={t("card.deleteConfirm")}
      confirmLabel={t("card.deleteAccount")}
      cancelLabel={t("common.cancel")}
    >
      {t("card.deleteAccount")}
    </ConfirmButton>
  );
}
