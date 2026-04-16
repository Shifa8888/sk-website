import React, { useState, useMemo } from 'react';
import {
  Users,
  LayoutDashboard,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Dumbbell,
  Mail,
  Lock,
  Menu,
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Crown,
  Activity,
  DollarSign,
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

const avatarColors = [
  'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500',
  'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// --- STAT CARD ---
const StatCard = ({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors"
  >
    <div className="flex items-center justify-between">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color + '/15')}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" /> +12%
      </span>
    </div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-sm text-zinc-500 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-zinc-600 mt-1">{sub}</div>}
    </div>
  </motion.div>
);

// --- LOGIN ---
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-orange-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-5">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                <Dumbbell className="text-white w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              SK <span className="text-orange-500">Fitness</span>
            </h1>
            <p className="text-zinc-500 mt-1.5 text-sm">Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/70 border border-zinc-700/80 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/50 outline-none transition-all text-sm"
                  placeholder="admin@skfitness.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/70 border border-zinc-700/80 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/50 outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Dashboard</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs text-zinc-500">Demo: admin@skfitness.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [members, setMembers] = useState<Member[]>(generateInitialMembers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMembers = useMemo(() => {
    setCurrentPage(1);
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'All' || m.plan === filterPlan;
      const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [members, searchTerm, filterPlan, filterStatus]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const monthlyRevenue = members
    .filter(m => m.status === 'Active')
    .reduce((sum, m) => sum + planPrice[m.plan], 0);

  const handleLogin = (email: string) => setAuth({ isAuthenticated: true, user: { email, name: 'Admin User' } });
  const handleLogout = () => setAuth({ isAuthenticated: false, user: null });

  const deleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const saveMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const memberData: Partial<Member> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      plan: formData.get('plan') as Member['plan'],
      status: formData.get('status') as Member['status'],
    };
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...memberData } : m));
    } else {
      setMembers([{ ...memberData as Member, id: Math.random().toString(36).substr(2, 9), joinDate: new Date().toISOString().split('T')[0] }, ...members]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (!auth.isAuthenticated) return <Login onLogin={handleLogin} />;

  const stats = [
    { label: 'Total Members', value: members.length, icon: Users, color: 'text-blue-400', sub: 'All registered' },
    { label: 'Active Members', value: members.filter(m => m.status === 'Active').length, icon: Activity, color: 'text-emerald-400', sub: 'Currently active' },
    { label: 'Premium & VIP', value: members.filter(m => m.plan !== 'Basic').length, icon: Crown, color: 'text-orange-400', sub: 'Upgraded plans' },
    { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-400', sub: 'Active members only' },
  ];

  return (
    <div className="flex h-screen bg-[#060606] text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-zinc-950 border-r border-zinc-800/80 transition-all duration-300 z-50 flex flex-col flex-shrink-0",
        isSidebarOpen ? "w-64" : "w-[72px]"
      )}>
        {/* Logo */}
        <div className={cn("p-5 flex items-center gap-3 border-b border-zinc-800/80", !isSidebarOpen && "justify-center")}>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Dumbbell className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-black text-lg tracking-tight whitespace-nowrap">
              SK <span className="text-orange-500">Fitness</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Users, label: 'Members', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
              !isSidebarOpen && "justify-center",
              active
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
            )}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-zinc-800/80 space-y-1">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/40 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{auth.user?.name}</p>
                <p className="text-xs text-zinc-500 truncate">{auth.user?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <header className="sticky top-0 bg-[#060606]/90 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white">Member Management</h2>
              <p className="text-xs text-zinc-500">Manage your gym members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center ml-1">
              <span className="text-sm font-bold text-orange-400">A</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-800")}>
                    <s.icon className={cn("w-4.5 h-4.5", s.color)} style={{ width: 18, height: 18 }} />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                </div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
                >
                  <option value="All">All Plans</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95 text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/30">
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Member</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Plan</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <AnimatePresence mode="popLayout">
                    {paginatedMembers.map((member) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="hover:bg-zinc-800/25 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", getAvatarColor(member.name))}>
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{member.name}</p>
                              <p className="text-xs text-zinc-500">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                            member.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" :
                            member.status === 'Pending' ? "bg-amber-500/10 text-amber-400" :
                            "bg-zinc-700/50 text-zinc-400"
                          )}>
                            {member.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                            {member.status === 'Pending' && <Clock className="w-3 h-3" />}
                            {member.status === 'Inactive' && <XCircle className="w-3 h-3" />}
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                            member.plan === 'VIP' ? "bg-orange-500/10 text-orange-400" :
                            member.plan === 'Premium' ? "bg-purple-500/10 text-purple-400" :
                            "bg-zinc-700/50 text-zinc-400"
                          )}>
                            {member.plan === 'VIP' && <Crown className="w-3 h-3" />}
                            {member.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-zinc-400">{member.phone}</td>
                        <td className="px-5 py-3.5 text-sm text-zinc-500">
                          {new Date(member.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                              className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMember(member.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-2xl mb-4">
                  <Search className="w-7 h-7 text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold">No members found</h3>
                <p className="text-zinc-500 mt-1 text-sm">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Showing <span className="text-zinc-300 font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredMembers.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)}</span> of <span className="text-zinc-300 font-medium">{filteredMembers.length}</span> members
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-zinc-400 px-2">{currentPage} / {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {editingMember ? 'Edit Member' : 'Add New Member'}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{editingMember ? 'Update member details' : 'Fill in the details below'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveMember} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    name="name" required defaultValue={editingMember?.name}
                    placeholder="e.g. John Doe"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    name="email" type="email" required defaultValue={editingMember?.email}
                    placeholder="email@example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input
                      name="phone" defaultValue={editingMember?.phone}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Plan</label>
                    <select
                      name="plan" defaultValue={editingMember?.plan || 'Basic'}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Basic">Basic ($29/mo)</option>
                      <option value="Premium">Premium ($59/mo)</option>
                      <option value="VIP">VIP ($99/mo)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    name="status" defaultValue={editingMember?.status || 'Active'}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all active:scale-95 text-sm shadow-lg shadow-orange-500/20"
                  >
                    {editingMember ? 'Update Member' : 'Create Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
