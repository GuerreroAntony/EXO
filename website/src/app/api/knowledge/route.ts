import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearPromptCache } from "@/lib/agents/prompt-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TEXT_CHARS = 200_000;

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("knowledge_sources")
    .select("id, title, source_type, file_size_bytes, agent_id, criado_em, extracted_text")
    .order("criado_em", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const enriched = (data ?? []).map((row: { id: string; title: string; source_type: string; file_size_bytes: number | null; agent_id: string | null; criado_em: string; extracted_text: string | null }) => ({
    id: row.id,
    title: row.title,
    source_type: row.source_type,
    file_size_bytes: row.file_size_bytes,
    agent_id: row.agent_id,
    criado_em: row.criado_em,
    char_count: row.extracted_text?.length ?? 0,
    preview: row.extracted_text?.slice(0, 200) ?? "",
  }));

  return Response.json({ items: enriched });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle<{ organization_id: string | null }>();

  if (!profile?.organization_id) return new Response("No organization", { status: 403 });

  const contentType = request.headers.get("content-type") ?? "";

  let title: string;
  let extractedText: string;
  let sourceType: "text" | "file";
  let fileSizeBytes: number | null = null;
  let agentId: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    title = ((form.get("title") as string | null) ?? "").trim();
    const agentIdRaw = (form.get("agent_id") as string | null) ?? "";
    agentId = agentIdRaw && agentIdRaw !== "all" ? agentIdRaw : null;

    if (!file) return new Response("Missing file", { status: 400 });
    if (!title) title = file.name.replace(/\.[^.]+$/, "");

    sourceType = "file";
    fileSizeBytes = file.size;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      try {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        extractedText = result.text.trim();
        await parser.destroy();
      } catch (err) {
        console.error("[knowledge] pdf parse failed", err);
        return new Response("Failed to parse PDF", { status: 400 });
      }
    } else if (file.type.startsWith("text/") || /\.(txt|md|csv)$/i.test(file.name)) {
      extractedText = buffer.toString("utf-8").trim();
    } else {
      return new Response("Unsupported file type. Use PDF, TXT, MD or CSV.", { status: 400 });
    }
  } else {
    const body = await request.json().catch(() => null) as {
      title?: string;
      content?: string;
      agent_id?: string | null;
    } | null;
    if (!body?.content?.trim()) return new Response("Missing content", { status: 400 });

    title = (body.title ?? "Sem título").trim();
    extractedText = body.content.trim();
    sourceType = "text";
    agentId = body.agent_id && body.agent_id !== "all" ? body.agent_id : null;
  }

  if (!extractedText) return new Response("Empty content after extraction", { status: 400 });
  if (extractedText.length > MAX_TEXT_CHARS) {
    extractedText = extractedText.slice(0, MAX_TEXT_CHARS);
  }

  const { data: created, error } = await supabase
    .from("knowledge_sources")
    .insert({
      organization_id: profile.organization_id,
      agent_id: agentId,
      title,
      source_type: sourceType,
      file_size_bytes: fileSizeBytes,
      extracted_text: extractedText,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) return new Response(error?.message ?? "Insert failed", { status: 500 });

  clearPromptCache();
  return Response.json({ ok: true, id: created.id, char_count: extractedText.length });
}
