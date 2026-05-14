import React from 'react';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight,
  Instagram,
  Facebook
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

const data = [
  { name: 'Mon', followers: 4000 },
  { name: 'Tue', followers: 4500 },
  { name: 'Wed', followers: 4200 },
  { name: 'Thu', followers: 4800 },
  { name: 'Fri', followers: 5100 },
  { name: 'Sat', followers: 5600 },
  { name: 'Sun', followers: 5800 },
];

const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, change, icon, color }) => (
  <div className="glass-card p-6 flex flex-col justify-between group">
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
        <TrendingUp size={14} />
        {change}
      </div>
    </div>
    <div className="mt-4">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value mt-1">{value}</h3>
    </div>
  </div>
);

// Utility for cleaner class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your accounts today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-xl text-white font-medium hover:scale-105 transition-transform shadow-lg shadow-pink-500/20">
            <Instagram size={18} />
            Connect Instagram
          </button>
          <button className="flex items-center gap-2 bg-[#1877F2] px-4 py-2 rounded-xl text-white font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
            <Facebook size={18} />
            Connect Facebook
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Followers" 
          value="58.2K" 
          change="+12%" 
          icon={<Users className="text-violet-400" />} 
          color="bg-violet-400"
        />
        <StatCard 
          label="Avg. Engagement" 
          value="4.8%" 
          change="+2.4%" 
          icon={<BarChart3 className="text-emerald-400" />} 
          color="bg-emerald-400"
        />
        <StatCard 
          label="Weekly Reach" 
          value="124.5K" 
          change="+18%" 
          icon={<TrendingUp className="text-blue-400" />} 
          color="bg-blue-400"
        />
        <StatCard 
          label="Est. Earnings" 
          value="₹12,400" 
          change="+5%" 
          icon={<ArrowUpRight className="text-amber-400" />} 
          color="bg-amber-400"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Follower Growth</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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

        <div className="glass-card p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Recent Campaigns</h3>
          <div className="flex-1 space-y-6">
            {[
              { brand: 'Nike India', status: 'In Progress', color: 'text-blue-400' },
              { brand: 'Boat Lifestyle', status: 'Payment Pending', color: 'text-amber-400' },
              { brand: 'Zomato', status: 'Completed', color: 'text-emerald-400' },
            ].map((camp, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold">
                    {camp.brand[0]}
                  </div>
                  <div>
                    <p className="font-medium">{camp.brand}</p>
                    <p className={cn("text-xs font-semibold uppercase tracking-wider", camp.color)}>{camp.status}</p>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
            View All Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
