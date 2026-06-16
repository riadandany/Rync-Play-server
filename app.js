/* ===== Rync Play - واجهة المستخدم ===== */
const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

function toast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1600);
}

async function loadSettings(){
  const { data, error } = await sb.from('settings').select('key,value');
  if(error){ console.error(error); return {}; }
  const map = {};
  data.forEach(r => map[r.key] = r.value);
  return map;
}

async function loadAnnouncements(){
  const { data } = await sb.from('announcements').select('*').eq('active', true).order('created_at',{ascending:false});
  const host = document.getElementById('announce-host');
  if(!host || !data) return;
  host.innerHTML = data.map(a => `<div class="announce">📣 ${escapeHtml(a.message)}</div>`).join('');
}

async function loadPages(){
  const { data } = await sb.from('pages').select('slug,title').order('created_at',{ascending:true});
  const host = document.getElementById('pages-host');
  if(!host) return;
  if(!data || !data.length){ host.innerHTML = '<p style="color:var(--muted);margin:0">لا توجد صفحات بعد.</p>'; return; }
  host.innerHTML = data.map(p => `<a class="page-pill" href="/p/${encodeURIComponent(p.slug)}">📄 ${escapeHtml(p.title)}</a>`).join('');
}

function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function applySettings(s){
  if(s.site_title){ document.title = s.site_title + ' - ماين كرافت'; }
  if(s.site_description){ const el=document.getElementById('site-desc'); if(el) el.textContent = s.site_description; }
  if(s.server_address){ const el=document.getElementById('srv-address'); if(el) el.textContent = s.server_address; }
  if(s.server_port){ const el=document.getElementById('srv-port'); if(el) el.textContent = s.server_port; }
  if(s.join_link){ const el=document.getElementById('join'); if(el) el.href = s.join_link; }
  if(s.bg_opacity){ document.documentElement.style.setProperty('--bg-opacity', s.bg_opacity); }
  if(s.instructions){
    const list = document.getElementById('instructions-list');
    if(list){
      const lines = s.instructions.split('\n').map(l=>l.trim()).filter(Boolean);
      list.innerHTML = lines.map(l => `<li>${escapeHtml(l.replace(/^\d+\)\s*/,''))}</li>`).join('');
    }
  }
}

// Copy buttons
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]');
  if(!b) return;
  const el = document.getElementById(b.dataset.copy);
  if(!el) return;
  navigator.clipboard.writeText(el.textContent.trim()).then(()=>toast('تم النسخ ✔')).catch(()=>toast('فشل النسخ'));
});

(async () => {
  const s = await loadSettings();
  applySettings(s);
  await loadAnnouncements();
  await loadPages();
})();
