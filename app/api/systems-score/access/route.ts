import { NextResponse } from "next/server";
import { hashAccessToken, isPlausibleAccessToken } from "../../../../lib/systems-score-access";
import { fixesForLeaks } from "../../../../lib/systems-score-fixes";
import { getSupabaseServerClient } from "../../../../lib/supabase/server";
import { readStoredSystemsScore } from "../../../../lib/systems-score-v2";

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let token = "";
  try {
    const payload = await request.json();
    token = typeof payload?.token === "string" ? payload.token : "";
  } catch {
    return noStore({ success: false }, 404);
  }

  if (!isPlausibleAccessToken(token)) return noStore({ success: false }, 404);

  const supabase = getSupabaseServerClient();
  const { data: access, error } = await supabase
    .from("systems_score_access_tokens")
    .select("id, revoked_at, assessment_id")
    .eq("token_hash", hashAccessToken(token))
    .maybeSingle();

  if (error || !access || access.revoked_at) return noStore({ success: false }, 404);

  const assessment = await supabase
    .from("clarity_assessments")
    .select("first_name, answers")
    .eq("id", access.assessment_id)
    .maybeSingle();
  const stored = assessment.data ? readStoredSystemsScore(assessment.data.answers) : null;
  if (assessment.error || !stored) return noStore({ success: false }, 404);

  await supabase.from("systems_score_access_tokens").update({ last_used_at: new Date().toISOString() }).eq("id", access.id);

  const fixes = fixesForLeaks(stored.leaks.map((leak) => leak.id)).map((fix) => {
    const leak = stored.leaks.find((item) => item.id === fix.id);
    return { id: fix.id, name: leak?.name ?? fix.title, kind: leak?.kind ?? "leak", title: fix.title, steps: [...fix.steps] };
  });

  return noStore({
    success: true,
    firstName: assessment.data?.first_name ?? "",
    result: stored,
    fixes,
  });
}
