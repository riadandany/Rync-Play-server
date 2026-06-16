// إعدادات Supabase
const SUPABASE_URL = "https://infiapggmsfcitdmryly.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZmlhcGdnbXNmY2l0ZG1yeWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzODM1NDQsImV4cCI6MjA5Njk1OTU0NH0.SreUB-6ChKMI1Es5_ckH1iG4ou11dI4D-5crppHCe9M";

const { createClient } = window.supabase;
window.sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

window.DEFAULT_SETTINGS = {
  id: 1,
  site_name: "RYNC PLAY",
  description: "سيرفر ماين كرافت العربي الأفخم — انضم بنقرة واحدة",
  server_address: "144.76.72.157",
  server_port: "27065",
  join_url: "minecraft://?addExternalServer=RYNC+PLAY|rync.falix.me%3A27065",
  background_opacity: 0.6,
  background_url: "",
  discord_url: "",
  youtube_url: "",
  tiktok_url: "",
};

window.loadSettings = async function () {
  const { data } = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data || window.DEFAULT_SETTINGS;
};

window.applySettings = function (s) {
  document.querySelectorAll("[data-site-name]").forEach(el => el.textContent = s.site_name);
  document.querySelectorAll("[data-description]").forEach(el => el.textContent = s.description);
  document.querySelectorAll("[data-join-url]").forEach(el => el.setAttribute("href", s.join_url));
  document.querySelectorAll("[data-address]").forEach(el => el.textContent = s.server_address);
  document.querySelectorAll("[data-port]").forEach(el => el.textContent = s.server_port);
  if (s.background_url) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,${1 - s.background_opacity}), rgba(0,0,0,${1 - s.background_opacity})), url("${s.background_url}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
  }
  document.title = s.site_name + " — Play Server";
};

window.copyText = async function (text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const old = btn.innerHTML;
    btn.innerHTML = "✓ تم النسخ";
    btn.classList.add("copied");
    setTimeout(() => { btn.innerHTML = old; btn.classList.remove("copied"); }, 1500);
  } catch (e) { alert("تعذر النسخ"); }
};
