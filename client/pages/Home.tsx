import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Sphere from "@/components/Sphere";
import { Link } from "react-router-dom";
import { Shield, MessageSquare, History } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGSAPStagger, useRevealOnScroll } from "@/hooks/useGSAP";

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cardsRef = useGSAPStagger('.feature-card', 0.5);
  
  // Ensure component is mounted before applying theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <motion.div 
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        resolvedTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header - Dynamic component */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2
        }}
      >
        <Header 
          title="Daemon" 
          centerTitle={true} 
          bgOpacity={0} 
          borderOpacity={0}
          blur="none"
          showBorder={false}
        />
      </motion.div>

      {/* Sphere Background - Fullscreen */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut",
          delay: 0.3
        }}
      >
        <Sphere theme={resolvedTheme} />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-h-screen">
          <section className="flex h-screen flex-col items-center justify-end px-4 pb-6 pt-16 md:pb-8">
            <div className="mx-auto w-full max-w-4xl">
              {/* Feature Cards */}
              <div ref={cardsRef} className="flex flex-wrap justify-center gap-3 md:gap-4">
                <Link to="/audit" className="feature-card w-[calc(33.333%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] max-w-[140px]">
                  <motion.div 
                    className={`group h-full cursor-pointer rounded-2xl md:rounded-3xl backdrop-blur-xl border p-4 md:p-6 transition-all duration-500 hover-lift glow-effect ${
                    resolvedTheme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20'
                      : 'bg-white/90 border-slate-200/50 shadow-sm'
                  }`}
                    whileHover={{ 
                      scale: 1.08,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="mb-2 md:mb-3 mx-auto flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </motion.div>
                    <h3 className={`mb-1 text-center font-semibold text-xs md:text-sm ${
                      resolvedTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>Audit Contract</h3>
                    <p className={`text-center text-[10px] md:text-xs leading-relaxed line-clamp-2 ${
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                    }`}>
                      Deep analysis
                    </p>
                  </motion.div>
                </Link>

                <Link to="/chat" className="feature-card w-[calc(33.333%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] max-w-[140px]">
                  <motion.div 
                    className={`group h-full cursor-pointer rounded-2xl md:rounded-3xl backdrop-blur-xl border p-4 md:p-6 transition-all duration-500 hover-lift glow-effect ${
                    resolvedTheme === 'dark'
                      ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20'
                      : 'bg-white/90 border-slate-200/50 shadow-sm'
                  }`}
                    whileHover={{ 
                      scale: 1.08,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="mb-2 md:mb-3 mx-auto flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </motion.div>
                    <h3 className={`mb-1 text-center font-semibold text-xs md:text-sm ${
                      resolvedTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>AI Copilot</h3>
                    <p className={`text-center text-[10px] md:text-xs leading-relaxed line-clamp-2 ${
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                    }`}>
                      Chat with AI
                    </p>
                  </motion.div>
                </Link>

                <Link to="/history" className="feature-card w-[calc(33.333%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] max-w-[140px]">
                  <motion.div 
                    className={`group h-full cursor-pointer rounded-2xl md:rounded-3xl backdrop-blur-xl border p-4 md:p-6 transition-all duration-500 hover-lift glow-effect ${
                    resolvedTheme === 'dark'
                      ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20'
                      : 'bg-white/90 border-slate-200/50 shadow-sm'
                  }`}
                    whileHover={{ 
                      scale: 1.08,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="mb-2 md:mb-3 mx-auto flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <History className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </motion.div>
                    <h3 className={`mb-1 text-center font-semibold text-xs md:text-sm ${
                      resolvedTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}>Audit History</h3>
                    <p className={`text-center text-[10px] md:text-xs leading-relaxed line-clamp-2 ${
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                    }`}>
                      View reports
                    </p>
                  </motion.div>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </motion.div>
  );
}
