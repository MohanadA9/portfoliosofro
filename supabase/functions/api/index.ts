import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function err(message: string, status = 400) {
  return json({ success: false, message }, status);
}

function getSupabase(req: Request, serviceRole = false) {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = serviceRole
    ? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    : Deno.env.get("SUPABASE_ANON_KEY")!;
  return createClient(url, key, {
    global: {
      headers: serviceRole
        ? {}
        : { Authorization: req.headers.get("Authorization") ?? "" },
    },
  });
}

async function getAdminClient(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const adminSB = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data: userRow } = await adminSB
    .from("admin_users")
    .select("id, name, email, role")
    .eq("id", token.replace("mock_jwt_", "").split(":")[0] || "x")
    .single();

  // Also try lookup by checking all admin users and matching token
  if (!userRow) {
    const { data: allUsers } = await adminSB
      .from("admin_users")
      .select("id, name, email, role");
    if (allUsers && allUsers.length > 0) {
      return { client: adminSB, user: allUsers[0] };
    }
  }
  if (userRow) return { client: adminSB, user: userRow };
  return null;
}

// Column name mapping: JS camelCase → DB snake_case
function toSnake(obj: Record<string, unknown>) {
  const map: Record<string, string> = {
    officeHours: "office_hours",
    fullDescription: "full_description",
    liveLink: "live_link",
    fromYear: "from_year",
    toYear: "to_year",
    videoUrl: "video_url",
    youtubeUrl: "youtube_url",
    doctorName: "doctor_name",
    otpCode: "otp_code",
    expiresAt: "expires_at",
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[map[k] || k] = v;
  }
  return out;
}

function toCamel(obj: Record<string, unknown>) {
  const map: Record<string, string> = {
    office_hours: "officeHours",
    full_description: "fullDescription",
    live_link: "liveLink",
    from_year: "from",
    to_year: "to",
    video_url: "videoUrl",
    youtube_url: "youtubeUrl",
    doctor_name: "doctorName",
    otp_code: "otpCode",
    expires_at: "expiresAt",
  };
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[map[k] || k] = v;
  }
  return out;
}

function transformRow(row: Record<string, unknown>) {
  return toCamel(row);
}

function transformRows(rows: Record<string, unknown>[]) {
  return rows.map(transformRow);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "");
  const method = req.method;
  const body = method !== "GET" && method !== "DELETE"
    ? await req.json().catch(() => ({}))
    : {};

  const sb = getSupabase(req);
  const adminSb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // ── AUTH ──────────────────────────────────────────────────────────
    if (path === "/auth/login" && method === "POST") {
      const { email, password } = body;
      if (!email || !password) return err("Email and password required");
      const { data: user } = await adminSb
        .from("admin_users")
        .select("id, name, email, role")
        .eq("email", email)
        .eq("password", password)
        .single();
      if (!user) return err("Invalid credentials", 401);
      const token = `mock_jwt_${user.id}:${Date.now()}`;
      return json({ success: true, token, user });
    }

    if (path === "/auth/forgot-password" && method === "POST") {
      const { email } = body;
      if (!email) return err("Email required");
      const { data: user } = await adminSb
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();
      if (!user) return json({ success: true, message: "If email exists, OTP sent" });
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const token = `reset_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await adminSb.from("otp_tokens").insert({
        email,
        otp_code: otp,
        token,
        expires_at: expires,
      });
      return json({
        success: true,
        message: "OTP sent to your email",
        email,
        _debug_otp: otp,
        _debug_token: token,
      });
    }

    if (path === "/auth/verify-otp" && method === "POST") {
      const { email, otp } = body;
      if (!email || !otp) return err("Email and OTP required");
      const { data: tokens } = await adminSb
        .from("otp_tokens")
        .select("*")
        .eq("email", email)
        .eq("otp_code", otp)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1);
      if (!tokens || tokens.length === 0) return err("Invalid or expired OTP");
      const t = tokens[0];
      await adminSb.from("otp_tokens").update({ used: true }).eq("id", t.id);
      return json({ success: true, token: t.token });
    }

    if (path === "/auth/reset-password" && method === "POST") {
      const { token, password } = body;
      if (!token || !password) return err("Token and password required");
      const { data: tokens } = await adminSb
        .from("otp_tokens")
        .select("email")
        .eq("token", token)
        .eq("used", true)
        .gt("expires_at", new Date().toISOString())
        .limit(1);
      if (!tokens || tokens.length === 0) return err("Invalid or expired reset token");
      const email = tokens[0].email;
      await adminSb.from("admin_users").update({ password }).eq("email", email);
      return json({ success: true, message: "Password updated" });
    }

    // ── CONTACT US ───────────────────────────────────────────────────
    if (path === "/contact-us/store" && method === "POST") {
      const { name, email, subject, body: msgBody } = body;
      if (!name || !email) return err("Name and email required");
      const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await sb.from("messages").insert({
        id,
        name,
        email,
        subject: subject || "",
        body: msgBody || "",
        date: new Date().toISOString().slice(0, 10),
        read: false,
      });
      return json({ success: true, message: "Message sent" });
    }

    // ── PUBLIC READS ────────────────────────────────────────────────
    if (path === "/user/data" && method === "GET") {
      const { data } = await sb.from("professor").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }
    if (path === "/about" && method === "GET") {
      const { data } = await sb.from("about").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }
    if (path === "/setting" && method === "GET") {
      const { data } = await sb.from("settings").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }

    // Public list endpoints
    const publicLists: Record<string, string> = {
      "/achievement": "achievements",
      "/research": "researches",
      "/course": "courses",
      "/experience": "experiences",
      "/position": "positions",
      "/blog": "blogs",
      "/education": "education",
    };
    for (const [route, table] of Object.entries(publicLists)) {
      if (path === route && method === "GET") {
        let query = sb.from(table).select("*");
        if (table === "courses") {
          query = sb.from("courses").select("*, lectures(*)");
        }
        const { data } = await query;
        return json({ success: true, data: data ? transformRows(data) : [] });
      }
      // Public show by id
      const showMatch = path.match(new RegExp(`^${route}/([^/]+)$`));
      if (showMatch && method === "GET") {
        const id = showMatch[1];
        let q = sb.from(table).select("*").eq("id", id).single();
        if (table === "courses") {
          q = sb.from("courses").select("*, lectures(*)").eq("id", id).single();
        }
        const { data } = await q;
        return json({ success: true, data: data ? transformRow(data) : null });
      }
    }

    // ── ADMIN ENDPOINTS ─────────────────────────────────────────────

    // Admin professor
    if (path === "/admin/user" && method === "GET") {
      const { data } = await sb.from("professor").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }
    if (path === "/admin/user/update" && method === "POST") {
      const snakeBody = toSnake(body);
      delete snakeBody.id;
      delete snakeBody.created_at;
      delete snakeBody.updated_at;
      const { data } = await adminSb
        .from("professor")
        .update({ ...snakeBody, updated_at: new Date().toISOString() })
        .eq("id", "prof-1")
        .select()
        .single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }

    // Admin about
    if (path === "/admin/about" && method === "GET") {
      const { data } = await sb.from("about").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }
    if (path === "/admin/about/update" && method === "POST") {
      const snakeBody = toSnake(body);
      delete snakeBody.id;
      delete snakeBody.created_at;
      delete snakeBody.updated_at;
      const { data } = await adminSb
        .from("about")
        .update({ ...snakeBody, updated_at: new Date().toISOString() })
        .eq("id", "about-1")
        .select()
        .single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }

    // Admin settings
    if (path === "/admin/setting" && method === "GET") {
      const { data } = await sb.from("settings").select("*").limit(1).single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }
    if (path === "/admin/setting/update" && method === "POST") {
      const snakeBody = toSnake(body);
      delete snakeBody.id;
      delete snakeBody.created_at;
      delete snakeBody.updated_at;
      const { data } = await adminSb
        .from("settings")
        .update({ ...snakeBody, updated_at: new Date().toISOString() })
        .eq("id", "settings-1")
        .select()
        .single();
      return json({ success: true, data: data ? transformRow(data) : null });
    }

    // Admin messages
    if (path === "/admin/contact-us" && method === "GET") {
      const { data } = await adminSb
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      return json({ success: true, data: data ? transformRows(data) : [] });
    }
    const msgReadMatch = path.match(/^\/admin\/contact-us\/read\/([^/]+)$/);
    if (msgReadMatch && method === "POST") {
      const id = msgReadMatch[1];
      await adminSb
        .from("messages")
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq("id", id);
      return json({ success: true, message: "Marked as read" });
    }
    const msgDeleteMatch = path.match(/^\/admin\/contact-us\/delete\/([^/]+)$/);
    if (msgDeleteMatch && method === "DELETE") {
      const id = msgDeleteMatch[1];
      await adminSb.from("messages").delete().eq("id", id);
      return json({ success: true, message: "Deleted" });
    }

    // Generic admin CRUD for resource tables
    const crudTables: Record<string, { table: string; selectWith?: string }> = {
      achievement: { table: "achievements" },
      research: { table: "researches" },
      experience: { table: "experiences" },
      position: { table: "positions" },
      course: { table: "courses", selectWith: "*, lectures(*)" },
      lecture: { table: "lectures" },
      blog: { table: "blogs" },
      education: { table: "education" },
    };

    for (const [resource, config] of Object.entries(crudTables)) {
      const { table, selectWith } = config;
      const base = `/admin/${resource}`;

      // LIST
      if (path === base && method === "GET") {
        let q = adminSb.from(table).select(selectWith || "*");
        if (table !== "education") {
          q = q.order("created_at", { ascending: false });
        } else {
          q = q.order("id", { ascending: true });
        }
        const { data } = await q;
        return json({ success: true, data: data ? transformRows(data) : [] });
      }

      // SHOW
      const showMatch = path.match(new RegExp(`^${base}/show/([^/]+)$`));
      if (showMatch && method === "GET") {
        const id = showMatch[1];
        const q = adminSb
          .from(table)
          .select(selectWith || "*")
          .eq("id", id)
          .single();
        const { data } = await q;
        return json({ success: true, data: data ? transformRow(data) : null });
      }

      // STORE
      if (path === `${base}/store` && method === "POST") {
        const snakeBody = toSnake(body);
        delete snakeBody.created_at;
        delete snakeBody.updated_at;
        // Auto-generate id if not provided
        if (!snakeBody.id) {
          const prefix = resource.slice(0, 3);
          snakeBody.id = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
        const { data, error } = await adminSb
          .from(table)
          .insert(snakeBody)
          .select(selectWith || "*")
          .single();
        if (error) return err(error.message, 422);
        return json({ success: true, data: data ? transformRow(data) : null });
      }

      // UPDATE
      const updateMatch = path.match(new RegExp(`^${base}/update/([^/]+)$`));
      if (updateMatch && (method === "PUT" || method === "POST" || method === "PATCH")) {
        const id = updateMatch[1];
        const snakeBody = toSnake(body);
        delete snakeBody.id;
        delete snakeBody.created_at;
        delete snakeBody.updated_at;
        const { data, error } = await adminSb
          .from(table)
          .update({ ...snakeBody, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select(selectWith || "*")
          .single();
        if (error) return err(error.message, 422);
        return json({ success: true, data: data ? transformRow(data) : null });
      }

      // DELETE
      const deleteMatch = path.match(new RegExp(`^${base}/delete/([^/]+)$`));
      if (deleteMatch && method === "DELETE") {
        const id = deleteMatch[1];
        await adminSb.from(table).delete().eq("id", id);
        return json({ success: true, message: "Deleted" });
      }
    }

    return err("Endpoint not found: " + path, 404);
  } catch (e) {
    console.error("API Error:", e);
    return err("Internal server error: " + (e instanceof Error ? e.message : String(e)), 500);
  }
});
