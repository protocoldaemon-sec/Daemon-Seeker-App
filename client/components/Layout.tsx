import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useGSAPFadeIn } from "@/hooks/useGSAP";
import DaemonLogo from "@/assets/logo/daemon-logo.svg";

export default function Layout({ children }: { children: React.ReactNode }) {
  const contentRef = useGSAPFadeIn(0.3);

  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-h-screen">
          <motion.header 
            className="sticky top-0 z-50 flex items-center justify-center border-b bg-background/80 backdrop-blur-xl px-4 py-4 text-foreground md:hidden relative"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              delay: 0.1 
            }}
          >
            <div className="absolute left-4">
              <MobileNav />
            </div>
            <motion.div 
              className="flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* <DaemonLogo size={24} className="text-foreground" /> */}
              <img src={DaemonLogo} className="text-foreground" width={35} height={35} />

            </motion.div>
            <motion.button
              aria-label="Premium"
              className="absolute right-4 inline-flex items-center justify-center rounded-2xl bg-muted p-4 text-foreground shadow-lg"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Crown className="size-5 text-orange-400" />
            </motion.button>
          </motion.header>
          <div ref={contentRef}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
