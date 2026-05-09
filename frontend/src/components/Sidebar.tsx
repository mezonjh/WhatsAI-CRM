"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  Store, 
  Settings, 
  Activity,
  Phone,
  BarChart3,
  Users
} from 'lucide-react';

const navItems = [
  { name: 'نظرة عامة', href: '/', icon: LayoutDashboard },
  { name: 'ربط واتساب API', href: '/whatsapp', icon: Phone },
  { name: 'إعدادات الذكاء (Gemini)', href: '/ai', icon: Bot },
  { name: 'المحادثات المباشرة', href: '/chats', icon: MessageSquare },
  { name: 'المتاجر والبائعين', href: '/stores', icon: Store },
  { name: 'العملاء', href: '/customers', icon: Users },
  { name: 'التحليلات والتقارير', href: '/analytics', icon: BarChart3 },
  { name: 'سجلات النظام', href: '/logs', icon: Activity },
  { name: 'الإعدادات العامة', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0a0a0c] border-l border-gray-800 flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Branding section removed */}


      <nav className="flex-1 px-4 space-y-3 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href) && item.href !== '/';
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold ${
                isActive 
                  ? 'bg-gradient-to-l from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'text-gray-400 hover:bg-gray-800/80 hover:text-gray-100 hover:translate-x-1'
              }`}
            >
              <Icon size={22} className={isActive ? 'text-emerald-400' : 'text-gray-500'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800/80 bg-gray-900/20">
        <div className="flex items-center gap-4 px-4 py-3 bg-gradient-to-l from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-gray-950 font-bold text-lg shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            مُد
          </div>
          <div>
            <p className="text-sm font-bold text-white">المدير العام</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              متصل الآن
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
