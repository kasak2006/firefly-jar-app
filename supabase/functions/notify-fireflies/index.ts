// supabase/functions/notify-fireflies/index.ts
//
// Runs once a day (scheduled via Supabase Cron — see SETUP_GUIDE.md).
// Finds fireflies whose memory_date has arrived and hasn't been emailed yet,
// sends one email per firefly via Resend, then marks it notified.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
const fromEmail = Deno.env.get("NOTIFY_FROM_EMAIL") ?? "onboarding@resend.dev";

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const today = new Date().toISOString().slice(0, 10);

  // 1. find fireflies that are ready but haven't been emailed
  const { data: fireflies, error } = await supabase
    .from("fireflies")
    .select("id, memory_text, memory_date, user_id")
    .lte("memory_date", today)
    .eq("notified", false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;

  for (const f of fireflies ?? []) {
    // 2. look up that user's email
    const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(f.user_id);
    const email = userRes?.user?.email;
    if (userErr || !email) continue;

    // 3. send the email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: "A firefly lit up in your jar",
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: auto; padding: 24px; background:#f1e4c2; color:#3d2b1a; border-radius:8px;">
            <p style="font-size:14px; letter-spacing:.04em; text-transform:uppercase; color:#8c3a45;">a firefly lit up</p>
            <p style="font-size:17px; line-height:1.6; font-style:italic; border-top:1px dashed #c9b385; border-bottom:1px dashed #c9b385; padding:16px 0;">${f.memory_text}</p>
            <p style="font-size:13px; color:#6b563c;">Go take a look in your jar.</p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) continue;

    // 4. mark it as notified so it's never emailed twice
    await supabase.from("fireflies").update({ notified: true }).eq("id", f.id);
    sent++;
  }

  return new Response(JSON.stringify({ checked: fireflies?.length ?? 0, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
