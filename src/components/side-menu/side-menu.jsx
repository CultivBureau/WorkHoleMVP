import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  ListTodo,
  BarChart3,
  LogOut,
  Wallet,
  Settings as SettingsIcon,
  RefreshCw,
  Bot,
  Moon,
  ChevronLeft,
  ChevronDown,
  CalendarCheck,
  Coffee,
  ListChecks,
  FolderKanban,
  LayoutGrid,
  FileBarChart2,
} from "lucide-react";
import logo from "../../assets/side-menu-icons/logo.svg?url";

const mainMenuItems = [
  { key: "dashboard", Icon: LayoutDashboard },
  {
    key: "time_tracking", // غير من "time" إلى "time_tracking"
    Icon: Clock,
    children: [
      { key: "attendance", Icon: CalendarCheck },
      { key: "break", Icon: Coffee },
    ],
  },
  {
    key: "tasks",
    Icon: ListTodo,
    children: [
      { key: "tasks-list", Icon: ListChecks },
      { key: "projects", Icon: FolderKanban },
    ],
  },
  {
    key: "performance",
    Icon: BarChart3,
    children: [
      { key: "overview", Icon: LayoutGrid },
      { key: "reports", Icon: FileBarChart2 },
    ],
  },
  { key: "leaves", Icon: LogOut },
  { key: "wallet", Icon: Wallet },
];

const settingsItems = [
  { key: "settingsItem", Icon: SettingsIcon },
  { key: "subscriptions", Icon: RefreshCw },
  { key: "help", Icon: Bot },
];

function SideMenuItem({
  item,
  active,
  collapsed,
  onClick,
  openDropdown,
  setOpenDropdown,
  setCollapsed,
  t,
  isArabic,
}) {
  const isActive = active === item.key;
  const hasChildren = !!item.children;
  const isOpen = openDropdown === item.key;

  return (
    <>
      <button
        onClick={() => {
          if (hasChildren) {
            if (collapsed) {
              setCollapsed(false);
              setTimeout(() => setOpenDropdown(item.key), 200);
            } else {
              // toggle dropdown
              setOpenDropdown(isOpen ? null : item.key);
            }
            // لو ضغطت على العنصر الأساسي، روح للصفحة
            onClick(item.key);
          } else {
            onClick(item.key);
          }
        }}
        className={[
          "group w-full flex items-center gap-2 rounded-2xl px-2 py-1.5 transition-all duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-hover)]",
          isActive
            ? "gradient-bg text-white shadow"
            : "bg-transparent hover:bg-[var(--hover-color)]",
          collapsed ? "justify-center " : "justify-start",
        ].join(" ")}
        style={{
          color: isActive ? "white" : "var(--text-color)",
          fontSize: collapsed ? 0 : "13px",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        <item.Icon
          className={[
            "shrink-0 transition-colors",
            collapsed ? "w-6 h-6" : "w-4 h-4",
            isActive
              ? "text-white"
              : "text-[var(--sub-text-color)] group-hover:text-[var(--accent-color)]",
          ].join(" ")}
        />
        {!collapsed && (
          <span
            className={[
              "font-medium transition-colors",
              isActive
                ? "text-white"
                : "text-[var(--sub-text-color)] group-hover:text-[var(--accent-color)]",
            ].join(" ")}
          >
            {t(`aside.${item.key}`)}
          </span>
        )}
        {hasChildren && !collapsed && (
          <ChevronDown
            className={[
              isArabic ? "mr-auto" : "ml-auto",
              "transition-transform",
              isOpen ? "rotate-180" : "",
              isActive
                ? "text-white"
                : "text-[var(--sub-text-color)] group-hover:text-[var(--accent-color)]",
            ].join(" ")}
            size={16}
          />
        )}
      </button>
      {/* Dropdown */}
      {hasChildren && isOpen && !collapsed && (
        <div
          className={
            isArabic
              ? "pr-2 flex flex-col gap-0.5"
              : "pl-6 flex flex-col gap-0.5"
          }
        >
          {item.children.map((child) => (
            <button
              key={child.key}
              onClick={() => onClick(child.key)}
              className={[
                "group w-full flex items-center gap-2 rounded-2xl px-1.5 py-1 text-[13px] font-medium transition-all duration-200",
                active === child.key
                  ? "gradient-bg text-white shadow"
                  : "bg-transparent text-[var(--sub-text-color)] hover:bg-[var(--hover-color)] hover:text-[var(--accent-color)]",
              ].join(" ")}
              style={{
                fontSize: "13px",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              <child.Icon
                className={[
                  "shrink-0 transition-colors w-4 h-4",
                  active === child.key
                    ? "text-white"
                    : "text-[var(--sub-text-color)] group-hover:text-[var(--accent-color)]",
                ].join(" ")}
              />
              <span
                className={[
                  active === child.key
                    ? "text-white"
                    : "text-[var(--sub-text-color)] group-hover:text-[var(--accent-color)]",
                ].join(" ")}
              >
                {t(`aside.${child.key}`)}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ThemeToggle({ theme, onToggle, collapsed, t, isArabic }) {
  const isDark = theme === "dark";
  if (collapsed) {
    return (
      <div className="w-full flex justify-center items-center py-1">
        <button
          onClick={onToggle}
          role="switch"
          aria-checked={isDark}
          className="relative inline-flex items-center justify-center rounded-2xl shadow-sm border-2 border-[var(--toggle-border)] transition-all duration-200"
          style={{
            width: 38,
            height: 38,
            background: "var(--toggle-bg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              color: isDark ? "var(--accent-color)" : "var(--sub-text-color)",
            }}
          >
            <Moon size={22} />
          </div>
          <div
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
            style={{
              background: isDark
                ? "linear-gradient(135deg, var(--knob-gradient-start) 0%, var(--knob-gradient-end) 100%)"
                : "linear-gradient(135deg, var(--knob-gradient-end) 0%, var(--knob-gradient-start) 100%)",
            }}
          />
        </button>
      </div>
    );
  }
  return (
    <div
      className="w-full flex items-center justify-between rounded-2xl px-2 py-2 shadow-sm border"
      style={{
        backgroundColor: "var(--bg-color)",
        borderColor: "var(--border-color)",
        direction: isArabic ? "rtl" : "ltr",
      }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: "var(--text-color)" }}
      >
        {isDark ? t("aside.darkMode") : t("aside.lightMode")}
      </span>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={isDark}
        className="relative inline-flex items-center justify-start rounded-full shadow-sm border transition-all duration-200"
        style={{
          width: 42,
          height: 22,
          background: "var(--toggle-bg)",
          borderColor: "var(--toggle-border)",
          paddingLeft: 3,
          paddingRight: 3,
        }}
      >
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[var(--accent-color)]">
          <Moon className="w-3 h-3" />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-200 ease-out rounded-full shadow-md"
          style={{
            left: isDark ? 20 : 3,
            width: 12,
            height: 12,
            background:
              "linear-gradient(135deg, var(--knob-gradient-start) 0%, var(--knob-gradient-end) 100%)",
          }}
        >
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
      </button>
    </div>
  );
}

export default function SideMenu() {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isArabic = i18n.language === "ar";

  // تحديد الـ active بناءً على الـ route الحالي
  const getActiveKey = () => {
    if (location.pathname.startsWith("/pages/User/dashboard"))
      return "dashboard";
    if (location.pathname.startsWith("/pages/User/leaves")) return "leaves";
    if (location.pathname.startsWith("/pages/User/time_tracking"))
      return "time_tracking";
    if (location.pathname.startsWith("/pages/User/attendance"))
      return "attendance";
    if (location.pathname.startsWith("/pages/User/break")) return "break";
    return "";
  };
  const active = getActiveKey();

  // فتح dropdown تلقائي لو كنت على time_tracking أو أي صفحة من children بتوعها
  useEffect(() => {
    if (
      active === "time_tracking" ||
      active === "attendance" ||
      active === "break"
    ) {
      setOpenDropdown("time_tracking");
    }
  }, [active]);

  // Set language from localStorage or default to "en"
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [i18n]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) setTheme(saved);
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore errors
    }
  }, [theme]);

  // تعديل دالة onClick:
  const handleMenuClick = (key) => {
    if (key === "dashboard") navigate("/pages/User/dashboard");
    else if (key === "leaves") navigate("/pages/User/leaves");
    else if (key === "time_tracking") {
      navigate("/pages/User/time_tracking");
      // الـ dropdown هيفتح تلقائي من الـ useEffect
    } else if (key === "attendance") navigate("/pages/User/attendance");
    else if (key === "break") navigate("/pages/User/break");
    // أضف باقي الصفحات هنا
  };

  // استخدم دالة فارغة بدل setActive
  const handleSettingsClick = () => {};

  const containerBase =
    "flex flex-col min-h-0 overflow-hidden rounded-3xl shadow-sm";
  const containerWidth = collapsed ? "w-20" : "w-[280px]";

  return (
    <aside
      className={[
        containerBase,
        containerWidth,
        "ml-4 mr-2 my-4 p-3 border",
      ].join(" ")}
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
        height: "calc(100vh - 96px)",
      }}
    >
      {/* Collapse/Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center mb-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-2xl p-2 hover:bg-[var(--hover-color)] transition-colors"
            title="Expand"
          >
            <ChevronLeft
              className="w-5 h-5 transition-transform rotate-180"
              style={{ color: "var(--text-color)" }}
            />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div className="flex items-center p-2 gap-3">
          <div className="size-10 grid place-items-center">
            <img src={logo} alt="WorkHole" className="h-10" />
          </div>
          {!collapsed && (
            // ثابت بالإنجليزي واتجاهه يسار دائماً
            <div className="text-left flex items-center" dir="ltr">
              <span className="text-lg font-bold gradient-text">Work</span>
              <span className="text-lg font-bold text-[var(--sub-text-color]">
                Hole
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-xl p-2 hover:bg-[var(--hover-color)] transition-colors"
            title="Collapse"
          >
            <ChevronLeft
              className="w-5 h-5 transition-transform"
              style={{ color: "var(--text-color)" }}
            />
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {!collapsed && (
          <p
            className={`px-3 pb-2 text-xs tracking-wide uppercase font-semibold ${
              isArabic ? "text-right" : "text-left"
            }`}
            style={{
              color: "var(--sub-text-color)",
              direction: isArabic ? "rtl" : "ltr",
            }}
          >
            {t("aside.mainMenu")}
          </p>
        )}
        <nav
          className="flex px-2 flex-col gap-1"
          style={{ alignItems: collapsed ? "center" : "stretch" }}
        >
          {mainMenuItems.map((item) => (
            <SideMenuItem
              key={item.key}
              item={item}
              active={active}
              collapsed={collapsed}
              onClick={handleMenuClick}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              setCollapsed={setCollapsed}
              t={t}
              isArabic={isArabic}
            />
          ))}
        </nav>

        {!collapsed && (
          <p
            className={`px-3 pt-4 pb-2 text-xs tracking-wide uppercase font-semibold ${
              isArabic ? "text-right" : "text-left"
            }`}
            style={{
              color: "var(--sub-text-color)",
              direction: isArabic ? "rtl" : "ltr",
            }}
          >
            {t("aside.settings")}
          </p>
        )}
        <nav
          className="flex px-2 flex-col gap-1 pb-2"
          style={{ alignItems: collapsed ? "center" : "stretch" }}
        >
          {settingsItems.map((item) => (
            <SideMenuItem
              key={item.key}
              item={item}
              active={active}
              collapsed={collapsed}
              onClick={handleSettingsClick} // هنا التغيير
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              setCollapsed={setCollapsed}
              t={t}
              isArabic={isArabic}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Theme Toggle */}
      <div className="shrink-0 pt-3 mb-2">
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          collapsed={collapsed}
          t={t}
          isArabic={isArabic}
        />
      </div>
    </aside>
  );
}
