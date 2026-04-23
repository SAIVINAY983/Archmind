import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, LayoutTemplate, Zap, ArrowRight, BrainCircuit, Mail, Link as LinkIcon } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary-400" />,
      title: "AI-Powered Generation",
      description: "Convert natural language requirements into comprehensive system architecture instantly."
    },
    {
      icon: <LayoutTemplate className="w-8 h-8 text-accent-400" />,
      title: "Interactive Diagrams",
      description: "Visualize components, databases, and microservices with interactive, draggable nodes."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "High-Speed Inference",
      description: "Powered by Groq's high-speed API to deliver complete low-level designs in seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Abstract Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-600/10 blur-[120px] pointer-events-none" />
      
      {/* Navbar Integration Area (if needed, but simple landing nav for now) */}
      <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-400" />
          <span className="text-xl font-heading font-bold text-white tracking-wide">ArchMind</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-400 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.main 
        className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>v1.0 is now live</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
          Design Complex Systems <br className="hidden md:block" />
          <span className="gradient-text">At The Speed Of Thought</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          ArchMind transforms your product requirements into professional, interactive Low-Level Designs (LLD) using advanced AI agents. Stop drawing boxes and start building.
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          <Link to="/signup" className="group flex items-center gap-2 px-8 py-4 text-base font-semibold bg-white text-dark-900 rounded-xl hover:bg-slate-200 transition-all">
            Start Designing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.main>

      {/* Features Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 border-t border-white/5 bg-dark-800/30"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="glass p-8 rounded-2xl border border-white/10 hover:border-primary-500/30 transition-colors group">
              <div className="mb-6 bg-dark-900 p-4 rounded-xl inline-block shadow-inner">
                {feat.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
      
      {/* Footer Section */}
      <footer className="relative z-10 border-t border-white/10 bg-dark-900/50 pt-12 pb-8 px-6 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-xl font-heading font-bold text-white tracking-wide">ArchMind</span>
            </div>
            <p className="text-sm leading-relaxed">
              An AI-powered generator that transforms product requirements into robust, comprehensive low-level system designs instantly.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-white font-medium mb-1">Created by Sai Vinay</div>
            <div className="flex gap-4">
              <a href="mailto:contact@example.com" className="hover:text-primary-400 transition-colors flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href="https://github.com/SAIVINAY983" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 text-sm">
                <LinkIcon className="w-4 h-4" /> GitHub
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2 text-sm">
                <LinkIcon className="w-4 h-4" /> Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-xs opacity-60">
          &copy; {new Date().getFullYear()} ArchMind Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
