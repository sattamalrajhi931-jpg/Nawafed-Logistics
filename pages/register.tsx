import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { useCreateMandoob } from "@workspace/api-client-react";
import { CheckCircle, ArrowRight, Truck, User, Phone, CreditCard, MapPin, Star } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().min(10, "رقم الجوال غير صحيح"),
  nationalId: z.string().length(10, "رقم الهوية يجب أن يكون 10 أرقام"),
  city: z.string().min(1, "يرجى اختيار المدينة"),
  vehicleType: z.string().min(1, "يرجى اختيار نوع المركبة"),
  hasLicense: z.boolean(),
  experience: z.string().min(1, "يرجى اختيار سنوات الخبرة"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const cities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر",
  "الظهران", "الطائف", "تبوك", "بريدة", "خميس مشيط", "نجران",
  "الجبيل", "ينبع", "أبها", "حائل", "القصيم", "الأحساء", "القطيف", "أخرى"
];

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const createMandoob = useCreateMandoob();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      hasLicense: false,
    },
  });

  const hasLicense = watch("hasLicense");

  const onSubmit = async (data: FormData) => {
    createMandoob.mutate(
      { data },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">تم التسجيل بنجاح!</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            شكراً لتسجيلك في نوافذ الغد للخدمات اللوجستية. سيتم مراجعة طلبك والتواصل معك في أقرب وقت.
          </p>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full">
              العودة للرئيسية
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="hero-gradient py-16 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
            <Truck className="w-4 h-4" />
            <span>انضم إلى فريقنا</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">تسجيل مندوب توصيل</h1>
          <p className="text-blue-100 text-lg">
            انضم إلى نوافذ الغد واستمتع بفرصة عمل مرنة ومجزية
          </p>
          <Link href="/">
            <button className="mt-6 inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-3xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "💰", title: "دخل مجزٍ", desc: "عمولات تنافسية" },
            { icon: "🕐", title: "أوقات مرنة", desc: "اختر وقتك" },
            { icon: "🚀", title: "دعم مستمر", desc: "فريق دعم 24/7" },
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-2">{b.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{b.title}</div>
              <div className="text-gray-400 text-xs mt-1">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            بيانات التسجيل
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="register-form">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                المعلومات الشخصية
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullName")}
                    data-testid="input-fullName"
                    placeholder="الاسم الرباعي"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.fullName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />رقم الجوال <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    {...register("phone")}
                    data-testid="input-phone"
                    placeholder="05XXXXXXXX"
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="inline-flex items-center gap-1"><CreditCard className="w-3 h-3" />رقم الهوية الوطنية <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    {...register("nationalId")}
                    data-testid="input-nationalId"
                    placeholder="10 أرقام"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.nationalId ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.nationalId && <p className="text-red-500 text-xs mt-1">{errors.nationalId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />المدينة <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    {...register("city")}
                    data-testid="input-city"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white ${errors.city ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Work Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" />
                معلومات العمل
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المركبة <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "motorcycle", label: "دراجة نارية", icon: "🏍️" },
                    { value: "car", label: "سيارة", icon: "🚗" },
                    { value: "bicycle", label: "دراجة هوائية", icon: "🚲" },
                  ].map((v) => (
                    <label
                      key={v.value}
                      className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                        watch("vehicleType") === v.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={v.value}
                        {...register("vehicleType")}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-1">{v.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{v.label}</div>
                    </label>
                  ))}
                </div>
                {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رخصة القيادة <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: true, label: "يوجد ✓" },
                      { value: false, label: "لا يوجد ✗" },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setValue("hasLicense", opt.value)}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          hasLicense === opt.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    سنوات الخبرة <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("experience")}
                    data-testid="input-experience"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white ${errors.experience ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="">اختر سنوات الخبرة</option>
                    <option value="none">لا يوجد خبرة</option>
                    <option value="less_than_1">أقل من سنة</option>
                    <option value="1_to_3">من 1 إلى 3 سنوات</option>
                    <option value="more_than_3">أكثر من 3 سنوات</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="أي معلومات إضافية تريد إضافتها..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            {createMandoob.isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
              </div>
            )}

            <button
              type="submit"
              disabled={createMandoob.isPending}
              data-testid="button-submit-register"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg text-base"
            >
              {createMandoob.isPending ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
            </button>

            <p className="text-center text-gray-400 text-xs">
              بالضغط على إرسال، أنت توافق على معالجة بياناتك الشخصية لأغراض التوظيف
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
