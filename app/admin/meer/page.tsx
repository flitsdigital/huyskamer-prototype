import Link from "next/link";
import { signOut } from "@/app/spaarkaart/actions";
import { Button } from "@/components/ds/buttons/Button";
import { Icon } from "@/components/ds/icons/Icon";

export const dynamic = "force-dynamic";

export default function MeerPage() {
  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Meer</h1>
      </div>

      <div className="card">
        <Link href="/admin/instellingen" className="list-row">
          <span className="body-light" style={{ fontWeight: 500 }}>
            Instellingen
          </span>
          <Icon name="chevron-right" />
        </Link>
        <Link href="/privacy" className="list-row">
          <span className="body-light" style={{ fontWeight: 500 }}>
            Privacyverklaring
          </span>
          <Icon name="chevron-right" />
        </Link>
      </div>

      <form action={signOut}>
        <Button type="submit" variant="secondary" fullWidth onDark>
          Uitloggen
        </Button>
      </form>
    </div>
  );
}
