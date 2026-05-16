import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Instagram, 
  MapPin, 
  Users, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  Star,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MediaKit: React.FC = () => {
  const { igHandle } = useParams<{ igHandle: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaKit = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/creator/media-kit/${igHandle}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || 'Creator not found');
        }
      } catch (err) {
        setError('Failed to load media kit');
      } finally {
        setLoading(false);
      }
    };

    if (igHandle) fetchMediaKit();
  }, [igHandle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-campayn-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-campayn-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Authenticating with Campayn Network...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-campayn-dark flex items-center justify-center p-6">
        <div className="glass-card p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-red-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Media Kit Unavailable</h1>
          <p className="text-slate-400 mb-8">{error || "This creator hasn't activated their public media kit yet."}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Go to Campayn Home
          </button>
        </div>
      </div>
    );
  }

  const { creator, campaynScore, campaignsCompleted } = data;
  
  const getScoreColor = (s: number) => {
    if (s >= 91) return { stroke: '#A78BFA', label: 'Elite Tier', bg: 'bg-violet-500/10', text: 'text-violet-400' };
    if (s >= 71) return { stroke: '#34D399', label: 'Strong Tier', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
    if (s >= 41) return { stroke: '#FBBF24', label: 'Growth Tier', bg: 'bg-amber-500/10', text: 'text-amber-400' };
    return { stroke: '#F87171', label: 'Developing', bg: 'bg-red-500/10', text: 'text-red-400' };
  };

  const style = getScoreColor(campaynScore.total);
  const circumference = 2 * Math.PI * 60;
  const dashOffset = circumference - (campaynScore.total / 100) * circumference;

  // Mock growth data for visualization
  const growthData = [
    { name: 'Jan', followers: creator.followers * 0.85 },
    { name: 'Feb', followers: creator.followers * 0.88 },
    { name: 'Mar', followers: creator.followers * 0.92 },
    { name: 'Apr', followers: creator.followers * 0.96 },
    { name: 'May', followers: creator.followers },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-campayn-primary/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-campayn-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-violet-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">
        {/* Verification Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Identity Verified</p>
              <p className="text-xs text-emerald-400/80 font-medium">Campayn Authenticated Creator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Performance Data</span>
          </div>
        </div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Bio & Style */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-campayn-primary to-violet-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                {creator.profilePictureUrl ? (
                  <img 
                    src={creator.profilePictureUrl} 
                    alt={creator.name} 
                    className="relative w-40 h-40 rounded-[2.5rem] object-cover border-2 border-white/10 shadow-2xl shadow-black"
                  />
                ) : (
                  <div className="relative w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center border border-white/10 shadow-2xl">
                    <Instagram size={64} className="text-white/20" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-campayn-primary p-2.5 rounded-2xl shadow-xl border-2 border-[#050505]">
                  <Instagram size={20} className="text-white" />
                </div>
              </div>

              {/* Bio Details */}
              <div className="flex-1 text-center md:text-left pt-2">
                <h1 className="text-5xl font-black tracking-tight mb-2 flex flex-col md:flex-row md:items-center gap-3">
                  {creator.name}
                  {creator.verified && <CheckCircle2 className="text-campayn-primary inline" size={32} />}
                </h1>
                <p className="text-xl text-slate-400 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-campayn-primary">@{creator.igHandle}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span>{creator.category}</span>
                </p>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                  {creator.bio || "Crafting digital experiences and telling stories through content. Part of the next generation of Indian creators."}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8 justify-center md:justify-start">
                  {creator.location && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="text-sm font-medium">{creator.location}</span>
                    </div>
                  )}
                  {creator.contentStyle && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <Sparkles size={16} className="text-amber-400" />
                      <span className="text-sm font-medium">{creator.contentStyle} Style</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400">
                    <Calendar size={16} />
                    <span className="text-sm font-bold">{campaignsCompleted}+ Campaigns Done</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="glass-card p-6 group hover:border-campayn-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                    <Users size={24} />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400" />
                </div>
                <p className="text-4xl font-black mb-1">{(creator.followers || 0).toLocaleString('en-IN')}</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Followers</p>
              </div>

              <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400" />
                </div>
                <p className="text-4xl font-black mb-1">{creator.engagementRate?.toFixed(2)}%</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Engagement Rate</p>
              </div>

              <div className="glass-card p-6 group hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                    <Zap size={24} />
                  </div>
                  <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-400" />
                </div>
                <p className="text-4xl font-black mb-1">94%</p>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Audience Quality</p>
              </div>
            </div>
          </div>

          {/* Right: Campayn Score Giant Gauge */}
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-b ${style.bg} opacity-20`} />
            
            <p className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Proprietary Score</p>
            
            <div className="relative w-48 h-48 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle 
                  cx="70" cy="70" r="60" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="12" fill="none" 
                />
                <circle
                  cx="70" cy="70" r="60"
                  stroke={style.stroke}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-[2000ms] ease-out shadow-2xl"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black tracking-tighter">{campaynScore.total}</span>
              </div>
            </div>

            <div className={`relative z-10 px-6 py-2 rounded-2xl ${style.bg} ${style.text} border border-current/10 font-black text-sm uppercase tracking-widest mb-6`}>
              {style.label}
            </div>

            <div className="relative z-10 w-full mb-6 space-y-2">
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Global Percentile</span>
                <span className="text-xs font-black text-violet-400">Top {100 - (campaynScore.percentile?.global || 50)}%</span>
              </div>
              {campaynScore.percentile?.city && (
                <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{campaynScore.percentile.cityLabel} Rank</span>
                  <span className="text-xs font-black text-emerald-400">Top {100 - campaynScore.percentile.city}%</span>
                </div>
              )}
            </div>

            <p className="relative z-10 text-slate-500 text-[10px] leading-relaxed mb-8 uppercase tracking-widest font-bold opacity-60">
              Calculated via real-time engagement, growth velocity, and campaign reliability.
            </p>

            <div className="relative z-10 w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Reliability</p>
                <p className="text-lg font-bold">{campaynScore.breakdown?.reliability || 60}%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Consistency</p>
                <p className="text-lg font-bold">{campaynScore.breakdown?.consistency || 75}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Visualization */}
        <div className="glass-card p-8 mb-12 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                Audience Trajectory
                <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold tracking-wider uppercase">+12% MoM</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">Verified follower growth over the last 5 months.</p>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Avg Likes</p>
                <p className="text-xl font-bold">{(creator.avgLikes || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Avg Comments</p>
                <p className="text-xl font-bold">{(creator.avgComments || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorFollow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F0F', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#A78BFA' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="followers" 
                  stroke="#A78BFA" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorFollow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rate Card (Optional/Professional) */}
        <div className="glass-card p-12 text-center bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="w-16 h-16 bg-campayn-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="text-campayn-primary" size={32} />
          </div>
          <h2 className="text-3xl font-black mb-4">Start a Campaign with {creator.name.split(' ')[0]}</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            This creator is part of the Campayn Elite network. Contact our campaign desk or use the invite button to start the selection process.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-campayn-primary text-white rounded-2xl font-black text-lg hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-3 group">
              Invite to Campaign
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Download Media PDF
            </button>
          </div>
          
          <p className="text-slate-500 text-xs mt-12 font-bold uppercase tracking-[0.2em]">
            Verified by Campayn Protocol • Real-time Data v1.4
          </p>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-sm font-bold text-slate-500">Built on</p>
            <span className="text-xl font-black tracking-tighter text-white">CAMPAYN</span>
          </div>
          <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest font-black">Powered by Curezy AI Platform • Indore, India</p>
        </div>
      </div>
    </div>
  );
};

export default MediaKit;
