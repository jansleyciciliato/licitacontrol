import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function getSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Client sem tipagem genérica para operações de escrita que o TS não consegue inferir
function getSupabaseUntyped() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("licitacoes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseUntyped();
  const { error } = await supabase.from("licitacoes").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseUntyped();
  const body = await req.json();

  console.log("[PATCH] id:", params.id, "body:", JSON.stringify(body));

  const { data, error } = await supabase
    .from("licitacoes")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("[PATCH] Supabase error:", error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  console.log("[PATCH] Sucesso:", data?.id, "status:", data?.status);
  return NextResponse.json(data);
}
