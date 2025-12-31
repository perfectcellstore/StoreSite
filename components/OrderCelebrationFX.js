'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// Lightweight canvas FX: fire embers + green ki sparks + aura shimmer.
// Designed to be performance-safe (caps particles, uses RAF, respects reduced motion).
export default function OrderCelebrationFX({ seed = 'victory', className = '', particleLevel = 'high' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rng = useMemo(() => {
    // inline tiny seeded RNG (mulberry32 + string hash)
    const xfnv1a = (str) => {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < str.length; i += 1) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };
    const mulberry32 = (a) => () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return mulberry32(xfnv1a(String(seed || 'victory')));
  }, [seed]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(!!mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();

    const maxParticles = (() => {
      const base = window.innerWidth < 768 ? 70 : 120;
      if (particleLevel === 'low') return Math.floor(base * 0.35);
      if (particleLevel === 'mid') return Math.floor(base * 0.6);
      return base;
    })();

    const spawn = (kind) => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      const base = {
        kind,
        x: rng() * w,
        y: h + 10 + rng() * 40,
        vx: (rng() - 0.5) * (kind === 'ki' ? 0.8 : 0.35),
        vy: -(0.8 + rng() * (kind === 'ki' ? 1.8 : 1.2)),
        life: 0,
        maxLife: 120 + Math.floor(rng() * 120),
        size: kind === 'ki' ? 1.2 + rng() * 2.2 : 1.8 + rng() * 2.8,
        rot: rng() * Math.PI * 2,
        spin: (rng() - 0.5) * 0.06,
      };

      // Fire is orange/red, Ki is green/teal.
      if (kind === 'fire') {
        base.color = rng() > 0.6 ? 'rgba(255,140,60,' : 'rgba(255,70,35,';
        base.glow = 'rgba(255,120,50,';
      } else {
        base.color = rng() > 0.6 ? 'rgba(34,197,94,' : 'rgba(16,185,129,';
        base.glow = 'rgba(34,197,94,';
        // spawn ki a bit higher sometimes
        base.y = h - 40 + rng() * 120;
        base.vy = -(0.6 + rng() * 1.4);
        base.vx = (rng() - 0.5) * 1.2;
      }

      return base;
    };

    const ensurePopulation = () => {
      const p = particlesRef.current;
      while (p.length < maxParticles) {
        p.push(spawn(rng() > 0.55 ? 'fire' : 'ki'));
      }
    };

    ensurePopulation();

    let last = performance.now();

    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw);
      const dt = Math.min(33, t - last);
      last = t;

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      // Fade frame for trails
      ctx.clearRect(0, 0, w, h);

      // Subtle vignette
      const vign = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.35, Math.max(w, h));
      vign.addColorStop(0, 'rgba(34,197,94,0.05)');
      vign.addColorStop(0.55, 'rgba(0,0,0,0.00)');
      vign.addColorStop(1, 'rgba(0,0,0,0.40)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);

      const p = particlesRef.current;

      // occasionally spawn extra bursts
      if (rng() > 0.94) {
        const burst = window.innerWidth < 768 ? 6 : 10;
        for (let i = 0; i < burst; i += 1) {
          p.push(spawn('ki'));
        }
      }

      for (let i = p.length - 1; i >= 0; i -= 1) {
        const part = p[i];
        part.life += 1;
        part.rot += part.spin;

        // motion
        const sway = part.kind === 'ki' ? Math.sin((t / 160) + part.x * 0.02) * 0.22 : Math.sin((t / 220) + part.x * 0.015) * 0.08;
        part.x += (part.vx + sway) * (dt / 16);
        part.y += part.vy * (dt / 16);

        // wrap
        if (part.x < -20) part.x = w + 20;
        if (part.x > w + 20) part.x = -20;

        const age = part.life / part.maxLife;
        const alpha = Math.max(0, 1 - age);

        // draw
        ctx.save();
        ctx.translate(part.x, part.y);
        ctx.rotate(part.rot);

        // glow core
        ctx.beginPath();
        ctx.fillStyle = `${part.glow}${0.20 * alpha})`;
        ctx.arc(0, 0, part.size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // main particle
        ctx.beginPath();
        ctx.fillStyle = `${part.color}${(part.kind === 'ki' ? 0.85 : 0.75) * alpha})`;
        ctx.arc(0, 0, part.size, 0, Math.PI * 2);
        ctx.fill();

        // little spark line for ki
        if (part.kind === 'ki' && rng() > 0.5) {
          ctx.strokeStyle = `rgba(34,197,94,${0.45 * alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-part.size * 2.2, 0);
          ctx.lineTo(part.size * 2.2, 0);
          ctx.stroke();
        }

        ctx.restore();

        // recycle
        if (part.life >= part.maxLife || part.y < -80) {
          p.splice(i, 1);
        }
      }

      // keep population
      ensurePopulation();
    };

    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reducedMotion, rng]);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Aura shimmer */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 50% 30%, rgba(34,197,94,0.20) 0%, rgba(16,185,129,0.08) 40%, transparent 70%),
          radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,90,30,0.12) 0%, transparent 62%)
        `,
        filter: 'blur(18px)',
        animation: reducedMotion ? 'none' : 'victoryAura 6s ease-in-out infinite',
      }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <style jsx>{`
        @keyframes victoryAura {
          0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.95; }
          40% { transform: translate3d(0,-6px,0) scale(1.03); opacity: 1; }
          70% { transform: translate3d(0,4px,0) scale(1.01); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
}
