# RYNC PLAY — موقع سيرفر ماين كرافت

موقع ثابت HTML/CSS/JS متصل بـ Supabase. جاهز للرفع على GitHub والاستضافة على Vercel.

## الملفات
- `index.html` — الصفحة الرئيسية + زر الدخول للسيرفر + نسخ العنوان والبورت
- `instructions.html` — صفحة التعليمات
- `admin.html` — لوحة المطور (كلمة السر مخزنة في قاعدة البيانات بشكل مشفّر)
- `styles.css` — التصميم (أخضر/أسود فخم، عربي RTL)
- `supabase.js` — اتصال Supabase + دوال مساعدة
- `setup.sql` — كود قاعدة البيانات (شغّله مرة واحدة)

## خطوات التشغيل

### 1) إعداد قاعدة البيانات
1. ادخل على https://supabase.com/dashboard/project/infiapggmsfcitdmryly/sql
2. افتح **New Query**
3. الصق كل محتوى `setup.sql` ثم اضغط **Run**

### 2) كلمة سر لوحة المطور
- الكلمة الافتراضية: **admin123**
- بعد الدخول، غيّرها من تبويب "🔑 كلمة السر"

### 3) الاستضافة على Vercel
1. ارفع الملفات على مستودع GitHub جديد
2. ادخل https://vercel.com/new واختر المستودع
3. اضغط **Deploy** (لا يحتاج أي إعدادات — موقع ثابت)

### 4) الاستضافة على GitHub Pages (اختياري)
- Settings → Pages → Branch: main / root → Save

## الروابط
- لوحة المطور: `/admin.html`
- التعليمات: `/instructions.html`
