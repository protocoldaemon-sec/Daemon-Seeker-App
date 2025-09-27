import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-rose-400">
      <div className="relative grid min-h-screen place-items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-white"
        >
          <div className="mb-6 grid size-28 place-items-center rounded-3xl bg-white/10 backdrop-blur">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="size-16 rounded-2xl bg-gradient-to-br from-white to-white/60 shadow-2xl"
            />
          </div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold tracking-tight"
          >
            Daemon
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm text-white/80"
          >
            Poppins + Tailwind • Splash Animation
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
