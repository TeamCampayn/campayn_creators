import React, { useEffect, useState } from 'react';
import { 
  UserCircle, 
  Instagram, 
  Check, 
  MapPin, 
  Tag, 
  Pencil, 
  Save,
  X,
  Copy,
  Users,
  Image,
  TrendingUp,
  Zap,
  LogOut,
  RefreshCw,
  Film,
  ImageIcon,
  Eye,
  Layers,
  Star
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    category: '',
    subcategory: '',
    bio: '',
    location: '',
    content_style: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/auth/creator/dashboard/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setDashData(data);
          setEditForm({
            category: data.creator?.category || '',
            subcategory: data.creator?.subcategory || '',
            bio: data.creator?.bio || '',
            location: data.creator?.location || '',
            content_style: data.creator?.contentStyle || '',
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!dashData?.creator?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from('creators')
      .update({
        category: editForm.category || null,
        subcategory: editForm.subcategory || null,
        bio: editForm.bio || null,
        location: editForm.location || null,
        content_style: editForm.content_style || null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user?.id);

    if (!error) {
      setDashData((prev: any) => ({
        ...prev,
        creator: {
          ...prev.creator,
          category: editForm.category,
          subcategory: editForm.subcategory,
          bio: editForm.bio,
          location: editForm.location,
          contentStyle: editForm.content_style,
        }
      }));
      setEditing(false);
    }
    setSaving(false);
  };

  const handleCopyMediaKit = () => {
    const handle = dashData?.creator?.igHandle;
    if (handle) {
      navigator.clipboard.writeText(`${window.location.origin}/media-kit/${handle}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleConnectInstagram = () => {
    if (!user) return;
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID || "1951089435528507";
    const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/api/auth/facebook/callback`;
    const scope = [
      'instagram_basic', 'instagram_manage_insights', 'pages_show_list',
      'pages_read_engagement', 'pages_manage_metadata', 'business_management', 'public_profile'
    ].join(',');
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${user.id}&auth_type=rerequest`;
    window.location.href = authUrl;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-48 bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const creator = dashData?.creator;
  const ig = dashData?.igData;
  const score = dashData?.campaynScore;
  const rates = dashData?.rateCard;
  const connected = dashData?.connected;

  const getScoreColor = (s: number) => {
    if (s >= 91) return { stroke: '#A78BFA', label: 'Elite' };
    if (s >= 71) return { stroke: '#34D399', label: 'Strong' };
    if (s >= 41) return { stroke: '#FBBF24', label: 'Growing' };
    return { stroke: '#F87171', label: 'Needs Work' };
  };

  const scoreStyle = getScoreColor(score?.total || 0);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - ((score?.total || 0) / 100) * circumference;

  const categories = [
    'Arts & Entertainment', 'Beauty & Fashion', 'Business & Finance', 'Comedy & Memes',
    'Education', 'Food & Cooking', 'Gaming', 'Health & Fitness', 'Lifestyle',
    'Music', 'Photography', 'Sports', 'Technology', 'Travel', 'Other'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-slate-400 mt-1">Manage your creator profile and media kit.</p>
        </div>
        <div className="flex items-center gap-3">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
              <Pencil size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-campayn-primary hover:bg-violet-600 transition-all text-sm font-medium text-white">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {ig?.profilePictureUrl ? (
              <img src={ig.profilePictureUrl} alt={creator?.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center">
                <UserCircle size={48} className="text-violet-400" />
              </div>
            )}
            {connected && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-lg p-1">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{creator?.name || 'Creator'}</h2>
            {connected && (
              <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                <Instagram size={16} className="text-pink-400" />
                <span className="text-slate-300">@{creator?.igHandle}</span>
              </div>
            )}
            <p className="text-slate-400 mt-2 max-w-lg">{creator?.bio || editForm.bio || 'No bio yet. Add one to help brands understand your style!'}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4 justify-center md:justify-start">
              {creator?.category && (
                <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
                  <Tag size={12} /> {creator.category}
                </span>
              )}
              {creator?.location && (
                <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                  <MapPin size={12} /> {creator.location}
                </span>
              )}
              {creator?.contentStyle && (
                <span className="flex items-center gap-1 text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Star size={12} /> {creator.contentStyle}
                </span>
              )}
            </div>
          </div>

          {/* Campayn Score Mini */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                <circle
                  cx="45" cy="45" r="40"
                  stroke={scoreStyle.stroke}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black">{score?.total || 0}</span>
              </div>
            </div>
            <span className="text-xs font-semibold mt-1" style={{ color: scoreStyle.stroke }}>{scoreStyle.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Profile Form / Stats */}
        {editing ? (
          <div className="glass-card p-8 space-y-5">
            <h3 className="text-lg font-bold mb-2">Edit Profile</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Category</label>
              <select
                value={editForm.category}
                onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Subcategory</label>
              <input
                type="text"
                value={editForm.subcategory}
                onChange={e => setEditForm(f => ({ ...f, subcategory: e.target.value }))}
                placeholder="e.g., Street Fashion, Tech Reviews"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell brands about yourself..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g., Indore, Madhya Pradesh"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Content Style</label>
              <input
                type="text"
                value={editForm.content_style}
                onChange={e => setEditForm(f => ({ ...f, content_style: e.target.value }))}
                placeholder="e.g., Cinematic, Minimal, Raw"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6">Account Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Users size={16} />
                  <span className="text-xs uppercase tracking-wider">Followers</span>
                </div>
                <p className="text-2xl font-bold">{(ig?.followersCount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Image size={16} />
                  <span className="text-xs uppercase tracking-wider">Posts</span>
                </div>
                <p className="text-2xl font-bold">{(ig?.mediaCount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <TrendingUp size={16} />
                  <span className="text-xs uppercase tracking-wider">Engagement</span>
                </div>
                <p className="text-2xl font-bold">{ig?.engagementRate?.toFixed(2) || '0.00'}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Eye size={16} />
                  <span className="text-xs uppercase tracking-wider">Reach</span>
                </div>
                <p className="text-2xl font-bold">{(ig?.reach || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}

        {/* IG Connection & Media Kit */}
        <div className="space-y-6">
          {/* IG Connection */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Instagram Connection</h3>
            {connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Instagram className="text-emerald-400" size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-400">Connected</p>
                    <p className="text-sm text-slate-400">@{creator?.igHandle}</p>
                  </div>
                </div>
                <button
                  onClick={handleConnectInstagram}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-sm mb-4">Connect your Instagram Business account to unlock all features.</p>
                <button 
                  onClick={handleConnectInstagram}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg shadow-pink-500/30 w-full justify-center"
                >
                  <Instagram size={18} /> Connect Instagram Business
                </button>
              </div>
            )}
          </div>

          {/* Media Kit Link */}
          {connected && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-amber-400" size={18} />
                <h3 className="text-lg font-bold">Media Kit</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">Share your live media kit with brands. Always up-to-date.</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 truncate">
                  campayn.tech/creator/@{creator?.igHandle}
                </div>
                <button
                  onClick={handleCopyMediaKit}
                  className="px-4 py-3 rounded-xl bg-campayn-primary hover:bg-violet-600 transition-all text-sm font-medium text-white"
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Quick Rate Card */}
          {rates && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Your Rates ({rates.tier} tier)</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'Reel', icon: <Film size={14} />, rate: rates.rates?.reel },
                  { type: 'Post', icon: <ImageIcon size={14} />, rate: rates.rates?.post },
                  { type: 'Story', icon: <Eye size={14} />, rate: rates.rates?.story },
                  { type: 'Carousel', icon: <Layers size={14} />, rate: rates.rates?.carousel },
                ].map(item => (
                  <div key={item.type} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-slate-400">
                      {item.icon}
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <span className="font-bold">₹{(item.rate || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out */}
      <div className="glass-card p-6">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-medium"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
