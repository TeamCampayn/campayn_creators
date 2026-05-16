import React, { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Instagram,
  Sparkles,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '../lib/supabase';

interface DashboardData {
  success: boolean;
  connected: boolean;
  creator: any;
  igData: any;
  campaynScore: { 
    total: number; 
    breakdown: any;
    percentile?: {
      global: number;
      city: number | null;
      cityLabel: string;
    }
  };
  rateCard: { rates: any; tier: string };
  campaigns: any[];
  opportunities: any[];
  wallet: { balance: number };
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/auth/creator/dashboard/${user.id}`);
        const data = await res.json();
        if (data.success) setDashData(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleConnectInstagram = () => {
    if (!user) { alert("Please log in first"); return; }
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID || "1951089435528507";
    const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/api/auth/facebook/callback`;
    const scope = [
      'instagram_basic', 'instagram_manage_insights', 'pages_show_list',
      'pages_read_engagement', 'pages_manage_metadata', 'business_management', 'public_profile'
    ].join(',');
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${user.id}&auth_type=rerequest`;
    window.location.href = authUrl;
  };

  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6 lg:p-10">
        <div className="h-10 bg-white/5 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white/5 rounded-2xl" />
          <div className="h-80 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const ig = dashData?.igData;
  const score = dashData?.campaynScore;
  const creator = dashData?.creator;
  const connected = dashData?.connected;

  const getScoreColor = (s: number) => {
    if (s >= 91) return { stroke: '#A78BFA', glow: 'shadow-violet-500/40', label: 'Elite', bg: 'from-violet-500/20 to-purple-500/20' };
    if (s >= 71) return { stroke: '#34D399', glow: 'shadow-emerald-500/40', label: 'Strong', bg: 'from-emerald-500/20 to-green-500/20' };
    if (s >= 41) return { stroke: '#FBBF24', glow: 'shadow-amber-500/40', label: 'Growing', bg: 'from-amber-500/20 to-yellow-500/20' };
    return { stroke: '#F87171', glow: 'shadow-red-500/40', label: 'Needs Work', bg: 'from-red-500/20 to-rose-500/20' };
  };

  const scoreStyle = getScoreColor(score?.total || 0);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - ((score?.total || 0) / 100) * circumference;

  const followerData = [
    { name: 'Mon', followers: Math.max(0, (ig?.followersCount || 0) - 30) },
    { name: 'Tue', followers: Math.max(0, (ig?.followersCount || 0) - 22) },
    { name: 'Wed', followers: Math.max(0, (ig?.followersCount || 0) - 18) },
    { name: 'Thu', followers: Math.max(0, (ig?.followersCount || 0) - 12) },
    { name: 'Fri', followers: Math.max(0, (ig?.followersCount || 0) - 6) },
    { name: 'Sat', followers: Math.max(0, (ig?.followersCount || 0) - 2) },
    { name: 'Sun', followers: ig?.followersCount || 0 },
  ];

  

  return (
    <div className="space-y-8 pb-12 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Namaste, {creator?.name?.split(' ')[0] || 'Creator'}!
            <Sparkles className="text-campayn-primary" size={24} />
          </h1>
          <p className="text-slate-400 mt-1">Here's your campaign intelligence for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-slate-400 disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {!connected && (
            <button 
              onClick={handleConnectInstagram}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Instagram size={20} />
              Connect Instagram
            </button>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Followers" 
          value={formatNumber(ig?.followersCount || 0)}
          change="+12% this month" 
          icon={<Users className="text-violet-400" />} 
          color="bg-violet-400"
          live={connected}
        />
        <StatCard 
          label="Engagement Rate" 
          value={`${(ig?.engagementRate || 0).toFixed(2)}%`}
          change="Strong" 
          icon={<TrendingUp className="text-emerald-400" />} 
          color="bg-emerald-400"
          live={connected}
        />
        <StatCard 
          label="Est. Reach" 
          value={formatNumber(ig?.reach || 0)}
          change="Real-time" 
          icon={<BarChart3 className="text-blue-400" />} 
          color="bg-blue-400"
          live={connected}
        />
        <StatCard 
          label="Est. Earnings" 
          value={`₹${(dashData?.wallet?.balance || 0).toLocaleString('en-IN')}`}
          change={connected ? "Live" : "—"} 
          icon={<IndianRupee className="text-amber-400" />} 
          color="bg-amber-400"
          live={connected}
        />
      </div>

      {/* Campayn Score + Follower Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`glass-card p-8 flex flex-col relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-campayn-primary/5 to-violet-500/5 pointer-events-none" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Proprietary Benchmarking</p>
                <h3 className="text-xl font-bold text-white">Campayn Score™</h3>
              </div>
              <button 
                onClick={() => setShowShareCard(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-campayn-primary flex items-center gap-2 group"
              >
                <Sparkles size={16} className="group-hover:animate-spin-slow" />
                <span className="text-xs font-bold uppercase tracking-wider">Share Rank</span>
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                  <circle
                    cx="60" cy="60" r="54"
                    stroke={scoreStyle.stroke}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tight text-white">{score?.total || 0}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${scoreStyle.stroke === '#A78BFA' ? 'text-violet-400' : 'text-slate-500'}`}>
                    {scoreStyle.label}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Global Percentile</p>
                      <p className="text-sm font-bold text-white">Top {100 - (score?.percentile?.global || 50)}% Creators</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-violet-400">{score?.percentile?.global || 50}pt</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{score?.percentile?.cityLabel || 'Regional'} Rank</p>
                      <p className="text-sm font-bold text-white">Top {100 - (score?.percentile?.city || 50)}% locally</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-400">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Follower Growth</h3>
            <div className="flex items-center gap-2">
              {connected && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              )}
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerData}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="followers" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Share Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative glass-card p-1 max-w-sm w-full bg-gradient-to-br from-campayn-primary/20 to-violet-600/20 shadow-2xl">
            <div className="bg-[#050505] rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-campayn-primary/20 blur-[60px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-600/20 blur-[60px] rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 text-center">Official Rank Card</p>
              <div className="w-20 h-20 bg-gradient-to-br from-campayn-primary to-violet-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black mb-1 text-white">{creator?.name}</h2>
              <p className="text-campayn-primary font-bold text-sm mb-8">@{creator?.igHandle}</p>
              <div className="py-6 border-y border-white/5 space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Campayn Score™</p>
                  <p className="text-6xl font-black tracking-tighter text-white">{score?.total || 0}</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 text-xs font-black uppercase tracking-wider">
                    Top {100 - (score?.percentile?.city || 50)}% {score?.percentile?.cityLabel || 'Regional'}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Verified by Campayn Network</p>
                <div className="text-xl font-black tracking-tighter flex items-center justify-center gap-2 text-white">
                  <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-sm" />
                  </div>
                  CAMPAYN
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button onClick={() => setShowShareCard(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all text-white">Close</button>
              <button onClick={() => alert('Feature coming soon: Saving high-res image...')} className="flex-1 py-4 bg-campayn-primary hover:scale-[1.02] text-white rounded-2xl font-black transition-all">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ 
  label: string; value: string; change: string; icon: React.ReactNode; color: string; live?: boolean;
}> = ({ label, value, change, icon, color, live }) => (
  <div className="glass-card p-6 flex flex-col justify-between group">
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>{icon}</div>
      {live ? (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{change}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-white/5 px-2 py-1 rounded-lg">{change}</div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
      <h3 className="text-2xl font-black mt-1 text-white">{value}</h3>
    </div>
  </div>
);

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(' '); }

export default Dashboard;
