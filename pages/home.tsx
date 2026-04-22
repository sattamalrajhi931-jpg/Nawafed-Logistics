import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin, ChevronDown, Menu, X, ArrowLeft, Star, Users, Package, Truck, Building, Shield, Clock, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={ref} className="stat-counter">{count.toLocaleString("ar-SA")}{suffix}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "تشغيل تطبيقات المطاعم",
      desc: "نعمل بصفتنا مشغلاً متميزاً وموثوقاً لتطبيقات المطاعم الكبرى، للحرص على وصول الوجبات بصورة سريعة وطازجة.",
    },
    {
      icon: <Package className="w-10 h-10" />,
      title: "نقل المواد الغذائية",
      desc: "توصيل آمن وسريع للمواد الغذائية بما يتماشى مع أعلى معايير الحفظ والسلامة والنقل اللوجستي المتخصص.",
    },
    {
      icon: <Building className="w-10 h-10" />,
      title: "تغطية شاملة",
      desc: "نفخر بشبكة خدماتنا التي تغطي جميع مدن ومناطق المملكة العربية السعودية بفضل فريقنا ومندوبينا المتميزين.",
    },
  ];

  const partners = [
    { name: "كيتا", img: "/partner-kita.jpg" },
    { name: "هنقرستيشن", img: "/partner-hungerstation.png" },
    { name: "جاهز", img: "/partner-jahez.jpg" },
    { name: "تويو", img: "/partner-toyo.png" },
    { name: "ذا شيفز", img: "/partner-chefs.png" },
  ];

  const whyUs = [
    { title: "سرعة استجابة وتوصيل", desc: "نهتم بالمواعيد الدقيقة ونلتزم بأوقات التسليم المتفق عليها لتوفير تجربة ممتازة للعملاء النهائيين." },
    { title: "أمان وموثوقية", desc: "ضمان سلامة الطلبات والمواد الغذائية من نقطة الاستلام حتى نقطة التسليم بأعلى معايير الحماية." },
    { title: "دعم فني مستمر", desc: "فريق دعم فني متواجد على مدار الساعة للرد على استفساراتكم وحل المشكلات بشكل فوري." },
  ];

  const testimonials = [
    {
      name: "أحمد الشمري",
      role: "مدير العمليات - شركة الحلول التجارية",
      text: "تعاملنا مع نوافذ الغد منذ أكثر من عام، والنتائج تفوق توقعاتنا. الالتزام بالمواعيد والاحترافية في التعامل ميزتهم عن غيرهم.",
      rating: 5,
    },
    {
      name: "سارة العتيبي",
      role: "مديرة المشتريات - متاجر النخيل",
      text: "الشراكة مع نوافذ الغد غيّرت طريقة إدارتنا للتوصيل بالكامل. توفروا لنا حلولاً مخصصة لاحتياجاتنا وبتكلفة معقولة جدًا.",
      rating: 5,
    },
    {
      name: "خالد المطيري",
      role: "مؤسس - منصة تسوق إلكتروني",
      text: "نوافذ الغد شريك موثوق في كل مراحل النمو. قدرتهم على التكيف مع احتياجاتنا المتغيرة جعلتنا نثق بهم بشكل كامل.",
      rating: 5,
    },
  ];

  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver(0.05);
  const { ref: servicesRef, isVisible: servicesVisible } = useIntersectionObserver(0.1);
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver(0.2);
  const { ref: whyRef, isVisible: whyVisible } = useIntersectionObserver(0.1);
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useIntersectionObserver(0.1);

  return (
    <div className="min-h-screen font-sans" dir="rtl">
      {/* Navbar */}
      <nav
        data-testid="navbar"
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/80 backdrop-blur-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3" data-testid="nav-logo">
              <img src="/logo.png?v=2" alt="نوافذ الغد" className="h-14 w-auto object-contain" />
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "الرئيسية", id: "hero" },
                { label: "خدماتنا", id: "services" },
                { label: "قطاعاتنا", id: "sectors" },
                { label: "أسطولنا", id: "fleet" },
                { label: "لماذا نحن", id: "why-us" },
                { label: "شركاؤنا", id: "partners" },
                { label: "تواصل معنا", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  data-testid={`nav-link-${item.id}`}
                  className="font-medium text-sm transition-colors hover:text-blue-600 text-gray-700"
                >
                  {item.label}
                </button>
              ))}
              <Link href="/register">
                <button
                  data-testid="nav-register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-lg"
                >
                  سجّل كمندوب
                </button>
              </Link>
              <Link href="/admin">
                <button
                  data-testid="nav-admin"
                  className="text-sm font-medium border rounded-full px-4 py-2 transition-colors text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  لوحة الإدارة
                </button>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
            <div className="px-6 py-4 space-y-3">
              {[
                { label: "الرئيسية", id: "hero" },
                { label: "خدماتنا", id: "services" },
                { label: "قطاعاتنا", id: "sectors" },
                { label: "أسطولنا", id: "fleet" },
                { label: "لماذا نحن", id: "why-us" },
                { label: "شركاؤنا", id: "partners" },
                { label: "تواصل معنا", id: "contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-right py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen bg-white flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-blue-100/40 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              ref={heroRef}
              className={`space-y-6 transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-sm text-blue-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>شريكك اللوجستي الموثوق</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gray-900">
                نوافذ الغد
                <br />
                <span className="text-blue-600">للخدمات اللوجستية</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                نوفر أسطولاً مجهزاً وحلولاً رقمية لتوصيل سريع وآمن عبر مناطق المملكة العربية السعودية. مشغل موثوق لتطبيقات مثل جاهز وهنقرستيشن.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => scrollTo("contact")}
                  data-testid="hero-cta-primary"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  ابدأ الشراكة الآن
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  data-testid="hero-cta-secondary"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-full transition-all"
                >
                  اكتشف خدماتنا
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="float-animation">
                <img
                  src="/logo.png?v=2"
                  alt="نوافذ الغد للخدمات اللوجستية"
                  className="w-80 h-80 object-contain drop-shadow-xl"
                  data-testid="hero-logo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="wave-shape">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
            <path fill="hsl(210, 40%, 98%)" fillOpacity="1" d="M0,40L48,45.3C96,51,192,61,288,61.3C384,61,480,51,576,42.7C672,35,768,29,864,34.7C960,40,1056,58,1152,61.3C1248,64,1344,54,1392,48L1440,42.7L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"></path>
          </svg>
        </div>

        <button
          onClick={() => scrollTo("services")}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-blue-400 hover:text-blue-600 transition-colors animate-bounce"
          data-testid="scroll-down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-white py-16">
        <div
          ref={statsRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 57, suffix: "+", label: "مندوب توصيل" },
              { value: 13, suffix: "", label: "منطقة بالمملكة" },
              { value: 5, suffix: "", label: "تطبيقات مطاعم" },
              { value: 24, suffix: "", label: "ساعة عمل" },
            ].map((stat, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <div className="text-4xl font-black text-blue-600 mb-2">
                  {statsVisible && <CountUp target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-gray-500 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={servicesRef}
            className={`text-center mb-16 transition-all duration-700 ${servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">ما نقدمه</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">نواكب تطلعاتكم في التوصيل</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              نحن في مؤسسة "نوافذ الغد" متخصصون في تقديم أسرع وأفضل الخدمات اللوجستية وتوصيل طلبات المطاعم والمواد الغذائية بعناية فائقة واحترافية لا مثيل لها.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className={`service-card bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-500 ${servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
                data-testid={`service-card-${i}`}
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Sectors */}
      <section id="sectors" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">قطاعاتنا</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">قطاعات الأعمال</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              نقدم حلولاً لوجستية مصممة خصيصاً لمختلف القطاعات لضمان كفاءة التوريد والتسليم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "المطاعم والمقاهي",
                desc: "تشغيل وإدارة توصيل الطلبات الخاصة بالتطبيقات الغذائية.",
              },
              {
                img: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "المتاجر الإلكترونية",
                desc: "خدمات التوصيل السريع للميل الأخير (Last-Mile Delivery) لمختلف الطرود.",
              },
              {
                img: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
                title: "التموينات والسوبرماركت",
                desc: "توزيع ونقل الأغذية الجافة والمبردة باستخدام شاحنات مهيأة.",
              },
            ].map((sector, i) => (
              <div key={i} className="service-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={sector.img}
                    alt={sector.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{sector.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{sector.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">أسطولنا</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">
              أسطول مركبات متكامل ومجهز
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              لضمان سرعة التوصيل ومرونة الخدمات، نمتلك أسطولاً متنوعاً يغطي كافة الاحتياجات التجارية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "/fleet-sedan.png?v=2",
                title: "سيارات سيدان",
                titleColor: "text-blue-600",
                desc: "مثالية لخدمات التوصيل السريعة اليومية، وطلبات المطاعم الساخنة والمتاجر ضمن المدينة بمرونة تامة وسرعة قياسية.",
                badge: "⚡ توصيل سريع",
              },
              {
                img: "/fleet-van.png?v=2",
                title: "مركبات فان",
                titleColor: "text-blue-600",
                desc: "تستخدم لنقل الطلبيات المتوسطة والطرود الكبيرة، مصممة لاستيعاب العديد من الشحنات وحمايتها من العوامل الجوية.",
                badge: "📦 سعة كبيرة",
              },
              {
                img: "/fleet-dyna.png?v=2",
                title: "شاحنات دايينا",
                titleColor: "text-blue-600",
                desc: "خصيصاً لعمليات التوزيع والنقل التجاري للكميات الكبيرة من المستودعات لقطاعات التجزئة والمطاعم بشكل يومي موثوق.",
                badge: "🏗️ نقل ثقيل",
              },
            ].map((vehicle, i) => (
              <div
                key={i}
                className="service-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
                data-testid={`fleet-card-${i}`}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 bg-gray-100">
                  <img
                    src={vehicle.img}
                    alt={vehicle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      {vehicle.badge}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className={`text-xl font-black mb-3 ${vehicle.titleColor} underline underline-offset-4 decoration-blue-200`}>
                    {vehicle.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{vehicle.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="mt-12 bg-gradient-to-l from-blue-50 to-blue-100 rounded-2xl p-6 flex flex-wrap gap-6 justify-center items-center">
            {[
              { icon: "🚗", label: "سيارات سيدان", num: "50+" },
              { icon: "🚐", label: "مركبات فان", num: "30+" },
              { icon: "🚚", label: "شاحنات دايينا", num: "20+" },
              { icon: "🛡️", label: "جميعها مؤمنة", num: "100%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-center">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <div className="font-black text-blue-700 text-xl">{item.num}</div>
                  <div className="text-gray-500 text-xs">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div
              ref={whyRef}
              className={`transition-all duration-700 ${whyVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">ميزتنا</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-6">لماذا نوافذ الغد؟</h2>
              <p className="text-gray-500 leading-relaxed mb-10">
                نعمل باحترافية وشغف لنكون شريكك اللوجستي الأدق والأسرع في المملكة.
              </p>
              <div className="space-y-6">
                {whyUs.map((item, i) => (
                  <div key={i} className="flex gap-4" data-testid={`why-us-item-${i}`}>
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-700 delay-200 ${whyVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <div className="relative">
                <div className="hero-gradient rounded-3xl p-12 text-white text-center">
                  <div className="text-7xl mb-6">🚀</div>
                  <h3 className="text-2xl font-black mb-4">شريكك في النجاح</h3>
                  <p className="text-blue-100 leading-relaxed">
                    من التعاقد مع منصات التوصيل إلى إدارة سلاسل التوريد الكاملة — نحن هنا لنكون الجسر الذي يوصل أعمالك إلى الأمام.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/15 rounded-2xl p-4">
                      <div className="text-3xl font-black">5+</div>
                      <div className="text-blue-200 text-sm">سنوات خبرة</div>
                    </div>
                    <div className="bg-white/15 rounded-2xl p-4">
                      <div className="text-3xl font-black">24/7</div>
                      <div className="text-blue-200 text-sm">دعم مستمر</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-2xl -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-200 rounded-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">شبكتنا</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">شركاء النجاح</h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              نفخر بتشغيل وتسليم الطلبات لأبرز منصات وتطبيقات التوصيل الرائدة في المملكة
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((partner, i) => (
              <div
                key={i}
                className="partner-card bg-white rounded-2xl p-5 border border-gray-100 text-center cursor-pointer flex flex-col items-center gap-3 w-36"
                data-testid={`partner-card-${i}`}
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-16 w-full object-contain"
                />
                <div className="text-xs font-semibold text-gray-600">{partner.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 hero-gradient rounded-3xl p-10 text-white text-center">
            <h3 className="text-2xl font-black mb-4">هل أنت مهتم بالشراكة معنا؟</h3>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              نرحب بالشراكات مع تطبيقات التوصيل والشركات الراغبة في الاستفادة من خبراتنا اللوجستية.
            </p>
            <button
              onClick={() => scrollTo("contact")}
              data-testid="partner-cta"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 rounded-full transition-all hover:shadow-xl inline-flex items-center gap-2"
            >
              تواصل معنا الآن
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={testimonialsRef}
            className={`text-center mb-16 transition-all duration-700 ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">آراؤهم</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">ماذا يقول عملاؤنا؟</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              رضا عملائنا هو مقياس نجاحنا الحقيقي.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`bg-gray-50 rounded-2xl p-8 border border-gray-100 transition-all duration-500 ${testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
                data-testid={`testimonial-${i}`}
              >
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join as Mandoob CTA */}
      <section id="join" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-gradient rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-12 text-white">
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 text-sm mb-6">
                  <Truck className="w-4 h-4" />
                  <span>فرصة عمل مميزة</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black mb-4">انضم إلى فريق المناديب</h2>
                <p className="text-blue-100 leading-relaxed mb-8">
                  هل تمتلك مركبة وتبحث عن دخل إضافي؟ انضم إلى نوافذ الغد واستمتع بأوقات عمل مرنة وعمولات تنافسية.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "عمولات مجزية ودفع منتظم",
                    "أوقات عمل مرنة تناسبك",
                    "دعم فني وإداري على مدار الساعة",
                    "بيئة عمل احترافية ومنظمة",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-blue-100">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register">
                  <button
                    data-testid="join-cta"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-full transition-all hover:shadow-xl inline-flex items-center gap-2"
                  >
                    سجّل الآن كمندوب
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
              </div>
              <div className="bg-white/10 p-12 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 text-white text-center">
                  {[
                    { icon: "🚀", title: "تسجيل سريع", desc: "أقل من 5 دقائق" },
                    { icon: "💰", title: "دفع أسبوعي", desc: "بدون تأخير" },
                    { icon: "📱", title: "تتبع لحظي", desc: "من هاتفك" },
                    { icon: "🛡️", title: "تأمين شامل", desc: "على جميع الطلبات" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/15 rounded-2xl p-5 backdrop-blur-sm">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-blue-200 text-xs mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">تواصل معنا</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 mb-4">تواصل معنا</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              فريقنا مستعد لتلبية طلباتكم والإجابة على أي استفسارات تتعلق بخدماتنا اللوجستية وتشغيل التطبيقات.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">معلومات التواصل</h3>
              {[
                { icon: <MapPin className="w-6 h-6" />, label: "العنوان", value: "المقر الرئيسي، الرياض، المملكة العربية السعودية", href: "#" },
                { icon: <Mail className="w-6 h-6" />, label: "البريد الإلكتروني", value: "info@nawafidhalghad.com", href: "mailto:info@nawafidhalghad.com" },
                { icon: <Phone className="w-6 h-6" />, label: "رقم الهاتف", value: "+966 50 000 0000", href: "tel:+966500000000" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-4 group"
                  data-testid={`contact-item-${i}`}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">{item.label}</div>
                    <div className="font-semibold text-gray-900">{item.value}</div>
                  </div>
                </a>
              ))}

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">تابعنا على</h4>
                <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "فيسبوك" },
                    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "تويتر" },
                    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "إنستغرام" },
                    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "لينكدإن" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      data-testid={`social-${i}`}
                      className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">طلب عرض سعر / رسالة جديدة</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.");
                }}
                className="space-y-4"
                data-testid="contact-form"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريم"
                    data-testid="input-name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                  <input
                    type="tel"
                    required
                    placeholder="+966 50 000 0000"
                    data-testid="input-phone"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الخدمة المطلوبة</label>
                  <select
                    required
                    data-testid="input-service"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">الخدمة المطلوبة</option>
                    <option value="restaurant-ops">تشغيل توصيل الطلبات</option>
                    <option value="ecommerce">توصيل طرود التجارة الإلكترونية</option>
                    <option value="trucks">نقل بالشاحنات المبردة والجافة</option>
                    <option value="other">استفسار آخر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">معلومات إضافية عن الطلب</label>
                  <textarea
                    rows={4}
                    placeholder="أخبرنا عن احتياجاتك..."
                    data-testid="input-message"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  data-testid="button-submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg"
                >
                  إرسال الطلب
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <img src="/logo.png?v=2" alt="نوافذ الغد" className="h-16 w-auto object-contain brightness-0 invert" />
              </div>
              <p className="text-blue-200 leading-relaxed max-w-sm">
                نوافذ الغد للخدمات اللوجستية — شريكك الموثوق في قطاع التوصيل ونقل الطرود. نفتح لك نوافذ النجاح نحو مستقبل أفضل.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-5">روابط سريعة</h4>
              <ul className="space-y-3 text-blue-200">
                {["خدماتنا", "لماذا نحن", "شركاؤنا", "آراء العملاء", "تواصل معنا"].map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollTo(["services", "why-us", "partners", "testimonials", "contact"][i])}
                      className="hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-5">خدماتنا</h4>
              <ul className="space-y-3 text-blue-200 text-sm">
                <li>التعاقد مع تطبيقات التوصيل</li>
                <li>نقل وتوصيل الطرود</li>
                <li>الشراكة اللوجستية</li>
                <li>إدارة فرق التوصيل</li>
                <li>خدمة 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-blue-200 text-sm">
              © 2025 نوافذ الغد للخدمات اللوجستية. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-4 h-4" />, label: "فيسبوك" },
                { icon: <Twitter className="w-4 h-4" />, label: "تويتر" },
                { icon: <Instagram className="w-4 h-4" />, label: "إنستغرام" },
                { icon: <Linkedin className="w-4 h-4" />, label: "لينكدإن" },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
