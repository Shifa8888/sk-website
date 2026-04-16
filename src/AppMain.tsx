// MAIN APP
export default function App() {
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [members, setMembers] = useState<Member[]>(generateInitialMembers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<number[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMembers = useMemo(() => {
    setCurrentPage(1);
    return members.filter(m => {
      const s = searchTerm.toLowerCase();
      return (m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s))
        && (filterPlan === 'All' || m.plan === filterPlan)
        && (filterStatus === 'All' || m.status === filterStatus);
    });
  }, [members, searchTerm, filterPlan, filterStatus]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const monthlyRevenue = members.filter(m => m.status === 'Active').reduce((s, m) => s + planPrice[m.plan], 0);

  const handleLogin = (email: string) => setAuth({ isAuthenticated: true, user: { email, name: 'Admin User' } });
  const handleLogout = () => { setAuth({ isAuthenticated: false, user: null }); setIsSidebarOpen(false); };

  const deleteMember = (id: string) => {
    if (confirm('Remove this member?')) setMembers(prev => prev.filter(m => m.id !== id));
  };

  const saveMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Member> = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      plan: fd.get('plan') as Member['plan'],
      status: fd.get('status') as Member['status'],
    };
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
    } else {
      setMembers(prev => [{ ...data as Member, id: Math.random().toString(36).substr(2, 9), joinDate: new Date().toISOString().split('T')[0] }, ...prev]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  if (!auth.isAuthenticated) return <Login onLogin={handleLogin} />;

  const stats = [
    { label: 'Total Members', value: members.length, icon: Users, color: 'text-blue-400' },
    { label: 'Active Members', value: members.filter(m => m.status === 'Active').length, icon: Activity, color: 'text-emerald-400' },
    { label: 'Premium & VIP', value: members.filter(m => m.plan !== 'Basic').length, icon: Crown, color: 'text-orange-400' },
    { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-400' },
  ];

  return (
    <div className="flex h-screen bg-[#060606] text-zinc-100 overflow-hidden relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-all duration-300",
        "w-64",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="text-white w-5 h-5" />
            </div>
            <span className={cn("font-black text-lg tracking-tight whitespace-nowrap lg:hidden", isSidebarOpen && "block")}>
              SK <span className="text-orange-500">Fitness</span>
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Users, label: 'Members', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
              active ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
            )}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn("text-sm font-medium lg:hidden", isSidebarOpen && "block")}>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800/80 space-y-1">
          <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/40 mb-2 lg:hidden", isSidebarOpen && "flex")}>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{auth.user?.name}</p>
              <p className="text-xs text-zinc-500 truncate">{auth.user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn("text-sm font-medium lg:hidden", isSidebarOpen && "block")}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0 w-full">
        {/* Header */}
        <header className="sticky top-0 bg-[#060606]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-white">Member Management</h2>
              <p className="text-xs text-zinc-500">SK Fitness Portal</p>
            </div>
            <span className="sm:hidden font-black text-base">SK <span className="text-orange-500">Fitness</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(o => !o)} className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                <Bell className="w-5 h-5" />
                {readNotifs.length < NOTIFICATIONS.length && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />}
              </button>
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                        <div>
                          <h4 className="text-sm font-bold text-white">Notifications</h4>
                          <p className="text-xs text-zinc-500">{NOTIFICATIONS.length - readNotifs.length} unread</p>
                        </div>
                        <button onClick={() => setReadNotifs(NOTIFICATIONS.map(n => n.id))} className="text-xs text-orange-400 hover:text-orange-300 font-semibold">Mark all read</button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                        {NOTIFICATIONS.map(n => {
                          const isRead = readNotifs.includes(n.id);
                          return (
                            <button key={n.id} onClick={() => setReadNotifs(r => r.includes(n.id) ? r : [...r, n.id])}
                              className={cn("w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors", !isRead && "bg-orange-500/5")}>
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", n.iconBg)}>
                                <n.icon className={cn("w-4 h-4", n.iconColor)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-sm font-semibold", isRead ? "text-zinc-400" : "text-white")}>{n.title}</p>
                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-zinc-600 mt-1">{n.time}</p>
                              </div>
                              {!isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <span className="text-sm font-bold text-orange-400">A</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-800">
                    <s.icon className={cn("w-[18px] h-[18px]", s.color)} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/40 transition-all" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[120px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer">
                  <option value="All">All Plans</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="relative flex-1 min-w-[120px]">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none appearance-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95 text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Member</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/30">
                    {['Member', 'Status', 'Plan', 'Phone', 'Joined', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider last:text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <AnimatePresence mode="popLayout">
                    {paginatedMembers.map(member => (
                      <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -10 }}
                        className="hover:bg-zinc-800/25 transition-colors group">
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
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                            member.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" :
                            member.status === 'Pending' ? "bg-amber-500/10 text-amber-400" : "bg-zinc-700/50 text-zinc-400")}>
                            {member.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                            {member.status === 'Pending' && <Clock className="w-3 h-3" />}
                            {member.status === 'Inactive' && <XCircle className="w-3 h-3" />}
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                            member.plan === 'VIP' ? "bg-orange-500/10 text-orange-400" :
                            member.plan === 'Premium' ? "bg-purple-500/10 text-purple-400" : "bg-zinc-700/50 text-zinc-400")}>
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
                            <button onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                              className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteMember(member.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all">
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
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-800 rounded-2xl mb-3">
                  <Search className="w-6 h-6 text-zinc-600" />
                </div>
                <h3 className="text-base font-bold">No members found</h3>
                <p className="text-zinc-500 mt-1 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
            <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Showing <span className="text-zinc-300 font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredMembers.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)}</span> of <span className="text-zinc-300 font-medium">{filteredMembers.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-zinc-400 px-1">{currentPage} / {totalPages || 1}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                  className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden space-y-3">
            {paginatedMembers.length === 0 && (
              <div className="py-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
                <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-bold">No members found</p>
                <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters</p>
              </div>
            )}
            {paginatedMembers.map(member => (
              <MemberCard key={member.id} member={member}
                onEdit={() => { setEditingMember(member); setIsModalOpen(true); }}
                onDelete={() => deleteMember(member.id)} />
            ))}
            {filteredMembers.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-zinc-500">{filteredMembers.length} members</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-zinc-400">{currentPage} / {totalPages || 1}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                    className="p-1.5 bg-zinc-800 rounded-lg border border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.2 }}
              className="relative w-full sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                <div>
                  <h3 className="text-base font-black">{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{editingMember ? 'Update member details' : 'Fill in the details below'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={saveMember} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input name="name" required defaultValue={editingMember?.name} placeholder="e.g. John Doe"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input name="email" type="email" required defaultValue={editingMember?.email} placeholder="email@example.com"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input name="phone" defaultValue={editingMember?.phone} placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Plan</label>
                    <select name="plan" defaultValue={editingMember?.plan || 'Basic'}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer">
                      <option value="Basic">Basic ($29/mo)</option>
                      <option value="Premium">Premium ($59/mo)</option>
                      <option value="VIP">VIP ($99/mo)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select name="status" defaultValue={editingMember?.status || 'Active'}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all active:scale-95 text-sm shadow-lg shadow-orange-500/20">
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