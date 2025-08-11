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
    <nav className="w-full h-20 bg-white/98 backdrop-blur-xl shadow-lg shadow-gray-100/50 border-b border-gray-50 flex items-center justify-between  md:px-5 sticky top-0 z-50 transition-all duration-300">
      {/* Desktop Left Section - Greeting and Status */}
      <div className="flex items-center gap-6 md:gap-10 max-[900px]:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#E596C5] via-[#D4A5C8] to-[#B87AA3] bg-clip-text text-transparent drop-shadow-sm">
              {t.greeting}
            </span>
            <span className="text-slate-700 font-semibold drop-shadow-sm">
              {t.user}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-5 md:gap-7">
          {/* Online Status */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100/70 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-sm font-semibold text-green-700">
              {t.online}
            </span>
          </div>

          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 group shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                {lang === "ar" ? "عربي" : "English"}
              </span>
              <img
                src={LanguageIcon}
                alt="Language"
                className="w-4 h-4 opacity-70 group-hover:opacity-90 transition-all duration-300"
              />
              <svg
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${
                  langOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {langOpen && (
              <div
                className={`absolute top-full mt-3 ${popSideLang} w-44 bg-white/98 border border-gray-100 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl z-50 animate-in slide-in-from-top-2 duration-300`}
              >
                <button
                  onClick={() => {
                    setLang("en");
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm hover:bg-gray-50 transition-all duration-200 ${
                    lang === "en"
                      ? "font-bold text-slate-900 bg-gray-50 border-l-4 border-[#E596C5]"
                      : "text-slate-700 font-medium"
                  }`}
                >
                  {t.english}
                </button>
                <button
                  onClick={() => {
                    setLang("ar");
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm hover:bg-gray-50 transition-all duration-200 ${
                    lang === "ar"
                      ? "font-bold text-slate-900 bg-gray-50 border-l-4 border-[#E596C5]"
                      : "text-slate-700 font-medium"
                  }`}
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
          <span className="text-slate-700 font-semibold">{t.user}</span>
        </h1>
      </div>

      {/* Desktop Right Section */}
      <div className="flex items-center gap-5 md:gap-7 max-[900px]:hidden">
        {/* Search and Notifications */}
        <div
          ref={searchRef}
          className={`flex items-center gap-3 ${
            lang === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {/* Toggle icon */}
          <button
            onClick={() => setIsSearchOpen((v) => !v)}
            aria-expanded={isSearchOpen}
            className="group relative p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={SearchIcon}
              alt="Search"
              className="w-5 h-5 opacity-70 group-hover:opacity-90 transition-all duration-300"
            />
          </button>

          {/* Inline expanding search field */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${isSearchOpen ? "w-72 lg:w-96" : "w-0"}`}
          >
            <div
              className={`flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
                lang === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <img src={SearchIcon} alt="" className="w-4 h-4 opacity-60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                dir={lang === "ar" ? "rtl" : "ltr"}
                onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
                className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder-slate-500 font-medium"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 hover:text-slate-700 transition-all duration-200"
                aria-label="Close search"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <button className="group relative p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <img
              src={NotificationIcon}
              alt="Notification"
              className="w-5 h-5 opacity-70 group-hover:opacity-90 transition-all duration-300"
            />
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gradient-to-r from-[#E596C5] to-[#B87AA3] rounded-full animate-pulse shadow-sm"></div>
          </button>
        </div>

        {/* Date and Time */}
        <div className="flex flex-col items-center px-5 py-3 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <img src={ClockIcon} alt="Clock" className="w-4 h-4 opacity-70" />
            <span className="text-base font-bold text-slate-900">{t.time}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <img src={DateIcon} alt="Date" className="w-3.5 h-3.5 opacity-60" />
            <span className="text-xs font-semibold text-slate-600">
              {t.date}
            </span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 px-5 py-3 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:scale-105">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300 shadow-sm">
            <img
              src={AvatarIcon}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-300">
              Sara Wael
            </h3>
            <p className="text-xs text-slate-500 font-medium">Role</p>
          </div>

          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-300 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Mobile Right Section - Toggle Button */}
      <div className="min-[901px]:hidden" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="p-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
          aria-label="Toggle menu"
        >
          <svg
            className={`w-6 h-6 text-slate-700 transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl mx-5 p-6 z-50 animate-in slide-in-from-top-3 duration-300">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300">
                <img src={SearchIcon} alt="" className="w-4 h-4 opacity-60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            {/* Mobile Status and Language */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100 shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">
                  {t.online}
                </span>
              </div>

              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md"
              >
                <span className="text-sm font-semibold text-slate-700">
                  {lang === "ar" ? "عربي" : "English"}
                </span>
                <img
                  src={LanguageIcon}
                  alt="Language"
                  className="w-4 h-4 opacity-70"
                />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between mb-6">
              <button className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                <img
                  src={NotificationIcon}
                  alt="Notification"
                  className="w-5 h-5 opacity-70"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Notifications
                </span>
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#E596C5] to-[#B87AA3] rounded-full"></div>
              </button>

              <div className="flex flex-col items-center px-4 py-3 bg-gray-50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-1.5">
                  <img
                    src={ClockIcon}
                    alt="Clock"
                    className="w-3.5 h-3.5 opacity-70"
                  />
                  <span className="text-sm font-bold text-slate-900">
                    {t.time}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <img
                    src={DateIcon}
                    alt="Date"
                    className="w-3 h-3 opacity-60"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    {t.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Profile */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105">
              <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm">
                <img
                  src={AvatarIcon}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <h3 className="text-sm font-bold text-slate-900">Sara Wael</h3>
                <p className="text-xs text-slate-500 font-medium">Role</p>
              </div>
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
