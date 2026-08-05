import React, { useState } from "react";
import { User } from "../types";
import {
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Sparkles,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    if (tab === "profile" && !user) {
      setActiveTab("auth");
    } else {
      setActiveTab(tab);
    }

    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between gap-4 shadow-sm">

      {/* Left Side */}
      <div className="flex items-center gap-3">

        {/* Dark Mode Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-sm hover:bg-slate-100 transition"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <div
          onClick={() => handleNavClick("dashboard")}
          className="cursor-pointer flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#622569] to-[#9b51e0] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#622569]">
                IET CONNECT
              </span>

              <span className="px-2 py-0.5 text-[9px] bg-[#622569]/10 rounded">
                PORTAL
              </span>
            </div>

            <p className="hidden sm:block text-[10px] text-slate-500">
              Institution of Engineering and Technology
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members, projects, events..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#9b51e0]"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {user ? (
          <>
            <button
              onClick={() => handleNavClick("announcements")}
              className="relative p-2 rounded-xl border hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 border-l pl-3">

              <button
                onClick={() => handleNavClick("profile")}
                className="flex items-center gap-2 hover:bg-slate-100 rounded-xl p-2"
              >
                <img
                  src={
                    user.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  }
                  className="w-8 h-8 rounded-lg object-cover"
                  alt={user.username}
                />

                <div className="hidden sm:block text-left">

                  <div className="flex items-center gap-1">

                    <span className="text-sm font-semibold">
                      {user.username}
                    </span>

                    {user.role === "lead" && (
                      <ShieldCheck className="w-4 h-4 text-[#622569]" />
                    )}

                  </div>

                  <p className="text-xs text-slate-400">
                    {user.institution.split("-")[0]}
                  </p>

                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>

            </div>
          </>
        ) : (
          <button
            onClick={() => handleNavClick("auth")}
            className="bg-[#622569] text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[72px] bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 w-72 h-full bg-white shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="space-y-2">

              <button
                onClick={() => handleNavClick("dashboard")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick("events")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Events
              </button>

              <button
                onClick={() => handleNavClick("projects")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Projects
              </button>

              <button
                onClick={() => handleNavClick("opportunities")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Opportunities
              </button>

              <button
                onClick={() => handleNavClick("resources")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Resources
              </button>

              <button
                onClick={() => handleNavClick("members")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Members
              </button>

              <button
                onClick={() => handleNavClick("announcements")}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
              >
                Announcements
              </button>

              {user && (
                <button
                  onClick={() => handleNavClick("profile")}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-100"
                >
                  Profile
                </button>
              )}

            </div>

            <div className="mt-8">

              {user ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white py-3 rounded-xl"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick("auth")}
                  className="w-full bg-[#622569] text-white py-3 rounded-xl"
                >
                  Sign In
                </button>
              )}

            </div>

          </div>
        </div>
      )}
    </header>
  );
};