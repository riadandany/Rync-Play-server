# 🎮 Rync Play Server - موقع ماين كرافت

موقع فخم (HTML / CSS / JS فقط) لسيرفر ماين كرافت **Rync Play** متصل بـ Supabase.

## 📂 الملفات
- `index.html` - الصفحة الرئيسية (زر الدخول + IP + Port)
- `page.html` - عارض الصفحات الديناميكية (`page.html?slug=xxx`)
- `admin-dev.html` - **لوحة المطور المخفية** (لا يوجد لها رابط بالموقع)
- `styles.css` - التنسيقات
- `app.js` - منطق الصفحة الرئيسية
- `admin.js` - منطق لوحة المطور
- `config.js` - مفاتيح Supabase
- `supabase.sql` - **شغّله مرّة واحدة في Supabase → SQL Editor**
- `assets/` - الشعار والعنوان

## 🚀 الخطوات
1. **شغّل SQL**: افتح Supabase Dashboard → SQL Editor → الصق محتوى `supabase.sql` → Run.
2. **ارفع المجلد إلى GitHub** ثم اربطه بـ **Vercel** (Framework Preset: Other / Static).
3. افتح الموقع.
4. لوحة المطور: `https://yourdomain.com/admin-dev.html`
   - كلمة السر الافتراضية: **admin** (يمكن تغييرها من اللوحة).

## ⚙️ ما يمكنك تعديله من اللوحة
- اسم الموقع ووصفه.
- عنوان السيرفر (IP) والمنفذ (Port).
- رابط الدخول `minecraft://...`.
- شفافية خلفية الموقع.
- التعليمات (سطر = خطوة).
- الإعلانات (إضافة / إظهار / إخفاء / حذف).
- الصفحات الديناميكية (إنشاء / تعديل / حذف، تدعم HTML).
- كلمة سر المطور.

## 🔐 ملاحظة أمنية
كلمة السر مخزّنة في Supabase ويتم التحقق منها من المتصفح (طلب المستخدم).
لرفع مستوى الأمان لاحقاً يُنصح بنقل التحقق إلى Edge Function.

## 🔗 السيرفر
- IP: `144.76.72.157`
- Port: `27065`
- Join: `minecraft://?addExternalServer=RYNC+PLAY|rync.falix.me%3A27065`
