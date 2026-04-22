import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  useListMandoob,
  useGetMandoobStats,
  useUpdateMandoobStatus,
  useDeleteMandoob,
  getListMandoobQueryKey,
  getGetMandoobStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users, Clock, CheckCircle, XCircle, ArrowRight, Phone, MapPin,
  Truck, Search, Trash2, ChevronDown, Eye, Filter, LayoutDashboard,
  FileText, LogOut, Lock, Save, AlertCircle, ChevronUp, Loader2,
  Edit3, Globe, Star, Wrench
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type MainTab = "mandoob" | "cms" | "settings";
type CmsSection = "hero" | "stats" | "services" | "why_us" | "contact" | "footer";

const STATUS_MAP = {
  pending: { label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  approved: { label: "مقبول", color: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "مرفوض", color: "bg-red-100 text-red-700 border-red-200" },
};

const VEHICLE_MAP: Record<string, string> = {
  motorcycle: "🏍️ دراجة نارية",
  car: "🚗 سيارة",
  bicycle: "🚲 دراجة هوائية",
};

const EXPERIENCE_MAP: Record<string, string> = {
  none: "لا يوجد",
  less_than_1: "أقل من سنة",
  "1_to_3": "1 - 3 سنوات",
  more_than_3: "أكثر من 3 سنوات",
};

function useAuth() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setUser({ username: d.username });
        else navigate("/admin/login");
      })
      .catch(() => navigate("/admin/login"))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login");
  };

  return { user, checking, logout };
}

function useContent() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content", { credentials: "include" })
      .then((r) => r.json())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const save = async (section: string, data: any) => {
    const res = await fetch(`/api/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("فشل الحفظ");
    const updated = await res.json();
    setContent((prev) => ({ ...prev, [section]: updated }));
    return updated;
  };

  return { content, loading, save };
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextareaInput({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}

function SectionCard({ title, icon, children, onSave, saving }: { title: string; icon: React.ReactNode; children: React.ReactNode; onSave: () => void; saving: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600">{icon}</span>
          <span className="font-bold text-gray-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-50">
          <div className="pt-4 space-y-4">{children}</div>
          <div className="flex justify-start">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState({ badge: "", title: "", titleHighlight: "", description: "", ctaPrimary: "", ctaSecondary: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ badge: data.badge || "", title: data.title || "", titleHighlight: data.titleHighlight || "", description: data.description || "", ctaPrimary: data.ctaPrimary || "", ctaSecondary: data.ctaSecondary || "" }); }, [data]);

  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="القسم الرئيسي (Hero)" icon={<Globe className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      <TextInput label="الشارة (Badge)" value={form.badge} onChange={set("badge")} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="العنوان الرئيسي" value={form.title} onChange={set("title")} />
        <TextInput label="الجزء المميز من العنوان" value={form.titleHighlight} onChange={set("titleHighlight")} />
      </div>
      <TextareaInput label="الوصف" value={form.description} onChange={set("description")} rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="نص الزر الأول (CTA)" value={form.ctaPrimary} onChange={set("ctaPrimary")} />
        <TextInput label="نص الزر الثاني" value={form.ctaSecondary} onChange={set("ctaSecondary")} />
      </div>
    </SectionCard>
  );
}

function StatsEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [items, setItems] = useState<{ value: number; suffix: string; label: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data?.items) setItems(data.items); }, [data]);

  const update = (i: number, k: string, v: any) => setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave({ items }); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="الإحصائيات" icon={<Star className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-3 gap-3 items-end bg-gray-50 rounded-xl p-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">الرقم</label>
            <input type="number" value={item.value} onChange={(e) => update(i, "value", Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">اللاحقة (+, %...)</label>
            <input type="text" value={item.suffix} onChange={(e) => update(i, "suffix", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">التسمية</label>
            <input type="text" value={item.label} onChange={(e) => update(i, "label", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function ServicesEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState<{ title: string; subtitle: string; items: { title: string; desc: string }[] }>({ title: "", subtitle: "", items: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ title: data.title || "", subtitle: data.subtitle || "", items: data.items || [] }); }, [data]);

  const updateItem = (i: number, k: string, v: string) => setForm((p) => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="قسم الخدمات" icon={<Wrench className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      <TextInput label="عنوان القسم" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
      <TextareaInput label="وصف القسم" value={form.subtitle} onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))} />
      {form.items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
          <span className="text-xs font-bold text-blue-600 uppercase">خدمة {i + 1}</span>
          <TextInput label="عنوان الخدمة" value={item.title} onChange={(v) => updateItem(i, "title", v)} />
          <TextareaInput label="وصف الخدمة" value={item.desc} onChange={(v) => updateItem(i, "desc", v)} rows={2} />
        </div>
      ))}
    </SectionCard>
  );
}

function WhyUsEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState<{ title: string; subtitle: string; items: { title: string; desc: string }[] }>({ title: "", subtitle: "", items: [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ title: data.title || "", subtitle: data.subtitle || "", items: data.items || [] }); }, [data]);

  const updateItem = (i: number, k: string, v: string) => setForm((p) => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="لماذا نوافذ الغد؟" icon={<Star className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      <TextInput label="عنوان القسم" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} />
      <TextareaInput label="وصف القسم" value={form.subtitle} onChange={(v) => setForm((p) => ({ ...p, subtitle: v }))} />
      {form.items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
          <span className="text-xs font-bold text-blue-600 uppercase">ميزة {i + 1}</span>
          <TextInput label="العنوان" value={item.title} onChange={(v) => updateItem(i, "title", v)} />
          <TextareaInput label="الوصف" value={item.desc} onChange={(v) => updateItem(i, "desc", v)} rows={2} />
        </div>
      ))}
    </SectionCard>
  );
}

function ContactEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState({ address: "", email: "", phone: "", whatsapp: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ address: data.address || "", email: data.email || "", phone: data.phone || "", whatsapp: data.whatsapp || "" }); }, [data]);

  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="معلومات التواصل" icon={<Phone className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      <TextInput label="العنوان" value={form.address} onChange={set("address")} />
      <TextInput label="البريد الإلكتروني" value={form.email} onChange={set("email")} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="رقم الهاتف" value={form.phone} onChange={set("phone")} />
        <TextInput label="رقم واتساب (بدون +)" value={form.whatsapp} onChange={set("whatsapp")} />
      </div>
    </SectionCard>
  );
}

function FooterEditor({ data, onSave }: { data: any; onSave: (d: any) => Promise<void> }) {
  const [form, setForm] = useState({ description: "", copyright: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ description: data.description || "", copyright: data.copyright || "" }); }, [data]);

  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  return (
    <SectionCard title="التذييل (Footer)" icon={<FileText className="w-5 h-5" />} onSave={handleSave} saving={saving}>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm">✅ تم الحفظ بنجاح!</div>}
      <TextareaInput label="وصف الشركة في التذييل" value={form.description} onChange={set("description")} rows={3} />
      <TextInput label="نص حقوق النشر" value={form.copyright} onChange={set("copyright")} />
    </SectionCard>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (form.newPassword !== form.confirm) { setError("كلمة المرور الجديدة غير متطابقة"); return; }
    if (form.newPassword.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "فشل تغيير كلمة المرور");
      else { setSuccess(true); setForm({ currentPassword: "", newPassword: "", confirm: "" }); }
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-800">تغيير كلمة المرور</h3>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm mb-4">✅ تم تغيير كلمة المرور بنجاح!</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">⚠️ {error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">كلمة المرور الحالية</label>
          <input type="password" value={form.currentPassword} onChange={set("currentPassword")} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">كلمة المرور الجديدة</label>
          <input type="password" value={form.newPassword} onChange={set("newPassword")} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">تأكيد كلمة المرور</label>
          <input type="password" value={form.confirm} onChange={set("confirm")} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "جاري الحفظ..." : "تحديث كلمة المرور"}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const { user, checking, logout } = useAuth();
  const { content, loading: contentLoading, save } = useContent();
  const [mainTab, setMainTab] = useState<MainTab>("mandoob");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const params = statusFilter !== "all" ? { status: statusFilter as "pending" | "approved" | "rejected" } : {};
  const { data: registrations = [], isLoading } = useListMandoob(params);
  const { data: stats } = useGetMandoobStats();
  const updateStatus = useUpdateMandoobStatus();
  const deleteMandoob = useDeleteMandoob();

  const filtered = registrations.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search) ||
    r.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id: number, status: "pending" | "approved" | "rejected") => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMandoobQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMandoobStatsQueryKey() });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    deleteMandoob.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMandoobQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMandoobStatsQueryKey() });
          if (selected === id) setSelected(null);
        },
      }
    );
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="text-gray-500 text-sm">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png?v=2" alt="نوافذ الغد" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="font-black text-gray-800 text-base leading-none">لوحة التحكم</h1>
              <p className="text-gray-400 text-xs">مرحباً، {user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">الموقع</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {[
            { key: "mandoob", label: "المناديب", icon: <Users className="w-4 h-4" /> },
            { key: "cms", label: "محتوى الموقع", icon: <Edit3 className="w-4 h-4" /> },
            { key: "settings", label: "الإعدادات", icon: <Wrench className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key as MainTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                mainTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {mainTab === "mandoob" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "إجمالي الطلبات", value: stats?.total ?? 0, icon: <Users className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
                { label: "قيد المراجعة", value: stats?.pending ?? 0, icon: <Clock className="w-5 h-5" />, color: "text-yellow-600 bg-yellow-50" },
                { label: "مقبولون", value: stats?.approved ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
                { label: "مرفوضون", value: stats?.rejected ?? 0, icon: <XCircle className="w-5 h-5" />, color: "text-red-600 bg-red-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                  <div className="text-2xl font-black text-gray-800">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو الهاتف أو المدينة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? "الكل" : STATUS_MAP[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {isLoading ? (
                  <div className="text-center py-12 text-gray-400">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm">جاري التحميل...</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">لا توجد نتائج</p>
                  </div>
                ) : (
                  filtered.map((reg) => (
                    <div
                      key={reg.id}
                      onClick={() => setSelected(reg.id === selected ? null : reg.id)}
                      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                        selected === reg.id ? "border-blue-400 shadow-md" : "border-gray-100 hover:border-gray-200 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{reg.fullName}</p>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {reg.city}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUS_MAP[reg.status as keyof typeof STATUS_MAP]?.color}`}>
                          {STATUS_MAP[reg.status as keyof typeof STATUS_MAP]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{reg.phone}</span>
                        <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{VEHICLE_MAP[reg.vehicleType] || reg.vehicleType}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="lg:col-span-3">
                {selected ? (() => {
                  const reg = registrations.find((r) => r.id === selected);
                  if (!reg) return null;
                  return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-black text-gray-800">{reg.fullName}</h2>
                          <p className="text-gray-500 text-sm mt-1">{reg.city} • {new Date(reg.createdAt).toLocaleDateString("ar-SA")}</p>
                        </div>
                        <button onClick={() => handleDelete(reg.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          { label: "رقم الجوال", value: reg.phone },
                          { label: "المدينة", value: reg.city },
                          { label: "وسيلة التنقل", value: VEHICLE_MAP[reg.vehicleType] || reg.vehicleType },
                          { label: "الخبرة", value: EXPERIENCE_MAP[reg.experience] || reg.experience },
                        ].map((f) => (
                          <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                            <p className="text-sm font-semibold text-gray-700">{f.value}</p>
                          </div>
                        ))}
                      </div>

                      {reg.notes && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <p className="text-xs text-gray-400 mb-1">ملاحظات</p>
                          <p className="text-sm text-gray-700">{reg.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {(["pending", "approved", "rejected"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(reg.id, s)}
                            disabled={reg.status === s}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${
                              s === "approved" ? "bg-green-500 hover:bg-green-600 text-white" :
                              s === "rejected" ? "bg-red-500 hover:bg-red-600 text-white" :
                              "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {STATUS_MAP[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })() : (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
                    <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">اختر طلباً لعرض تفاصيله</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mainTab === "cms" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-800">إدارة محتوى الموقع</h2>
                <p className="text-gray-500 text-sm mt-1">يمكنك تعديل نصوص وإحصائيات الموقع من هنا مباشرةً</p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
              >
                <Eye className="w-4 h-4" />
                معاينة الموقع
              </Link>
            </div>
            {contentLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">جاري تحميل محتوى الموقع...</p>
              </div>
            ) : (
              <>
                <HeroEditor data={content.hero} onSave={(d) => save("hero", d)} />
                <StatsEditor data={content.stats} onSave={(d) => save("stats", d)} />
                <ServicesEditor data={content.services} onSave={(d) => save("services", d)} />
                <WhyUsEditor data={content.why_us} onSave={(d) => save("why_us", d)} />
                <ContactEditor data={content.contact} onSave={(d) => save("contact", d)} />
                <FooterEditor data={content.footer} onSave={(d) => save("footer", d)} />
              </>
            )}
          </div>
        )}

        {mainTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-black text-gray-800">الإعدادات</h2>
              <p className="text-gray-500 text-sm mt-1">إدارة حساب المدير</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
              </div>
            </div>
            <ChangePasswordForm />
          </div>
        )}
      </main>
    </div>
  );
}
