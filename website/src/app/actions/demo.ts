"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitDemoRequest(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("demo_requests").insert({
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: (formData.get("telefone") as string) || null,
    empresa: (formData.get("empresa") as string) || null,
    cargo: (formData.get("cargo") as string) || null,
    vertical_interesse: (formData.get("vertical_interesse") as string) || null,
    mensagem: (formData.get("mensagem") as string) || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
