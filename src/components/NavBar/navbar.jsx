import React, { useEffect, useRef, useState } from "react";
import { Search, Bell, Globe, Clock, Calendar, ChevronDown, X, Menu } from "lucide-react";
import AvatarIcon from "../../../public/assets/navbar/Avatar.png";

const translations = {
  en: {
    greeting: "Good Morning",
    user: ", Adam",
    online: "Online",
    arabic: "Arabic",
    english: "English",
    searchPlaceholder: "Search...",
    date: "Mar 07, 2025",
    time: "3:00 PM",
    role: "Frontend Developer",
    profileName: "Sara Wael",
  },
  ar: {
    greeting: "صباح الخير",
    user: "، آدم",
    online: "متصل الآن",
    arabic: "العربية",
    english: "الإنجليزية",
    searchPlaceholder: "ابحث...",
    date: "٧ مارس ٢٠٢٥",
    time: "٣:٠٠ م",
    role: "مطور واجهات",
    profileName: "سارة وائل",
  },
};

const NavBar = ({ lang, setLang }) => {
  const t = translations[lang];
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [isSearchOpen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const popSideLang = lang === "ar" ? "left-0" : "right-0";

  return (
    <nav
      className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-200/50 relative z-40"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Greeting */}
      <div className="flex items-center gap-6 max-[900px]:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="gradient-text">{t.greeting}</span>
            <span className="font-semibold" style={{ color: "var(--text-color)" }}>{t.user}</span>
          </h1>
        </div>
        <div className="flex items-center gap-5">
          {/* Online Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm"
            style={{ backgroundColor: "var(--hover-color)", borderColor: "var(--border-color)" }}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold" style={{ color: "var(--accent-color)" }}>{t.online}</span>
          </div>
          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-200 border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
            >
              <span className="text-xs font-semibold">{lang === "ar" ? t.arabic : t.english}</span>
              <Globe className="w-4 h-4" style={{ color: "var(--sub-text-color)" }} />
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--sub-text-color)" }} />
            </button>
            {langOpen && (
              <div className={`absolute top-full mt-2 ${popSideLang} w-36 border shadow-xl rounded-2xl overflow-hidden z-50`}
                style={{ backgroundColor: "var(--bg-color)", borderColor: "var(--border-color)" }}>
                <button
                  onClick={() => { setLang("en"); setLangOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                  style={{
                    color: "var(--text-color)",
                    backgroundColor: lang === "en" ? "var(--hover-color)" : "transparent",
                    fontWeight: lang === "en" ? "bold" : "medium",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = lang === "en" ? "var(--hover-color)" : "transparent"}
                >
                  {t.english}
                </button>
                <button
                  onClick={() => { setLang("ar"); setLangOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                  style={{
                    color: "var(--text-color)",
                    backgroundColor: lang === "ar" ? "var(--hover-color)" : "transparent",
                    fontWeight: lang === "ar" ? "bold" : "medium",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = lang === "ar" ? "var(--hover-color)" : "transparent"}
                >
                  {t.arabic}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Left Section - Just Greeting */}
      <div className="min-[901px]:hidden">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="gradient-text">{t.greeting}</span>
          <span className="font-semibold" style={{ color: "var(--text-color)" }}>{t.user}</span>
        </h1>
      </div>
      {/* Desktop Right Section */}
      <div className="flex items-center gap-4 max-[900px]:hidden">
        {/* Search and Notifications */}
        <div
          ref={searchRef}
          className={`flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse" : ""}`}
        >
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="p-2.5 rounded-2xl border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
          >
            <Search
              className="w-4 h-4"
              style={{ color: "var(--sub-text-color)" }}
            />
          </button>
          {/* Expanding Search Field */}
          <div
            className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"} ${isSearchOpen ? "w-64" : "w-0"}`}
          >
            <div
              className={`flex items-center gap-3 border rounded-2xl px-3 py-2 shadow-sm ${lang === "ar" ? "flex-row-reverse" : ""}`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <Search
                className="w-3.5 h-3.5"
                style={{ color: "var(--sub-text-color)" }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                dir={lang === "ar" ? "rtl" : "ltr"}
                onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: "var(--sub-text-color)" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-2xl border transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
          >
            <Bell
              className="w-4 h-4"
              style={{ color: "var(--sub-text-color)" }}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 gradient-bg rounded-full animate-pulse"></div>
          </button>
        </div>
        {/* Date and Time */}
        <div
          className="flex flex-col items-center px-4 py-2 rounded-2xl border shadow-sm"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2">
            <Clock
              className="w-3.5 h-3.5"
              style={{ color: "var(--sub-text-color)" }}
            />
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {t.time}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar
              className="w-3 h-3"
              style={{ color: "var(--sub-text-color)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--sub-text-color)" }}
            >
              {t.date}
            </span>
          </div>
        </div>
        {/* Profile Section */}
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-2 transition-all duration-200 cursor-pointer group"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-color)",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
        >
          <div
            className="w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-200"
            style={{ borderColor: "var(--border-color)" }}
          >
            <img
              src={AvatarIcon}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <h3
              className="text-sm font-bold transition-colors duration-200"
              style={{ color: "var(--text-color)" }}
            >
              {t.profileName}
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--sub-text-color)" }}
            >
              {t.role}
            </p>
          </div>
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
            style={{ color: "var(--sub-text-color)" }}
          />
        </div>
      </div>
      {/* Mobile Right Section - Toggle Button */}
      <div className="min-[901px]:hidden" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="p-2.5 rounded-2xl border transition-all duration-200"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-color)",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
        >
          {isMobileMenuOpen ? (
            <X
              className="w-5 h-5 transition-transform duration-200"
              style={{ color: "var(--text-color)" }}
            />
          ) : (
            <Menu
              className="w-5 h-5 transition-transform duration-200"
              style={{ color: "var(--text-color)" }}
            />
          )}
        </button>
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-full left-4 right-4 mt-2 border shadow-xl rounded-2xl p-4 z-50"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="space-y-4">
              {/* Mobile Search */}
              <div
                className="flex items-center gap-3 border rounded-2xl px-3 py-2"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Search
                  className="w-4 h-4"
                  style={{ color: "var(--sub-text-color)" }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                  style={{ color: "var(--text-color)" }}
                />
              </div>
              {/* Mobile Status and Language */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: "var(--hover-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--accent-color)" }}
                  >
                    {t.online}
                  </span>
                </div>
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-color)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--hover-color)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--bg-color)"}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {lang === "ar" ? "عربي" : "English"}
                  </span>
                  <Globe
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--sub-text-color)" }}
                  />
                </button>
              </div>
              {/* Mobile Profile */}
              <div
                className="flex items-center gap-3 border rounded-2xl px-4 py-3"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-color)",
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={AvatarIcon}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {t.profileName}
                  </h3>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--sub-text-color)" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
