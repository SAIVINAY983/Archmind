import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAPI } from '../services/api';
import DiagramBoard from '../components/DiagramBoard';
import { 
  Send, 
  Layout, 
  Database, 
  Server, 
  ShieldCheck, 
  Cpu, 
  LogOut,
  ChevronRight,
  Loader2,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('diagram');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !savedUser) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error('Failed to parse user session', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await generateAPI.create(prompt);
      setResult(data);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Failed to generate architecture. Please check your API key.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="glass flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Layout className="text-primary-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" size={24} />
          <h1 className="text-2xl font-bold font-heading gradient-text tracking-wide">ArchMind</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Left Side: Input & History */}
        <div className="flex w-1/3 flex-col gap-6 overflow-y-auto pr-2">
          <div className="glass rounded-xl p-6 border border-slate-700/50 hover:border-primary-500/30 transition-all duration-500 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2 relative z-10">
              <Cpu size={20} className="text-primary-400" />
              New Design
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                className="w-full h-32 rounded-lg bg-slate-900/50 border border-slate-700 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500 transition-all resize-none"
                placeholder="Describe the product requirements (e.g., 'Build a scalable video streaming platform like YouTube with recommendations and global CDN')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600/90 py-3 font-semibold text-white hover:bg-primary-500 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-primary-500/50 relative z-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={20} />
                    <span className="animate-pulse">Generating...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Generate Architecture
                  </>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.4 }}
                className="glass rounded-xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full"></div>
                <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2 relative z-10">
                  <ShieldCheck size={20} className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  Scalability Suggestions
                </h2>
                <ul className="space-y-3">
                  {result.scalability?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight size={16} className="mt-0.5 text-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Visualization & Details */}
        <div className="flex flex-1 flex-col glass rounded-xl overflow-hidden">
          <div className="flex border-b border-slate-700 bg-slate-900/50">
            {[
              { id: 'diagram', label: 'Architecture Diagram', icon: Layout },
              { id: 'hld', label: 'HLD Components', icon: Server },
              { id: 'lld', label: 'LLD Details', icon: Code },
              { id: 'db', label: 'Database Schema', icon: Database },
              { id: 'apis', label: 'API Specs', icon: Cpu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                  activeTab === tab.id 
                    ? 'text-primary-400 bg-primary-500/10' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" 
                  />
                )}
                <tab.icon size={16} className={activeTab === tab.id ? "drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]" : ""} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-6">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-500 opacity-50">
                <Layout size={64} className="mb-4" />
                <p>Architecture visualization will appear here</p>
              </div>
            ) : (
              <div className="h-full">
                {activeTab === 'diagram' && (
                  <DiagramBoard data={result.diagramData} />
                )}
                {activeTab === 'hld' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.hld?.components?.map((comp, i) => (
                      <div key={i} className="rounded-lg border border-slate-700/50 p-5 bg-dark-800/80 hover:border-primary-500/40 transition-colors shadow-sm">
                        <h3 className="font-heading font-bold text-primary-400 mb-2 drop-shadow-[0_0_5px_rgba(56,189,248,0.2)]">{comp.name}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{comp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'lld' && (
                  <div className="space-y-6">
                    <div className="bg-dark-800/80 p-5 rounded-lg border border-slate-700/50 shadow-sm hover:border-primary-500/40 transition-colors">
                      <h3 className="font-heading font-bold text-accent-400 mb-3 drop-shadow-[0_0_5px_rgba(167,139,250,0.2)]">Core Design Patterns</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.lld?.patterns?.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-accent-500/10 text-accent-300 border border-accent-500/30 rounded-full text-sm">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-dark-800/80 p-5 rounded-lg border border-slate-700/50 shadow-sm hover:border-primary-500/40 transition-colors">
                      <h3 className="font-heading font-bold text-emerald-400 mb-3 drop-shadow-[0_0_5px_rgba(52,211,153,0.2)]">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.lld?.techStack?.map((t, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary-400 mb-3">Service Responsibilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.lld?.services?.map((svc, i) => (
                          <div key={i} className="rounded-lg border border-slate-700/50 p-4 bg-dark-800/80 hover:border-primary-500/40 transition-colors">
                            <h4 className="font-bold text-slate-200 mb-2">{svc.name}</h4>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                              {svc.responsibilities?.map((r, j) => (
                                <li key={j}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'db' && (
                  <div className="space-y-6">
                    {result.dbSchema?.tables?.map((table, i) => (
                      <div key={i} className="rounded-lg border border-slate-700 overflow-hidden">
                        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                          <h3 className="font-bold text-emerald-400">{table.name}</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-slate-900/50 text-slate-400">
                              <th className="px-4 py-2">Column</th>
                              <th className="px-4 py-2">Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns?.map((col, j) => (
                              <tr key={j} className="border-t border-slate-700/50">
                                <td className="px-4 py-2 font-mono">{col.name}</td>
                                <td className="px-4 py-2 text-slate-400">{col.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'apis' && (
                  <div className="space-y-4">
                    {result.apis?.map((api, i) => (
                      <div key={i} className="group flex items-center gap-4 rounded-lg border border-slate-700/50 p-4 bg-dark-800/80 hover:border-primary-500/30 transition-all">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold shadow-[0_0_10px_rgba(0,0,0,0.2)] ${
                          api.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {api.method}
                        </span>
                        <code className="text-sm font-mono text-slate-200 group-hover:text-primary-300 transition-colors">{api.path}</code>
                        <span className="text-sm text-slate-400 ml-auto group-hover:text-slate-300 transition-colors">{api.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
