import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Brain, Code, Briefcase, Mail, Server, Database, Globe, Layers, Activity, PenSquare, TrendingUp, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import farhanPhoto from '../assets/farhan-photo.jpg';
import { 
  ScrambleIn, 
  FadeIn, 
  AnimatedText, 
  PrimaryButton, 
  GhostButton, 
  GlowCard, 
  Watermark,
  MindTrackLogo
} from '../components/ui/CinematicUI';

/* =========================================================================
   MARQUEE COMPONENT
========================================================================= */
const MarqueeRow = ({ images, direction = 1, speed = 1 }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, mass: 1 });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden flex items-center py-4">
      <motion.div style={{ x: smoothX }} className="flex gap-6 whitespace-nowrap min-w-max">
        {[...images, ...images, ...images].map((src, i) => (
          <div key={i} className="relative w-64 md:w-80 h-40 md:h-48 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group">
            <img src={src} alt="App UI Mockup" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* =========================================================================
   HOME PAGE
========================================================================= */
export default function Home() {
  const { user } = useAuth();
  const marqueeImages1 = [
    "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
  ];
  
  const marqueeImages2 = [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600",
  ];

  return (
    <div className="w-full font-mono">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 pt-24 pb-12 overflow-hidden">
        <Watermark text="CLARITY" />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 mt-12 lg:mt-0">
          
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-[clamp(40px,10vw,100px)] font-bold tracking-[-0.03em] leading-[1.1] mb-8 uppercase">
              <span className="block text-white"><ScrambleIn text="Understand" delay={200} /></span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#C026D3] to-[#DB2777]">
                <ScrambleIn text="Your Mind." delay={500} />
              </span>
            </h1>
            
            <FadeIn delay={0.7}>
              <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
                MindTrack AI reads between the lines of your journal — mapping mood, emotion, and pattern into a single adaptive wellness layer.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <PrimaryButton>Dashboard</PrimaryButton>
                    </Link>
                    <Link to="/journal/new">
                      <GhostButton className="uppercase tracking-widest font-bold">+ New Entry</GhostButton>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <PrimaryButton>Start Tracking</PrimaryButton>
                    </Link>
                    <Link to="/login">
                      <GhostButton>Sign In</GhostButton>
                    </Link>
                  </>
                )}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 relative w-full h-[50vh] lg:h-[70vh] flex justify-end items-center flex-col">
            <FadeIn delay={0.4} className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0C] via-transparent to-transparent z-10" />
              <img 
                src="/hero-portrait.png" 
                alt="Mindful AI Portrait" 
                className="w-full h-full object-cover object-center rounded-3xl opacity-80"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C026D3]/10 blur-[100px] -z-10 rounded-full" />
            </FadeIn>
            
            <div className="absolute bottom-8 right-0 text-right z-20">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white/40">
                <ScrambleIn text="Nourish" delay={700} /><br />
                <ScrambleIn text="Your Well-being" delay={1000} />
              </h3>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. MARQUEE SECTION */}
      <section className="py-24 relative z-10 bg-[#0A0A0C]/50 border-y border-white/5 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <FadeIn>
          <div className="mb-12 text-center px-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white/40 mb-2">The Interface</h2>
            <p className="text-2xl font-bold text-white uppercase"><ScrambleIn text="Designed for Clarity" delay={200}/></p>
          </div>
          <MarqueeRow images={marqueeImages1} direction={1} />
          <MarqueeRow images={marqueeImages2} direction={-1} />
        </FadeIn>
      </section>

      {/* 2.5. FEATURES SECTION */}
      <section className="py-32 relative overflow-hidden bg-[#0A0A0C]">
        <Watermark text="FEATURES" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#C026D3] to-[#DB2777]">
              <ScrambleIn text="Core Features" delay={100} />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={0.1} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center mb-6 text-[#C026D3] group-hover:text-white transition-colors">
                  <PenSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Smart Journaling</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">Write freely. AI reads between the lines.</p>
              </GlowCard>
            </FadeIn>
            
            <FadeIn delay={0.2} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center mb-6 text-[#C026D3] group-hover:text-white transition-colors">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Emotion Detection</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">Gemini AI detects your dominant emotion from every entry.</p>
              </GlowCard>
            </FadeIn>
            
            <FadeIn delay={0.3} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center mb-6 text-[#C026D3] group-hover:text-white transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Mood Tracking</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">Visualize your mood trends over 7 or 30 days.</p>
              </GlowCard>
            </FadeIn>
            
            <FadeIn delay={0.4} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center mb-6 text-[#C026D3] group-hover:text-white transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Wellness Suggestions</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">Personalized AI-generated advice after every entry.</p>
              </GlowCard>
            </FadeIn>
            
            <FadeIn delay={0.5} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center mb-6 text-[#C026D3] group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Weekly Reports</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">AI summarizes your emotional week with patterns and insights.</p>
              </GlowCard>
            </FadeIn>
            
            <FadeIn delay={0.6} y={20} className="h-full">
              <GlowCard className="p-8 h-full flex flex-col group bg-white/[0.03] hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-500 group-hover:text-rose-400 transition-colors">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Crisis Detection</h3>
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">Distress signals detected. Helpline resources shown immediately.</p>
              </GlowCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ME (BUILDER) SECTION */}
      <section className="py-32 relative overflow-hidden">
        <Watermark text="BUILDER" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
              <FadeIn className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-2 mb-8 group">
                <div className="absolute inset-0 rounded-full border border-[#C026D3]/30 animate-spin-slow pointer-events-none" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-4 rounded-full border border-[#7C3AED]/30 animate-spin-slow pointer-events-none" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                <div className="w-full h-full rounded-full bg-white/5 border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(192,38,211,0.15)] flex items-center justify-center">
                    <img src={farhanPhoto} alt="Mohammed Farhan K" className="w-full h-full object-cover" />
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2} className="w-full">
                <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-bold">Contact</h3>
                <div className="flex flex-col gap-3 w-full">
                  <a href="mailto:contact@example.com" className="flex items-center gap-4 text-white/60 hover:text-white hover:bg-white/5 p-3 rounded-xl border border-white/5 transition-colors">
                    <Mail size={20} className="text-[#C026D3]" />
                    <span className="text-sm">Email Me</span>
                  </a>
                  <a href="https://github.com/Farhan-kalady" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white hover:bg-white/5 p-3 rounded-xl border border-white/5 transition-colors">
                    <Code size={20} className="text-[#C026D3]" />
                    <span className="text-sm">github.com/Farhan-kalady</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white hover:bg-white/5 p-3 rounded-xl border border-white/5 transition-colors">
                    <Briefcase size={20} className="text-[#C026D3]" />
                    <span className="text-sm">Mohammed Farhan K</span>
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-8 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8 text-white">
                <ScrambleIn text="Built by Mohammed Farhan K" delay={200} />
              </h2>
              
              <div className="mb-12">
                <AnimatedText 
                  className="text-lg md:text-xl text-white/80 leading-relaxed font-sans font-light"
                  text="I'm an MCA (AI & Data Science) student at Mar Athanasius College of Engineering, with a BCA background from Majlis Arts and Science College. I recently completed an internship at ZLAQA AI Labs Pvt. Ltd., where I designed, built, and launched MindTrack AI end-to-end — from database schema to deployed frontend." 
                />
              </div>

              <FadeIn delay={0.3} y={30}>
                <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-bold">Tech Stack</h3>
                <div className="flex flex-wrap gap-3 mb-12">
                  {['React', 'Django REST Framework', 'Supabase (PostgreSQL)', 'Google Gemini API', 'Render', 'Vercel', 'Python', 'JavaScript', 'Git/GitHub'].map(tech => (
                    <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/80 whitespace-nowrap hover:border-[#C026D3]/50 hover:bg-[#C026D3]/10 transition-colors cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <FadeIn delay={0.4} y={30} className="h-full">
                  <GlowCard className="p-6 h-full flex flex-col justify-center">
                    <Server className="w-8 h-8 text-[#DB2777] mb-4" />
                    <h4 className="font-bold text-white mb-2">End-to-End Execution</h4>
                    <p className="text-sm text-white/60">Solo-built and deployed a full-stack AI mental wellness platform during internship.</p>
                  </GlowCard>
                </FadeIn>
                <FadeIn delay={0.5} y={30} className="h-full">
                  <GlowCard className="p-6 h-full flex flex-col justify-center">
                    <Brain className="w-8 h-8 text-[#7C3AED] mb-4" />
                    <h4 className="font-bold text-white mb-2">AI Integration</h4>
                    <p className="text-sm text-white/60">Integrated Gemini API for real-time emotion detection and personalized insights.</p>
                  </GlowCard>
                </FadeIn>
              </div>
              
              <FadeIn delay={0.6} y={30}>
                <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-bold">Other Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlowCard className="p-5 flex items-start gap-4">
                    <Activity className="w-6 h-6 text-[#C026D3] shrink-0" />
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Deep Fake Detection</h4>
                      <p className="text-xs text-white/50">CNN, OpenCV, TensorFlow</p>
                    </div>
                  </GlowCard>
                  <GlowCard className="p-5 flex items-start gap-4">
                    <Globe className="w-6 h-6 text-[#7C3AED] shrink-0" />
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Placement Cell System</h4>
                      <p className="text-xs text-white/50">MERN Stack, Dashboard UI</p>
                    </div>
                  </GlowCard>
                </div>
              </FadeIn>
            </div>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MindTrackLogo size={24} className="text-white/60" />
            <span className="font-bold uppercase tracking-widest text-white/60">MindTrack AI</span>
          </div>
          <div className="text-sm text-white/40 uppercase tracking-widest text-center md:text-right">
            © 2026 MindTrack AI.<br className="md:hidden" /> All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
}
