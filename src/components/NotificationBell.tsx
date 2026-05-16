
import { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    setupSocket();
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch from Supabase directly for history
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const setupSocket = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://campayn-backend.onrender.com';
    const socket = io(backendUrl);

    socket.emit('join_user_room', user.id);

    socket.on('new_notification', (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Browser notification if supported
      if (Notification.permission === 'granted') {
        new Notification(notification.title, { body: notification.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-campayn-primary text-[10px] font-black text-white rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 md:w-96 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-black uppercase tracking-widest text-campayn-primary hover:text-white transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="mx-auto text-slate-700 mb-3" size={32} />
                  <p className="text-slate-500 text-xs font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 border-b border-white/5 flex gap-4 transition-colors relative group ${n.is_read ? 'opacity-60' : 'bg-campayn-primary/5'}`}
                  >
                    {!n.is_read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-campayn-primary rounded-full" />
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      n.type === 'invitation' ? 'bg-violet-500/20 text-violet-400' :
                      n.type === 'payment' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Bell size={18} />
                    </div>
                    <div className="space-y-1 pr-4">
                      <p className="text-sm font-bold leading-tight">{n.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-600 font-medium">
                        {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'Just now'}
                      </p>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-end px-4 gap-2 bg-[#0f0f0f]/80 backdrop-blur-sm transition-opacity">
                      {!n.is_read && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          className="p-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {n.link && (
                        <a 
                          href={n.link}
                          className="p-2 bg-white/5 hover:bg-campayn-primary/20 text-campayn-primary rounded-lg transition-colors"
                          title="View"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-white/5 text-center">
              <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
