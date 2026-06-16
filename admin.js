/* ===== Rync Play - لوحة المطور ===== */
const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
const $ = id => document.getElementById(id);
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
function esc(s){return (s||'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

let SETTINGS = {};
let EDITING_PAGE = null;

async function fetchSettings(){
  const { data } = await sb.from('settings').select('*');
  SETTINGS = {};
  (data||[]).forEach(r => SETTINGS[r.key] = r.value);
}
async function setSetting(key, value){
  const { error } = await sb.from('settings').upsert({ key, value });
  if(error) throw error;
}

/* ---- Login ---- */
$('login-btn').addEventListener('click', async () => {
  await fetchSettings();
  const pw = $('pw').value;
  if(pw && pw === (SETTINGS.admin_password||'admin')){
    sessionStorage.setItem('rync_admin','1');
    showDash();
  } else {
    $('login-err').style.display='block';
  }
});
$('pw').addEventListener('keydown', e => { if(e.key==='Enter') $('login-btn').click(); });

$('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('rync_admin');
  location.reload();
});

/* ---- Tabs ---- */
document.querySelectorAll('.tab[data-tab]').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab[data-tab]').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p=>p.style.display='none');
  $('pane-'+t.dataset.tab).style.display='block';
}));

/* ---- Settings save ---- */
$('save-settings').addEventListener('click', async () => {
  try{
    const keys = ['site_title','site_description','server_address','server_port','join_link','bg_opacity'];
    for(const k of keys) await setSetting(k, $('s-'+k).value);
    toast('تم الحفظ ✔');
  }catch(e){ toast('فشل الحفظ'); console.error(e); }
});
$('save-instructions').addEventListener('click', async () => {
  try{ await setSetting('instructions', $('s-instructions').value); toast('تم الحفظ ✔'); }
  catch(e){ toast('فشل'); }
});
$('save-pw').addEventListener('click', async () => {
  const v = $('new-pw').value.trim();
  if(!v){ toast('اكتب كلمة سر'); return; }
  await setSetting('admin_password', v);
  toast('تم تغيير كلمة السر ✔');
  $('new-pw').value='';
});

/* ---- Announcements ---- */
async function loadAnns(){
  const { data } = await sb.from('announcements').select('*').order('created_at',{ascending:false});
  $('ann-list').innerHTML = (data||[]).map(a => `
    <div class="copy-row" style="margin-bottom:8px">
      <span class="val">${esc(a.message)}</span>
      <button class="copy-btn" onclick="toggleAnn('${a.id}', ${!a.active})">${a.active?'إخفاء':'إظهار'}</button>
      <button class="copy-btn danger" onclick="delAnn('${a.id}')">حذف</button>
    </div>`).join('') || '<p style="color:var(--muted)">لا توجد إعلانات.</p>';
}
window.toggleAnn = async (id, active) => { await sb.from('announcements').update({active}).eq('id',id); loadAnns(); };
window.delAnn = async (id) => { if(confirm('حذف الإعلان؟')){ await sb.from('announcements').delete().eq('id',id); loadAnns(); } };
$('add-ann').addEventListener('click', async () => {
  const v = $('new-ann').value.trim(); if(!v) return;
  await sb.from('announcements').insert({ message:v, active:true });
  $('new-ann').value=''; loadAnns(); toast('تمت الإضافة ✔');
});

/* ---- Pages ---- */
async function loadPages(){
  const { data } = await sb.from('pages').select('*').order('created_at',{ascending:true});
  $('pages-list').innerHTML = (data||[]).map(p => `
    <div class="copy-row" style="margin-bottom:8px">
      <span class="val">${esc(p.title)} <span style="color:var(--muted);font-size:12px">(${esc(p.slug)})</span></span>
      <button class="copy-btn" onclick="editPage('${p.id}')">تعديل</button>
      <button class="copy-btn" onclick="window.open('/p/'+encodeURIComponent('${esc(p.slug)}'),'_blank')">فتح</button>
      <button class="copy-btn danger" onclick="delPage('${p.id}')">حذف</button>
    </div>`).join('') || '<p style="color:var(--muted)">لا توجد صفحات.</p>';
}
window.editPage = async (id) => {
  const { data } = await sb.from('pages').select('*').eq('id',id).maybeSingle();
  if(!data) return;
  EDITING_PAGE = id;
  $('p-slug').value=data.slug; $('p-title').value=data.title; $('p-content').value=data.content;
  window.scrollTo({top:0,behavior:'smooth'});
};
window.delPage = async (id) => { if(confirm('حذف الصفحة؟')){ await sb.from('pages').delete().eq('id',id); loadPages(); } };
$('clear-page').addEventListener('click', () => { EDITING_PAGE=null; $('p-slug').value=''; $('p-title').value=''; $('p-content').value=''; });
$('save-page').addEventListener('click', async () => {
  const slug=$('p-slug').value.trim(), title=$('p-title').value.trim(), content=$('p-content').value;
  if(!slug || !title){ toast('املأ المعرّف والعنوان'); return; }
  if(EDITING_PAGE){
    const { error } = await sb.from('pages').update({slug,title,content,updated_at:new Date().toISOString()}).eq('id',EDITING_PAGE);
    if(error){ toast('فشل'); console.error(error); return; }
  } else {
    const { error } = await sb.from('pages').insert({slug,title,content});
    if(error){ toast('فشل (قد يكون المعرّف موجود)'); console.error(error); return; }
  }
  toast('تم الحفظ ✔'); $('clear-page').click(); loadPages();
});

/* ---- Show dashboard ---- */
async function showDash(){
  $('login-view').style.display='none';
  $('dash-view').style.display='block';
  await fetchSettings();
  ['site_title','site_description','server_address','server_port','join_link','bg_opacity','instructions'].forEach(k=>{
    const el = $('s-'+k); if(el) el.value = SETTINGS[k]||'';
  });
  loadAnns(); loadPages();
}

if(sessionStorage.getItem('rync_admin')==='1'){ showDash(); }
