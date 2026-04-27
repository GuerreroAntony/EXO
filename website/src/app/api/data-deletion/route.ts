import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DeletionRequestBody {
  requester_phone?: string | null;
  requester_email?: string | null;
  requester_name?: string | null;
  reason?: string | null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as DeletionRequestBody | null;
  if (!body) return new Response("Bad request", { status: 400 });

  const phone = body.requester_phone?.trim() || null;
  const email = body.requester_email?.trim() || null;
  const name = body.requester_name?.trim() || null;
  const reason = body.reason?.trim() || null;

  if (!phone && !email) {
    return new Response("Informe WhatsApp ou e-mail.", { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response("E-mail inválido.", { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("data_deletion_requests").insert({
    requester_phone: phone,
    requester_email: email,
    requester_name: name,
    reason,
    source: "web_form",
    status: "pending",
  });

  if (error) {
    console.error("[data-deletion] insert failed", error.message);
    return new Response("Falha ao registrar pedido. Tente novamente ou escreva pra privacidade@exo.tec.br.", {
      status: 500,
    });
  }

  console.log("[data-deletion] new request", {
    phone: phone ? `***${phone.slice(-4)}` : null,
    email: email ? `***${email.slice(-10)}` : null,
  });

  return Response.json({ ok: true });
}
