"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Live-refreshes the page when point_transactions change (Supabase Realtime).
// Requires the table to be in the supabase_realtime publication (see migration 0002).
export function RealtimeRefresh({ customerId }: { customerId: string }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("point-transactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "point_transactions",
          filter: `customer_id=eq.${customerId}`,
        },
        () => router.refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, customerId]);
  return null;
}
