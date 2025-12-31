
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Play, 
  Film, 
  Monitor, 
  History as HistoryIcon, 
  Settings, 
  X, 
  ShieldCheck, 
  Zap, 
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Trash2,
  Tv,
  Languages,
  Lock,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { API_ROUTES, APP_NAME } from './constants';
import { ApiRoute, WatchHistoryItem, MovieInsight } from './types';
import { getMovieInsights, getTrendingRecommendations } from './services/geminiService';
import { translations, Language } from './translations';

// Hardcoded Credentials
const VALID_CREDENTIALS: Record<string, string> = {
  "shark": "686130",
  "shark1": "123456",
  "shark2": "9982qwe"
};

// Reusable Components
const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      active ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string }> = ({ icon, title, description, color }) => (
  <div className="p-6 rounded-2xl glass-effect group hover:border-indigo-500/50 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // App State
  const [lang, setLang] = useState<Language>('zh');
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [trending, setTrending] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<MovieInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const t = translations[lang];

  // Persistence & Initial Data
  useEffect(() => {
    const savedAuth = localStorage.getItem('ns_auth');
    if (savedAuth === 'true') setIsAuthenticated(true);

    const savedHistory = localStorage.getItem('ns_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedLang = localStorage.getItem('ns_lang') as Language;
    if (savedLang) setLang(savedLang);
    
    getTrendingRecommendations(savedLang || lang).then(setTrending);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (VALID_CREDENTIALS[usernameInput] === passwordInput) {
      setIsAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('ns_auth', 'true');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ns_auth');
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    setLang(newLang);
    localStorage.setItem('ns_lang', newLang);
    getTrendingRecommendations(newLang).then(setTrending);
    if (isPlaying && videoUrl) {
        setIsLoadingInsight(true);
        getMovieInsights(videoUrl, newLang).then(setAiInsight).finally(() => setIsLoadingInsight(false));
    }
  };

  const saveHistory = useCallback((items: WatchHistoryItem[]) => {
    setHistory(items);
    localStorage.setItem('ns_history', JSON.stringify(items));
  }, []);

  const handlePlay = useCallback(async (targetUrl?: string) => {
    const urlToPlay = targetUrl || videoUrl;
    if (!urlToPlay) return;

    setIsPlaying(true);
    setVideoUrl(urlToPlay);
    
    const newItem: WatchHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlToPlay,
      timestamp: Date.now(),
      title: urlToPlay.split('/').pop() || 'Untitled Content'
    };

    const newHistory = [newItem, ...history.filter(h => h.url !== urlToPlay)].slice(0, 20);
    saveHistory(newHistory);

    setIsLoadingInsight(true);
    const insight = await getMovieInsights(urlToPlay, lang);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  }, [videoUrl, history, saveHistory, lang]);

  const clearHistory = () => {
    saveHistory([]);
    setShowHistory(false);
  };

  const currentApi = useMemo(() => API_ROUTES[activeRouteIndex], [activeRouteIndex]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="absolute top-8 right-8">
           <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 glass-effect text-slate-400 hover:text-white transition-all text-xs font-bold"
            >
              <Languages size={16} />
              {lang === 'en' ? 'EN' : '中'}
            </button>
        </div>

        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <Tv className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">{t.login.title}</h1>
            <p className="text-slate-400">{t.login.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="glass-effect p-8 rounded-3xl border-white/10 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{t.login.userPlaceholder}</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input 
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{t.login.passPlaceholder}</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input 
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                {t.login.error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap size={18} fill="currentColor" />
              {t.login.btn}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-8">
            &copy; 2024 NovaStream Entertainment • Secure Access Only
          </p>
        </div>
      </div>
    );
  }

  // MAIN APP (AUTHENTICATED)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden relative flex flex-col">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 glass-effect border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsPlaying(false)}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Tv className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                Nova<span className="text-indigo-400">Stream</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Pro V3.0</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <NavItem icon={<TrendingUp size={18} />} label={t.nav.explore} active={!isPlaying} onClick={() => setIsPlaying(false)} />
            <NavItem icon={<Sparkles size={18} />} label={t.nav.aiDiscovery} />
            <NavItem icon={<Settings size={18} />} label={t.nav.advanced} />
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-bold"
            >
              <Languages size={16} />
              {lang === 'en' ? 'EN' : '中'}
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors relative"
            >
              <HistoryIcon size={20} />
              {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
            </button>
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <LogOut size={16} />
              {t.login.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 z-10 container mx-auto px-6 py-8">
        {!isPlaying ? (
          <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6 pt-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Zap size={14} /> {t.hero.version}
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
                {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{t.hero.titleHighlight}</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative glass-effect p-2 rounded-2xl flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 gap-3">
                  <Monitor className="text-slate-500 shrink-0" size={24} />
                  <input 
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder={t.hero.placeholder}
                    className="w-full bg-transparent border-none py-4 text-white focus:ring-0 placeholder:text-slate-600 text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                  />
                </div>
                <button 
                  onClick={() => handlePlay()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Play size={20} fill="currentColor" />
                  {t.hero.cta}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-400" /> {t.trending}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setVideoUrl(item); handlePlay(item); }}
                    className="px-4 py-2 rounded-full glass-effect hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-sm transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<ShieldCheck size={24} />} 
                title={t.features.privacy.title} 
                description={t.features.privacy.desc} 
                color="bg-indigo-500/20 text-indigo-400"
              />
              <FeatureCard 
                icon={<Zap size={24} />} 
                title={t.features.speed.title} 
                description={t.features.speed.desc} 
                color="bg-purple-500/20 text-purple-400"
              />
              <FeatureCard 
                icon={<Sparkles size={24} />} 
                title={t.features.ai.title} 
                description={t.features.ai.desc} 
                color="bg-pink-500/20 text-pink-400"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="lg:col-span-3 space-y-6">
              <div className="relative group aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe 
                  src={`${currentApi.url}${videoUrl}`}
                  className="w-full h-full"
                  allowFullScreen
                  title="NovaStream Pro Player"
                  frameBorder="0"
                />
                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-black/70 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 truncate">
                      <Film className="text-indigo-400 shrink-0" size={20} />
                      {aiInsight?.title || videoUrl.substring(0, 40) + '...'}
                    </h2>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      {t.player.source}: {currentApi.name} <ChevronRight size={14} /> {t.player.node}
                    </p>
                  </div>
                  <div className="flex bg-slate-800/50 p-1 rounded-xl">
                    {API_ROUTES.map((route, idx) => (
                      <button 
                        key={route.id}
                        onClick={() => setActiveRouteIndex(idx)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          activeRouteIndex === idx ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Line {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-400">{t.player.connected}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-effect rounded-3xl overflow-hidden border-indigo-500/10">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <span className="font-bold text-white text-sm">{t.player.aiInsights}</span>
                </div>
                <div className="p-6 space-y-6">
                  {isLoadingInsight ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-10 bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  ) : aiInsight ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded uppercase">
                          {aiInsight.year}
                        </span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          ★ {aiInsight.rating}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed italic">
                        "{aiInsight.summary}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {aiInsight.genre.map(g => (
                          <span key={g} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-sm text-slate-500">{t.player.noInsights}</p>
                      <button 
                        onClick={() => handlePlay()}
                        className="text-xs text-indigo-400 font-bold hover:underline"
                      >
                        {t.player.refresh}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-effect rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t.player.switchStream}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {API_ROUTES.map((route, idx) => (
                    <button 
                      key={route.id}
                      onClick={() => setActiveRouteIndex(idx)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group ${
                        activeRouteIndex === idx 
                          ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' 
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-semibold">{route.name}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showHistory && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md h-full glass-effect shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HistoryIcon className="text-indigo-400" size={24} />
                <h3 className="text-xl font-bold">{t.nav.watchHistory}</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <HistoryIcon size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500">{t.history.empty}</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => { handlePlay(item.url); setShowHistory(false); }}
                    className="group relative glass-effect border-white/5 p-4 rounded-2xl cursor-pointer hover:border-indigo-500/30 transition-all flex items-start gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <Play size={20} className="text-slate-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="text-sm font-semibold text-white truncate">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        {new Date(item.timestamp).toLocaleDateString()} • {t.history.recent}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveHistory(history.filter(h => h.id !== item.id));
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={clearHistory}
                  className="w-full py-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> {t.history.clear}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="z-10 py-12 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
             <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Tv size={16} className="text-indigo-400" />
             </div>
             <span className="font-bold text-white tracking-tight">NovaStream Pro</span>
          </div>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            {t.footer.desc}
          </p>
          <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:text-white">{t.footer.api}</a>
            <a href="#" className="hover:text-white">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white">{t.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
