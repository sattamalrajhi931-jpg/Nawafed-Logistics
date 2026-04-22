import bcrypt from "bcryptjs";
import { db, adminUsers, siteContent } from "./index";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin"));
  if (existing.length === 0) {
    const hash = await bcrypt.hash("admin@nawafith2025", 12);
    await db.insert(adminUsers).values({ username: "admin", passwordHash: hash });
    console.log("✅ تم إنشاء حساب المدير: admin / admin@nawafith2025");
  } else {
    console.log("ℹ️ حساب المدير موجود مسبقاً");
  }

  const defaultContent = [
    {
      sectionKey: "hero",
      content: {
        badge: "شريكك اللوجستي الموثوق",
        title: "نوافذ الغد",
        titleHighlight: "للخدمات اللوجستية",
        description: "نوفر أسطولاً مجهزاً وحلولاً رقمية لتوصيل سريع وآمن عبر مناطق المملكة العربية السعودية. مشغل موثوق لتطبيقات مثل جاهز وهنقرستيشن.",
        ctaPrimary: "ابدأ الشراكة الآن",
        ctaSecondary: "اكتشف خدماتنا",
      },
    },
    {
      sectionKey: "stats",
      content: {
        items: [
          { value: 57, suffix: "+", label: "مندوب توصيل" },
          { value: 13, suffix: "", label: "منطقة بالمملكة" },
          { value: 5, suffix: "", label: "تطبيقات مطاعم" },
          { value: 24, suffix: "", label: "ساعة عمل" },
        ],
      },
    },
    {
      sectionKey: "services",
      content: {
        title: "نواكب تطلعاتكم في التوصيل",
        subtitle: 'نحن في مؤسسة "نوافذ الغد" متخصصون في تقديم أسرع وأفضل الخدمات اللوجستية وتوصيل طلبات المطاعم والمواد الغذائية بعناية فائقة واحترافية لا مثيل لها.',
        items: [
          { title: "تشغيل تطبيقات المطاعم", desc: "نعمل بصفتنا مشغلاً متميزاً وموثوقاً لتطبيقات المطاعم الكبرى، للحرص على وصول الوجبات بصورة سريعة وطازجة." },
          { title: "نقل المواد الغذائية", desc: "توصيل آمن وسريع للمواد الغذائية بما يتماشى مع أعلى معايير الحفظ والسلامة والنقل اللوجستي المتخصص." },
          { title: "تغطية شاملة", desc: "نفخر بشبكة خدماتنا التي تغطي جميع مدن ومناطق المملكة العربية السعودية بفضل فريقنا ومندوبينا المتميزين." },
        ],
      },
    },
    {
      sectionKey: "why_us",
      content: {
        title: "لماذا نوافذ الغد؟",
        subtitle: "نعمل باحترافية وشغف لنكون شريكك اللوجستي الأدق والأسرع في المملكة.",
        items: [
          { title: "سرعة استجابة وتوصيل", desc: "نهتم بالمواعيد الدقيقة ونلتزم بأوقات التسليم المتفق عليها لتوفير تجربة ممتازة للعملاء النهائيين." },
          { title: "أمان وموثوقية", desc: "ضمان سلامة الطلبات والمواد الغذائية من نقطة الاستلام حتى نقطة التسليم بأعلى معايير الحماية." },
          { title: "دعم فني مستمر", desc: "فريق دعم فني متواجد على مدار الساعة للرد على استفساراتكم وحل المشكلات بشكل فوري." },
        ],
      },
    },
    {
      sectionKey: "contact",
      content: {
        address: "المقر الرئيسي، الرياض، المملكة العربية السعودية",
        email: "info@nawafidhalghad.com",
        phone: "+966 50 000 0000",
        whatsapp: "966500000000",
      },
    },
    {
      sectionKey: "footer",
      content: {
        description: "نوافذ الغد للخدمات اللوجستية — شريكك الموثوق في قطاع التوصيل ونقل الطرود. نفتح لك نوافذ النجاح نحو مستقبل أفضل.",
        copyright: "© 2025 نوافذ الغد للخدمات اللوجستية. جميع الحقوق محفوظة.",
      },
    },
  ];

  for (const item of defaultContent) {
    const exists = await db.select().from(siteContent).where(eq(siteContent.sectionKey, item.sectionKey));
    if (exists.length === 0) {
      await db.insert(siteContent).values({ sectionKey: item.sectionKey, content: item.content, updatedAt: new Date() });
      console.log(`✅ تم إنشاء محتوى: ${item.sectionKey}`);
    }
  }

  console.log("✅ اكتمل الإعداد الأولي");
  process.exit(0);
}

seedAdmin().catch((e) => { console.error(e); process.exit(1); });
