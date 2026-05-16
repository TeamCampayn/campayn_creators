import React, { useEffect, useState } from 'react';
import { 
  Megaphone, 
  ArrowUpRight, 
  Calendar, 
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Filter,
  Sparkles,
  Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
  id: string;
  name: string;
  brand: string;
  status: string;
  selectionStatus: string;
  cpvRate: number;
  deliverables: number;
  completed: number;
  createdAt: string;
  matchScore: { score: number; reasons: string[] };
}

interface Opportunity {
  id: string;
  name: string;
  brand: string;
  cpvRate: number;
  budget: number;
  contentTypes: string[];
  matchScore: { score: number; reasons: string[] };
}

const Campaigns: React.FC = () => {
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/auth/creator/dashboard/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setMyCampaigns(data.campaigns || []);
          setOpportunities(data.opportunities || []);
        }
      } catch (err) {
        console.error('Campaign fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'approved': case 'contracted': return <Star size={16} className="text-blue-400" />;
      case 'rejected': return <XCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-amber-400" />;
    }
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      contracted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      delivered: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      recommended: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
    return map[status] || 'bg-white/5 text-slate-400 border-white/10';
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/3" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <p className="text-slate-400 mt-1">Manage your brand collaborations and discover new opportunities.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'my' ? 'bg-campayn-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Campaigns ({myCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'discover' ? 'bg-campayn-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          Discover ({opportunities.length})
        </button>
      </div>

      {/* My Campaigns */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {myCampaigns.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Package className="mx-auto text-slate-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-300">No campaigns yet</h3>
              <p className="text-slate-500 mt-2">Discover opportunities and start collaborating with brands!</p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="mt-6 btn-primary"
              >
                Browse Opportunities
              </button>
            </div>
          ) : (
            myCampaigns.map((camp) => (
              <div key={camp.id} className="glass-card p-6 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                      <Megaphone size={22} className="text-violet-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{camp.brand || 'Brand'}</h3>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusColor(camp.status)}`}>
                          {statusIcon(camp.status)}
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{camp.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">CPV Rate</p>
                      <p className="text-lg font-bold text-emerald-400">₹{camp.cpvRate || '—'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Deliverables</p>
                      <p className="text-lg font-bold">{camp.completed || 0}/{camp.deliverables || 1}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Match</p>
                      <p className="text-lg font-bold text-amber-400">{camp.matchScore?.score || 0}%</p>
                    </div>
                  </div>
                </div>
                {/* Progress */}
                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-campayn-primary to-violet-400 rounded-full transition-all duration-500"
                    style={{ width: `${((camp.completed || 0) / (camp.deliverables || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Discover Opportunities */}
      {activeTab === 'discover' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.length === 0 ? (
            <div className="glass-card p-12 text-center col-span-2">
              <Sparkles className="mx-auto text-slate-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-300">No opportunities right now</h3>
              <p className="text-slate-500 mt-2">New campaigns are posted regularly. Check back soon!</p>
            </div>
          ) : (
            opportunities.map((opp) => (
              <div key={opp.id} className="glass-card p-6 hover:border-white/20 transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center font-bold text-amber-400">
                      {opp.brand?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold">{opp.brand}</h3>
                      <p className="text-slate-400 text-sm">{opp.name}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${
                    opp.matchScore?.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' :
                    opp.matchScore?.score >= 40 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/5 text-slate-400'
                  }`}>
                    {opp.matchScore?.score || 0}% Match
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <IndianRupee size={14} />
                    CPV: ₹{opp.cpvRate || '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Budget: ₹{(opp.budget || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {opp.contentTypes && opp.contentTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opp.contentTypes.map((type: string) => (
                      <span key={type} className="text-xs px-2 py-1 bg-white/5 rounded-lg text-slate-300">
                        {type}
                      </span>
                    ))}
                  </div>
                )}

                {opp.matchScore?.reasons && opp.matchScore.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {opp.matchScore.reasons.map((reason: string) => (
                      <span key={reason} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full">
                        ✓ {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
