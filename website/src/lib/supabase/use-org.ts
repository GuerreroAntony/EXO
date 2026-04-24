"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";

export interface OrgContext {
  orgId: string | null;
  orgName: string;
  userName: string;
  loading: boolean;
}

export function useOrg(): OrgContext {
  const [state, setState] = useState<OrgContext>({
    orgId: null,
    orgName: "",
    userName: "",
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, organization_id, organizations(name)")
        .eq("id", user.id)
        .single<{ full_name: string | null; organization_id: string | null; organizations: { name: string } | null }>();

      if (cancelled) return;
      setState({
        orgId: profile?.organization_id ?? null,
        orgName: profile?.organizations?.name ?? "",
        userName: profile?.full_name ?? user.email ?? "",
        loading: false,
      });
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}
