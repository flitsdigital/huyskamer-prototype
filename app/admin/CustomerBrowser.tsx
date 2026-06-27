"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ds/icons/Icon";
import { dateTime } from "@/lib/format";

type C = {
  id: string;
  display_name: string | null;
  email: string | null;
  qr_token: string;
  created_at: string;
  balance: number;
};

export function CustomerBrowser({ customers }: { customers: C[] }) {
  const [q, setQ] = useState("");
  const f = q.trim().toLowerCase();
  const list = f
    ? customers.filter(
        (c) =>
          (c.display_name ?? "").toLowerCase().includes(f) || (c.email ?? "").toLowerCase().includes(f)
      )
    : customers;

  return (
    <div className="stack-sm">
      <div className="search">
        <span className="search-ico">
          <Icon name="search" size={18} />
        </span>
        <input
          className="control"
          placeholder="Zoek op naam of e-mail…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Zoek klant"
        />
      </div>
      {list.length === 0 ? (
        <div className="card muted-light">Geen klanten gevonden.</div>
      ) : (
        <div className="cust-grid">
          {list.map((c) => (
            <Link href={`/admin/klant/${c.qr_token}`} key={c.id} className="card cust-card">
              <div className="row-between">
                <div>
                  <div className="body-light" style={{ fontWeight: 500 }}>
                    {c.display_name || c.email || "Onbekend"}
                  </div>
                  <div className="muted-light caption">{c.email}</div>
                </div>
                <div className="title-on-light" style={{ fontSize: "var(--fs-h4)" }}>
                  {c.balance}
                  <span className="muted-light caption"> pnt</span>
                </div>
              </div>
              <div className="muted-light caption" style={{ marginTop: "var(--sp-3)" }}>
                Klant sinds {dateTime(c.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
