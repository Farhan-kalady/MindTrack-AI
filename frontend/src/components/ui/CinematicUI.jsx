import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

/* ==========================================================================
   ANIMATIONS & EFFECTS
========================================================================== */

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export const ScrambleIn = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let timeoutId;
    let frameId;
    
    timeoutId = setTimeout(() => {
      let iteration = 0;
      const animate = () => {
        setDisplayText(
          text.split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === " ") return " ";
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          cancelAnimationFrame(frameId);
        } else {
          iteration += 1/3;
          frameId = requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [isInView, text, delay]);

  return <span ref={ref} className={className}>{displayText || ' '}</span>;
};

export const ScrambleText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text);
      cancelAnimationFrame(frameRef.current);
      return;
    }

    let iteration = 0;
    const animate = () => {
      setDisplayText(
        text.split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      
      if (iteration < text.length) {
        iteration += 1/2;
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => cancelAnimationFrame(frameRef.current);
  }, [isHovering, text]);

  return (
    <span 
      className={className} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  );
};

export const FadeIn = ({ children, delay = 0, duration = 0.8, x = 0, y = 50, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: "50px" }}
    transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedText = ({ text, className="" }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  const characters = text.split("");

  return (
    <p ref={containerRef} className={`${className}`}>
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + (1 / characters.length);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <motion.span key={i} style={{ opacity }}>
            {char}
          </motion.span>
        );
      })}
    </p>
  );
};

/* ==========================================================================
   UI COMPONENTS
========================================================================== */

export const MindTrackLogo = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-5.224 4.468A4.25 4.25 0 0 0 4 17.5a4.25 4.25 0 0 0 8 1.83 4 4 0 0 0 8-1.83 4.25 4.25 0 0 0 3.221-7.907 4 4 0 0 0-5.224-4.468A3 3 0 1 0 12 5Z"/>
    <path d="M12 2v3"/>
    <path d="M12 19v3"/>
    <path d="M18.5 5.5 17 7"/>
    <path d="M7 17l-1.5 1.5"/>
    <path d="M5.5 5.5 7 7"/>
    <path d="M17 17l1.5 1.5"/>
  </svg>
);

export const PrimaryButton = ({ children, onClick, className = '', type = "button", disabled = false }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full bg-white text-[#0A0A0C] uppercase tracking-widest font-bold px-8 py-4 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 font-mono text-sm disabled:opacity-50 disabled:hover:scale-100 ${className}`}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, onClick, className = '', type = "button", disabled = false }) => (
  <button 
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full border border-white/20 text-white uppercase tracking-widest font-bold px-8 py-4 hover:bg-white/10 transition-all duration-300 font-mono text-sm disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const GlowCard = ({ children, className = '' }) => (
  <div className={`border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-sm hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export const Watermark = ({ text }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none">
    <span 
      className="font-anton uppercase opacity-[0.08] whitespace-nowrap"
      style={{ 
        fontSize: 'clamp(120px, 30vw, 500px)',
        background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #DB2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {text}
    </span>
  </div>
);

export const AnimatedBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0A0A0C]">
    <motion.div 
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C3AED]/20 blur-[120px] mix-blend-screen"
    />
    <motion.div 
      animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#C026D3]/15 blur-[120px] mix-blend-screen"
    />
    <motion.div 
      animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-[#DB2777]/10 blur-[120px] mix-blend-screen"
    />
    
    {/* Dot grid overlay */}
    <div 
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    />
  </div>
);

export const SquashHamburger = ({ isOpen, toggle }) => (
  <button 
    onClick={toggle}
    className="relative w-10 h-10 flex items-center justify-center focus:outline-none z-50 lg:hidden"
  >
    <div className="flex flex-col gap-1.5 w-6">
      <motion.span 
        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="block h-0.5 w-full bg-white rounded-full"
      />
      <motion.span 
        animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="block h-0.5 w-full bg-white rounded-full"
      />
      <motion.span 
        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="block h-0.5 w-full bg-white rounded-full"
      />
    </div>
  </button>
);
