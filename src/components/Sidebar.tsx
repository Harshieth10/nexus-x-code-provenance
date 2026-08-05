import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  FolderGit2,
  Users,
  User,
  Megaphone,
  LogOut,
  Award,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events & Workshops', icon: Calendar },
    { id: 'projects', label: 'Member Projects', icon: FolderGit2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#622569] text-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-xl hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Chapter Info */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 text-purple-200 text-xs font-medium mb-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span>IET Student Chapter</span>
          </div>

          <p className="text-sm font-semibold text-white">
            {user ? user.institution : 'Connect & Collaborate'}
          </p>

          {user && (
            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <span>
                Points:{' '}
                <strong className="text-white">
                  {user.points ?? 0}
                </strong>
              </span>

              <span className="capitalize bg-white/20 px-2 py-1 rounded text-[10px]">
                {user.role}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <p className="px-3 text-[11px] uppercase tracking-wider text-purple-200">
            Main Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-white text-[#622569] font-semibold shadow'
                    : 'hover:bg-white/10 text-purple-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#622569]' : 'text-purple-200'
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {user ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('auth')}
            className="w-full py-3 rounded-xl bg-white text-[#622569] font-semibold hover:bg-slate-100"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};