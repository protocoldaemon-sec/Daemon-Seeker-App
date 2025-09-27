import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 6200);
    const t2 = setTimeout(() => navigate("/onboarding"), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      <div className="relative grid min-h-screen place-items-center">
        {/* soft radial glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* smoother, larger blue glows with blur and gentle pulse; zoom out on exit */}
          <motion.div
            className="absolute left-1/2 top-1/2 -z-10 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.15) 45%, transparent 70%)" }}
            animate={exiting ? { scale: 1.6, opacity: 0 } : { scale: [1, 1.06, 1], opacity: [0.75, 0.9, 0.75] }}
            transition={{ duration: exiting ? 0.8 : 7, repeat: exiting ? 0 : Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -z-10 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0.12) 50%, transparent 75%)" }}
            animate={exiting ? { scale: 1.8, opacity: 0 } : { scale: [1.02, 1.08, 1.02], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: exiting ? 0.8 : 7, repeat: exiting ? 0 : Infinity, ease: "easeInOut" }}
          />
          {/* corner soft blue accents */}
          <motion.div
            className="absolute left-[15%] top-[20%] -z-10 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.25), transparent 70%)" }}
            animate={exiting ? { opacity: 0 } : { opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: exiting ? 0.8 : 7, repeat: exiting ? 0 : Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[12%] bottom-[15%] -z-10 h-[42vmin] w-[42vmin] translate-x-1/2 translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "radial-gradient(closest-side, rgba(29,78,216,0.22), transparent 70%)" }}
            animate={exiting ? { opacity: 0 } : { opacity: [0.18, 0.3, 0.18] }}
            transition={{ duration: exiting ? 0.8 : 7, repeat: exiting ? 0 : Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={exiting ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: exiting ? 0.8 : 0.8, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="relative mb-6 grid place-items-center rounded-3xl bg-white/5 p-12 backdrop-blur-md"
            initial={{ y: 6 }}
            animate={exiting ? { scale: 1.8, y: 0 } : { y: [6, -4, 6] }}
            transition={exiting ? { duration: 0.8, ease: "easeInOut" } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://cdn.builder.io/o/assets%2Fab5c614cfe5b4908ac888441c9926f4e%2F07ba890e3aab4ca6849316c4a5f61771?alt=media&token=4e518cea-12ba-4b50-9caa-0bb566b9a85e&apiKey=ab5c614cfe5b4908ac888441c9926f4e"
              alt="Daemon blink logo"
              className="h-72 w-72 object-contain md:h-80 md:w-80"
            />
            {/* subtle shine sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: ["-120%", "120%"], opacity: [0, 0.35, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
