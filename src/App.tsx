import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users, LayoutDashboard, LogOut, Search, Plus, Trash2, Edit2,
  CheckCircle, XCircle, Clock, Filter, Dumbbell, Mail, Lock,
  Menu, X, TrendingUp, ChevronLeft, ChevronRight, Bell,
  Crown, Activity, DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { Member, AuthState } from './types';

const ITEMS_PER_PAGE = 10;

const generateInitialMembers = (): Member[] => {
  const plans: Member['plan'][] = ['Basic', 'Premium', 'VIP'];
  const statuses: Member['status'][] = ['Active', 'Inactive', 'Pending'];
  const names = ['James Wilson', 'Sarah Parker', 'Mike Ross', 'Rachel Green', 'Harvey Specter', 'Donna Paulsen', 'Louis Litt', 'Jessica Pearson'];
  return Array.from({ length: 120 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `${names[i % names.length]} ${i + 1}`,
    email: `member${i + 1}@example.com`,
    phone: `+1 (555) 000-${(i + 1000).toString().slice(1)}`,
    plan: plans[i % 3],
    status: statuses[i % 3],
    joinDate: new Date(2023, Math.floor(i / 10), (i % 28) + 1).toISOString().split('T')[0],
  }));
};

const planPrice: Record<Member['plan'], number> = { Basic: 29, Premium: 59, VIP: 99 };
const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-rose-500','bg-indigo-500'];
function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const NOTIFICATIONS = [
  { id: 1, title: 'New Member Joined', message: 'James Wilson just signed up for a Premium plan.', time: '2 min ago', icon: Users, iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
  { id: 2, title: 'Payment Received', message: 'Monthly subscription of $99 received from VIP member.', time: '15 min ago', icon: DollarSign, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
  { id: 3, title: 'Membership Expiring', message: '5 members have memberships expiring in 3 days.', time: '1 hour ago', icon: Clock, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
  { id: 4, title: 'New VIP Upgrade', message: 'Sarah Parker upgraded from Premium to VIP plan.', time: '3 hours ago', icon: Crown, iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400' },
  { id: 5, title: 'Inactive Members Alert', message: '12 members have been inactive for over 30 days.', time: 'Yesterday', icon: Activity, iconBg: 'bg-red-500/15', iconColor: 'text-red-400' },
];

// ─── MOBILE MEMBER CARD ───────────────────────────────────────────────────────
const MemberCard = ({ member, onEdit, onDelete }: { member: Member; onEdit: () => void; onDelete: () => void }) => (
  <div className="bg-zinc-800/40 rounded-xl p-4 flex items-start justify-between gap-3">
    <div className="flex items-start gap-3 min-w-0">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", getAvatarColor(member.name))}>
        {member.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm truncate">{member.name}</p>
        <p className="text-xs text-zinc-500 truncate">{member.email}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
            member.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" :
            member.status === 'Pending' ? "bg-amber-500/10 text-amber-400" : "bg-zinc-700/50 text-zinc-400")}>
            {member.status === 'Active' && <CheckCircle className="w-3 h-3" />}
            {member.status === 'Pending' && <Clock className="w-3 h-3" />}
            {member.status === 'Inactive' && <XCircle className="w-3 h-3" />}
            {member.status}
          </span>
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
            member.plan === 'VIP' ? "bg-orange-500/10 text-orange-400" :
            member.plan === 'Premium' ? "bg-purple-500/10 text-purple-400" : "bg-zinc-700/50 text-zinc-400")}>
            {member.plan === 'VIP' && <Crown className="w-3 h-3" />}
            {member.plan}
          </span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-1 flex-shrink-0">
      <button onClick={onEdit} className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
        <Edit2 className="w-4 h-4" />
      </button>
      <button onClick={onDelete} className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('admin@skfitness.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { onLogin(email); setIsLoading(false); }, 900);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/8 blur-[140px] rounded-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                <Dumbbell className="text-white w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              SK <span className="text-orange-500">Fitness</span>
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm">Management Portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/70 border border-zinc-700/80 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/60 outline-none transition-all text-sm"
                  placeholder="admin@skfitness.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/70 border border-zinc-700/80 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/60 outline-none transition-all text-sm"
                  placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] flex items-center justify-center mt-2">
              {isLoading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign In to Dashboard'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-zinc-500">Demo: admin@skfitness.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
