import React from "react";
import { motion } from "framer-motion";

type Props = {
  count?: number;
  color?: string; // rgba color base
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function GlowParticles({ count = 9, color = "59,130,246" /* tailwind blue-500 */ }: Props) {
  const particles = React.useMemo(() =>
    new Array(count).fill(0).map((_, i) => ({
      id: i,
      size: rand(10, 18), // vmin
      x1: rand(-40, 40),
      y1: rand(-35, 35),
      x2: rand(-40, 40),
      y2: rand(-35, 35),
      delay: rand(0, 3),
      duration: rand(10, 14),
      opacity: rand(0.18, 0.35),
    })),
  [count]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x1}vmin`,
            y: `${p.y1}vmin`,
            scale: 1,
            opacity: p.opacity,
          }}
          animate={{
            x: [`${p.x1}vmin`, `${p.x2}vmin`, `${p.x1}vmin`],
            y: [`${p.y1}vmin`, `${p.y2}vmin`, `${p.y1}vmin`],
            scale: [1, 1.08, 1],
            opacity: [p.opacity * 0.8, p.opacity, p.opacity * 0.8],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${p.size}vmin`,
            height: `${p.size}vmin`,
            borderRadius: "9999px",
            background: `radial-gradient(circle at 50% 50%, rgba(${color},0.25) 0%, rgba(${color},0.12) 45%, rgba(${color},0.0) 70%)`,
            filter: "blur(20px)",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
