import React, { useEffect, useRef, useState } from "react";
import LanguageIcon from "../../../public/assets/navbar/world.svg";
import SearchIcon from "../../../public/assets/navbar/search.svg";
import ClockIcon from "../../../public/assets/navbar/clock.svg";
import DateIcon from "../../../public/assets/navbar/date.svg";
import NotificationIcon from "../../../public/assets/navbar/notfi.svg";
import AvatarIcon from "../../../public/assets/navbar/Avatar.png";

const NavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [langOpen, setLangOpen] = useState(false);

  const searchRef = useRef(null);
  const langRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const inputRef = useRef(null);

  const t = {
    en: {
      greeting: "Good Morning",
      user: ", Adam",
      online: "Online",
      arabic: "Arabic",
      english: "English",
      searchPlaceholder: "Search...",
      date: "Mar,07,2025",
      time: "3:00 PM",
    },
    ar: {
      greeting: "صباح الخير",
      user: "، آدم",
      online: "متصل",
      arabic: "العربية",
      english: "الإنجليزية",
      searchPlaceholder: "ابحث...",
      date: "مارس، 07، 2025",
      time: "3:00 م",
    },
  }[lang];

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [isSearchOpen]);

  const popSideLang = lang === "ar" ? "left-0" : "right-0";

  return (
    <nav
      className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-200/50 relative z-40"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Desktop Left Section - Greeting and Status */}
      <div className="flex items-center gap-6 max-[900px]:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#E596C5] via-[#D4A5C8] to-[#B87AA3] bg-clip-text text-transparent">
              {t.greeting}
            </span>
            <span
              className="font-semibold"
              style={{ color: "var(--text-color)" }}
            >
              {t.user}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* Online Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100/70 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700">
              {t.online}
            </span>
          </div>

          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100/50 transition-all duration-200 border border-gray-200 group"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--hover-color)",
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-color)" }}
              >
                {lang === "ar" ? "عربي" : "English"}
              </span>
              <img
                src={LanguageIcon}
                alt="Language"
                className="w-3.5 h-3.5 opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  langOpen ? "rotate-180" : ""
                }`}
                style={{ color: "var(--sub-text-color)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {langOpen && (
              <div
                className={`absolute top-full mt-2 ${popSideLang} w-36 border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50`}
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <button
                  onClick={() => {
                    setLang("en");
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                    lang === "en"
                      ? "font-bold border-l-3 border-[#E596C5]"
                      : "font-medium"
                  }`}
                  style={{
                    color: "var(--text-color)",
                    backgroundColor:
                      lang === "en" ? "var(--hover-color)" : "transparent",
                  }}
                >
                  {t.english}
                </button>
                <button
                  onClick={() => {
                    setLang("ar");
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${
                    lang === "ar"
                      ? "font-bold border-l-3 border-[#E596C5]"
                      : "font-medium"
                  }`}
                  style={{
                    color: "var(--text-color)",
                    backgroundColor:
                      lang === "ar" ? "var(--hover-color)" : "transparent",
                  }}
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
          <span className="bg-gradient-to-r from-[#E596C5] to-[#B87AA3] bg-clip-text text-transparent">
            {t.greeting}
          </span>
          <span
            className="font-semibold"
            style={{ color: "var(--text-color)" }}
          >
            {t.user}
          </span>
        </h1>
      </div>

      {/* Desktop Right Section */}
      <div className="flex items-center gap-4 max-[900px]:hidden">
        {/* Search and Notifications */}
        <div
          ref={searchRef}
          className={`flex items-center gap-3 ${
            lang === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            className="p-2.5 rounded-xl hover:bg-gray-100/50 border border-gray-200 transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--hover-color)",
            }}
          >
            <img src={SearchIcon} alt="Search" className="w-4 h-4 opacity-70" />
          </button>

          {/* Expanding Search Field */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${isSearchOpen ? "w-64" : "w-0"}`}
          >
            <div
              className={`flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2 shadow-sm ${
                lang === "ar" ? "flex-row-reverse" : ""
              }`}
              style={{
                backgroundColor: "var(--bg-color)",
                borderColor: "var(--border-color)",
              }}
            >
              <img src={SearchIcon} alt="" className="w-3.5 h-3.5 opacity-60" />
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
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "var(--sub-text-color)" }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl hover:bg-gray-100/50 border border-gray-200 transition-all duration-200"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--hover-color)",
            }}
          >
            <img
              src={NotificationIcon}
              alt="Notification"
              className="w-4 h-4 opacity-70"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#E596C5] to-[#B87AA3] rounded-full animate-pulse"></div>
          </button>
        </div>

        {/* Date and Time */}
        <div
          className="flex flex-col items-center px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={ClockIcon}
              alt="Clock"
              className="w-3.5 h-3.5 opacity-70"
            />
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {t.time}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <img src={DateIcon} alt="Date" className="w-3 h-3 opacity-60" />
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
          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-2 hover:bg-gray-100/50 transition-all duration-200 cursor-pointer group"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--hover-color)",
          }}
        >
          <div
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200 transition-all duration-200"
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
              Sara Wael
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--sub-text-color)" }}
            >
              Role
            </p>
          </div>

          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
            style={{ color: "var(--sub-text-color)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Mobile Right Section - Toggle Button */}
      <div className="min-[901px]:hidden" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="p-2.5 rounded-xl border border-gray-200 transition-all duration-200"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--hover-color)",
          }}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
            style={{ color: "var(--text-color)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-full left-4 right-4 mt-2 border border-gray-200 shadow-xl rounded-2xl p-4 z-50"
            style={{
              backgroundColor: "var(--bg-color)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="space-y-4">
              {/* Mobile Search */}
              <div
                className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2"
                style={{
                  backgroundColor: "var(--bg-color)",
                  borderColor: "var(--border-color)",
                }}
              >
                <img src={SearchIcon} alt="" className="w-4 h-4 opacity-60" />
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
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-700">
                    {t.online}
                  </span>
                </div>

                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--hover-color)",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-color)" }}
                  >
                    {lang === "ar" ? "عربي" : "English"}
                  </span>
                  <img
                    src={LanguageIcon}
                    alt="Language"
                    className="w-3.5 h-3.5 opacity-70"
                  />
                </button>
              </div>

              {/* Mobile Profile */}
              <div
                className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--hover-color)",
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
                    Sara Wael
                  </h3>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--sub-text-color)" }}
                  >
                    Role
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
