import React, { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight,
  Instagram,
  Sparkles,
  Zap,
  Copy,
  Check,
  ExternalLink,
  IndianRupee,
  Eye,
  ImageIcon,
  Film,
  Layers,
  MessageCircle,
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
  campaynScore: { total: number; breakdown: any };
  rateCard: { rates: any; tier: string };
  campaigns: any[];
  opportunities: any[];
  wallet: { balance: number };
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedRate, setCopiedRate] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleCopyRate = (type: string, rate: number) => {
    navigator.clipboard.writeText(`₹${rate.toLocaleString('en-IN')} per ${type}`);
    setCopiedRate(type);
    setTimeout(() => setCopiedRate(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
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
  const rates = dashData?.rateCard;
  const creator = dashData?.creator;
  const connected = dashData?.connected;

  // Score color based on value
  const getScoreColor = (s: number) => {
    if (s >= 91) return { stroke: '#A78BFA', glow: 'shadow-violet-500/40', label: 'Elite', bg: 'from-violet-500/20 to-purple-500/20' };
    if (s >= 71) return { stroke: '#34D399', glow: 'shadow-emerald-500/40', label: 'Strong', bg: 'from-emerald-500/20 to-green-500/20' };
    if (s >= 41) return { stroke: '#FBBF24', glow: 'shadow-amber-500/40', label: 'Growing', bg: 'from-amber-500/20 to-yellow-500/20' };
    return { stroke: '#F87171', glow: 'shadow-red-500/40', label: 'Needs Work', bg: 'from-red-500/20 to-rose-500/20' };
  };

  const scoreStyle = getScoreColor(score?.total || 0);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - ((score?.total || 0) / 100) * circumference;

  // Mock follower growth data (will be real when we have historical tracking)
  const followerData = [
    { name: 'Mon', followers: Math.max(0, (ig?.followersCount || 0) - 30) },
    { name: 'Tue', followers: Math.max(0, (ig?.followersCount || 0) - 22) },
    { name: 'Wed', followers: Math.max(0, (ig?.followersCount || 0) - 18) },
    { name: 'Thu', followers: Math.max(0, (ig?.followersCount || 0) - 12) },
    { name: 'Fri', followers: Math.max(0, (ig?.followersCount || 0) - 6) },
    { name: 'Sat', followers: Math.max(0, (ig?.followersCount || 0) - 2) },
    { name: 'Sun', followers: ig?.followersCount || 0 },
  ];

  const rateCardItems = [
    { type: 'Reel', icon: <Film size={18} />, rate: rates?.rates?.reel || 500, color: 'from-pink-500 to-rose-500' },
    { type: 'Post', icon: <ImageIcon size={18} />, rate: rates?.rates?.post || 300, color: 'from-blue-500 to-cyan-500' },
    { type: 'Story', icon: <Eye size={18} />, rate: rates?.rates?.story || 200, color: 'from-amber-500 to-orange-500' },
    { type: 'Carousel', icon: <Layers size={18} />, rate: rates?.rates?.carousel || 400, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {creator?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Creator'}
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your accounts today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {connected ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 rounded-xl">
              <Instagram size={18} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">@{creator?.igHandle}</span>
              <Check size={16} className="text-emerald-400" />
            </div>
          ) : (
            <button 
              onClick={handleConnectInstagram}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg shadow-pink-500/30 group"
            >
              <Instagram size={20} className="group-hover:rotate-12 transition-transform" />
              Connect Instagram Business
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Followers" 
          value={formatNumber(ig?.followersCount || 0)}
          change={connected ? "Live" : "—"} 
          icon={<Users className="text-violet-400" />} 
          color="bg-violet-400"
          live={connected}
        />
        <StatCard 
          label="Engagement Rate" 
          value={`${ig?.engagementRate?.toFixed(1) || '0.0'}%`}
          change={connected ? "Live" : "—"} 
          icon={<BarChart3 className="text-emerald-400" />} 
          color="bg-emerald-400"
          live={connected}
        />
        <StatCard 
          label="Weekly Reach" 
          value={formatNumber(ig?.reach || 0)}
          change={connected ? "Live" : "—"} 
          icon={<TrendingUp className="text-blue-400" />} 
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
        {/* Campayn Score Gauge */}
        <div className={`glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${scoreStyle.bg} opacity-30`} />
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-slate-300">Campayn Score™</h3>
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle
                  cx="60" cy="60" r="54"
                  stroke={scoreStyle.stroke}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 8px ${scoreStyle.stroke}40)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{score?.total || 0}</span>
                <span className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: scoreStyle.stroke }}>
                  {scoreStyle.label}
                </span>
              </div>
            </div>
            {/* Score breakdown */}
            <div className="mt-6 w-full space-y-2">
              {[
                { label: 'Engagement', value: score?.breakdown?.engagement || 0, w: 0.3 },
                { label: 'Growth', value: score?.breakdown?.growth || 0, w: 0.2 },
                { label: 'Consistency', value: score?.breakdown?.consistency || 0, w: 0.2 },
                { label: 'Audience', value: score?.breakdown?.audienceQuality || 0, w: 0.15 },
                { label: 'Reliability', value: score?.breakdown?.reliability || 0, w: 0.15 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 w-20">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.value}%`, backgroundColor: scoreStyle.stroke }}
                    />
                  </div>
                  <span className="text-slate-500 w-8 text-right">{Math.round(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Follower Growth Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Follower Growth</h3>
            <div className="flex items-center gap-2">
              {connected && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              )}
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none">
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

      {/* Smart Rate Card + Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Smart Rate Card */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400" size={20} />
              <h3 className="text-xl font-bold">Smart Rate Card</h3>
            </div>
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-wider">
              {rates?.tier || 'nano'} tier
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rateCardItems.map(item => (
              <button
                key={item.type}
                onClick={() => handleCopyRate(item.type, item.rate)}
                className="relative group p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    {item.icon}
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <p className="text-2xl font-bold">₹{item.rate.toLocaleString('en-IN')}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    {copiedRate === item.type ? (
                      <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                    ) : (
                      <><Copy size={12} /><span>Click to copy</span></>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Opportunities */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Opportunities</h3>
            <Sparkles className="text-amber-400 animate-pulse" size={18} />
          </div>
          <div className="flex-1 space-y-4">
            {(dashData?.opportunities || []).slice(0, 4).map((opp) => (
              <div key={opp.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 -m-3 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm">
                    {opp.brand?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{opp.brand || 'Brand'}</p>
                    <p className="text-xs text-slate-500">{opp.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    opp.matchScore?.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                    opp.matchScore?.score >= 40 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {opp.matchScore?.score || 0}% Match
                  </span>
                  <ArrowUpRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
            {(!dashData?.opportunities || dashData.opportunities.length === 0) && (
              <p className="text-slate-500 text-sm italic text-center py-4">No active campaigns right now. Check back soon!</p>
            )}
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
            Browse All Deals
          </button>
        </div>
      </div>

      {/* My Campaigns (quick preview) */}
      {dashData?.campaigns && dashData.campaigns.length > 0 && (
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Active Campaigns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashData.campaigns.slice(0, 3).map((camp) => (
              <div key={camp.id} className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{camp.brand}</span>
                  <StatusBadge status={camp.status} />
                </div>
                <p className="text-sm text-slate-400 mb-3">{camp.name}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>CPV: ₹{camp.cpvRate || '—'}</span>
                  <span>{camp.completed || 0}/{camp.deliverables || 1} delivered</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-campayn-primary rounded-full transition-all"
                    style={{ width: `${((camp.completed || 0) / (camp.deliverables || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Subcomponents ───────────────────────────────────────────────────

const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode;
  color: string;
  live?: boolean;
}> = ({ label, value, change, icon, color, live }) => (
  <div className="glass-card p-6 flex flex-col justify-between group">
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
        {icon}
      </div>
      {live ? (
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          {change}
        </div>
      ) : (
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-white/5 px-2 py-1 rounded-lg">
          {change}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value mt-1">{value}</h3>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    contracted: 'bg-blue-500/10 text-blue-400',
    delivered: 'bg-violet-500/10 text-violet-400',
    rejected: 'bg-red-500/10 text-red-400',
    recommended: 'bg-cyan-500/10 text-cyan-400',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${styles[status] || 'bg-white/5 text-slate-400'}`}>
      {status}
    </span>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;
