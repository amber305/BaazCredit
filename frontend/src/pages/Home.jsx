import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, BrainCircuit } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center z-10 glass-panel border-x-0 border-t-0 rounded-none bg-surface/50">
        <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          BaazCredit
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-lg font-medium hover:bg-white/5 transition-colors">Log In</Link>
          <Link to="/predict" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8">
          <Activity size={18} />
          <span className="text-sm font-medium">Powered by ML & Alternative Data</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight max-w-4xl leading-tight">
          Redefining Credit Scoring with <span className="text-primary">AI Context</span>
        </h1>
        
        <p className="text-lg md:text-xl text-textMuted max-w-2xl mb-12">
          Move beyond traditional credit checks. BaazCredit analyzes behavioral, digital, and alternative data to provide high-accuracy risk assessments.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/predict" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
            <BrainCircuit size={24} /> Generate Score
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-lg font-medium border border-white/20 hover:bg-white/5 transition-colors text-lg flex items-center gap-2">
            <ShieldCheck size={24} /> View Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
