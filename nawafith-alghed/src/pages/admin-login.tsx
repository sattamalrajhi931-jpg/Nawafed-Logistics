import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطأ في تسجيل الدخول");
      } else {
        navigate("/admin");
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.png?v=2" alt="نوافذ الغد" className="h-24 w-auto object-contain mx-auto mb-4 drop-shadow-xl" />
          <h1 className="text-white text-2xl font-black">لوحة تحكم نوافذ الغد</h1>
          <p className="text-blue-200 text-sm mt-1">يرجى تسجيل الدخول للمتابعة</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-blue-200/60 text-xs mt-6">
          نوافذ الغد للخدمات اللوجستية © 2025
        </p>
      </div>
    </div>
  );
}
