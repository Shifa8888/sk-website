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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { Member, AuthState } from './types';

// --- MOCK DATA GENERATOR ---
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

// --- LOGIN COMPONENT ---
const Login = ({ onLogin }: { onLogin: (email: string) => void }) => {
  const [email, setEmail] = useState('admin@skfitness.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Dumbbell className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white font-oswald tracking-tighter uppercase">SK <span className="text-orange-500">Fitness</span></h1>
          <p className="text-zinc-400 mt-2">Management Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="admin@skfitness.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500">
            Sample: admin@skfitness.com / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN DASHBOARD ---
export default function App() {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [members, setMembers] = useState<Member[]>(generateInitialMembers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'All' || m.plan === filterPlan;
      return matchesSearch && matchesPlan;
    });
  }, [members, searchTerm, filterPlan]);

  const handleLogin = (email: string) => {
    setAuth({ isAuthenticated: true, user: { email, name: 'Admin User' } });
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

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
      const newMember: Member = {
        ...memberData as Member,
        id: Math.random().toString(36).substr(2, 9),
        joinDate: new Date().toISOString().split('T')[0],
      };
      setMembers([newMember, ...members]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className={cn(
        "bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-50 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex-shrink-0 flex items-center justify-center">
            <Dumbbell className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-oswald text-xl uppercase font-bold tracking-tight">SK <span className="text-orange-500">Fitness</span></span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <LayoutDashboard className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Members</span>}
          </button>
        </nav>

        <div className="p-3 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 bg-[#050505]/80 backdrop-blur-lg border-b border-zinc-800 px-8 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Member Management</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{auth.user?.name}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Members', value: members.length, icon: Users, color: 'text-blue-500' },
              { label: 'Active Plans', value: members.filter(m => m.status === 'Active').length, icon: CheckCircle, color: 'text-emerald-500' },
              { label: 'Pending', value: members.filter(m => m.status === 'Pending').length, icon: Clock, color: 'text-amber-500' },
              { label: 'Premium/VIP', value: members.filter(m => m.plan !== 'Basic').length, icon: Dumbbell, color: 'text-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Growth</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select 
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2.5 outline-none appearance-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="All">All Plans</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <button 
                onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add Member
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-800/50 border-b border-zinc-800">
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <AnimatePresence>
                    {filteredMembers.map((member) => (
                      <motion.tr 
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-zinc-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 font-bold text-orange-500">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{member.name}</p>
                              <p className="text-sm text-zinc-500">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            member.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" :
                            member.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                            "bg-zinc-500/10 text-zinc-400"
                          )}>
                            {member.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                            {member.status === 'Pending' && <Clock className="w-3 h-3" />}
                            {member.status === 'Inactive' && <XCircle className="w-3 h-3" />}
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={cn(
                              "font-medium",
                              member.plan === 'VIP' ? "text-orange-400" :
                              member.plan === 'Premium' ? "text-purple-400" :
                              "text-zinc-300"
                            )}>
                              {member.plan}
                            </span>
                            <span className="text-xs text-zinc-500">{member.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                              className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteMember(member.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-all"
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
              <div className="p-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-4">
                  <Search className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold">No members found</h3>
                <p className="text-zinc-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-sm text-zinc-500">
              <p>Showing {filteredMembers.length} of {members.length} members</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-zinc-800 rounded border border-zinc-700 hover:border-zinc-500 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 bg-zinc-800 rounded border border-zinc-700 hover:border-zinc-500 disabled:opacity-50" disabled>Next</button>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h3 className="text-xl font-bold uppercase tracking-tight font-oswald">
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={saveMember} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                    <input 
                      name="name"
                      required
                      defaultValue={editingMember?.name}
                      placeholder="e.g. John Doe"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email Address</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      defaultValue={editingMember?.email}
                      placeholder="email@example.com"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Phone</label>
                      <input 
                        name="phone"
                        defaultValue={editingMember?.phone}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Membership Plan</label>
                      <select 
                        name="plan"
                        defaultValue={editingMember?.plan || 'Basic'}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                      >
                        <option value="Basic">Basic ($29/mo)</option>
                        <option value="Premium">Premium ($59/mo)</option>
                        <option value="VIP">VIP ($99/mo)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Current Status</label>
                    <select 
                      name="status"
                      defaultValue={editingMember?.status || 'Active'}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all active:scale-95"
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
