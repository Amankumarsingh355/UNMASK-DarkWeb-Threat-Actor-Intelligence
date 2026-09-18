import React, { useEffect, useRef } from 'react';

interface FuturisticHudBackgroundProps {
  theme?: 'dark' | 'light';
  showInteractiveParticles?: boolean;
}

export const FuturisticHudBackground: React.FC<FuturisticHudBackgroundProps> = ({
  theme = 'dark',
  showInteractiveParticles = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (theme === 'light' || !showInteractiveParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Glowing Circuit Data Nodes & Packets
    interface NodePacket {
      x: number;
      y: number;
      radius: number;
      targetRadius: number;
      glowIntensity: number;
      pulseSpeed: number;
      pulsePhase: number;
      connections: { targetIndex: number; progress: number; speed: number }[];
    }

    // Fixed key node coordinates positioned across the screen mirroring the reference circuit board
    const keyNodes: { xPercent: number; yPercent: number; isMajor?: boolean }[] = [
      { xPercent: 0.12, yPercent: 0.18, isMajor: true },
      { xPercent: 0.22, yPercent: 0.12, isMajor: false },
      { xPercent: 0.28, yPercent: 0.24, isMajor: true },
      { xPercent: 0.35, yPercent: 0.15, isMajor: false },
      { xPercent: 0.45, yPercent: 0.22, isMajor: true },
      { xPercent: 0.52, yPercent: 0.38, isMajor: false },
      { xPercent: 0.42, yPercent: 0.48, isMajor: true },
      { xPercent: 0.68, yPercent: 0.28, isMajor: true },
      { xPercent: 0.78, yPercent: 0.42, isMajor: false },
      { xPercent: 0.85, yPercent: 0.32, isMajor: true },
      { xPercent: 0.92, yPercent: 0.55, isMajor: false },
      { xPercent: 0.82, yPercent: 0.68, isMajor: true },
      { xPercent: 0.62, yPercent: 0.72, isMajor: false },
      { xPercent: 0.48, yPercent: 0.82, isMajor: true },
      { xPercent: 0.25, yPercent: 0.65, isMajor: false },
      { xPercent: 0.15, yPercent: 0.78, isMajor: true },
      { xPercent: 0.08, yPercent: 0.45, isMajor: false }
    ];

    const nodes: NodePacket[] = keyNodes.map((kn, idx) => ({
      x: kn.xPercent * width,
      y: kn.yPercent * height,
      radius: kn.isMajor ? 3.5 : 2.0,
      targetRadius: kn.isMajor ? 4.5 : 2.5,
      glowIntensity: kn.isMajor ? 1.0 : 0.6,
      pulseSpeed: 0.02 + (idx % 4) * 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
      connections: [
        {
          targetIndex: (idx + 1) % keyNodes.length,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004
        }
      ]
    }));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Re-update node positions on resize
      nodes.forEach((node, i) => {
        node.x = keyNodes[i].xPercent * width;
        node.y = keyNodes[i].yPercent * height;
        node.pulsePhase += node.pulseSpeed;
      });

      // 1. Draw 90° & 45° Circuit Traces between nodes
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const from = nodes[i];
        const nextIdx = (i + 1) % nodes.length;
        const to = nodes[nextIdx];

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(30, 144, 255, 0.32)';
        ctx.moveTo(from.x, from.y);

        // Manhatten 90-degree circuit route
        const midX = (from.x + to.x) / 2;
        ctx.lineTo(midX, from.y);
        ctx.lineTo(midX, to.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Draw animated data signal pulse packet traveling along circuit trace
        from.connections.forEach(conn => {
          conn.progress += conn.speed;
          if (conn.progress > 1) conn.progress = 0;

          // Calculate current coordinate along Manhattan path
          let px = from.x;
          let py = from.y;
          const p = conn.progress;

          if (p < 0.33) {
            const subP = p / 0.33;
            px = from.x + (midX - from.x) * subP;
            py = from.y;
          } else if (p < 0.66) {
            const subP = (p - 0.33) / 0.33;
            px = midX;
            py = from.y + (to.y - from.y) * subP;
          } else {
            const subP = (p - 0.66) / 0.34;
            px = midX + (to.x - midX) * subP;
            py = to.y;
          }

          // Draw Glowing Packet Head
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 7);
          grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
          grad.addColorStop(0.3, 'rgba(0, 229, 255, 0.9)');
          grad.addColorStop(1, 'rgba(30, 144, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 2. Draw Glowing Circuit Nodes
      nodes.forEach(node => {
        const pulse = (Math.sin(node.pulsePhase) + 1) / 2; // 0 to 1
        const r = node.radius + pulse * 1.8;
        const outerGlowRadius = r * 5.0;

        // Outer radial halo glow
        const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, outerGlowRadius);
        glowGrad.addColorStop(0, `rgba(30, 144, 255, ${0.55 * node.glowIntensity + pulse * 0.35})`);
        glowGrad.addColorStop(0.5, `rgba(0, 191, 255, ${0.25 * node.glowIntensity})`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, outerGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Bright Solid Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Node Ring
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, showInteractiveParticles]);

  if (theme === 'light') return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Space Navy Foundation with Subtle Vignette */}
      <div 
        className="absolute inset-0 bg-[#020713]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 18%, rgba(14, 48, 98, 0.55) 0%, rgba(2, 7, 19, 0.95) 60%, #01040a 100%),
            linear-gradient(to right, rgba(30, 144, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 144, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 36px 36px, 36px 36px'
        }}
      />

      {/* 2. Authentic Reference Background Texture Layer (High visibility & contrast) */}
      <div 
        className="absolute inset-0 opacity-85 mix-blend-screen bg-no-repeat bg-left-top bg-cover md:bg-contain"
        style={{
          backgroundImage: `url('/hud-circuit-bg.png')`,
          filter: 'contrast(1.15) brightness(1.1)'
        }}
      />

      {/* 3. Top-Left High-Tech Concentric HUD Ring Motif (Vector SVG with smooth keyframe animations) */}
      <div className="absolute -top-12 -left-12 sm:-top-8 sm:-left-8 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[640px] md:h-[640px] opacity-95">
        <svg 
          viewBox="0 0 600 600" 
          className="w-full h-full"
        >
          <defs>
            {/* Electric Blue Radial Glows & Filters */}
            <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ring-glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00BFFF" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#1E90FF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020814" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center Glow Ambient */}
          <circle cx="300" cy="300" r="280" fill="url(#ring-glow-grad)" />

          {/* Outermost Segmented Dial Ring (Clockwise Rotation) */}
          <g className="origin-center animate-[rotate-hud-cw_50s_linear_infinite]">
            <circle 
              cx="300" 
              cy="300" 
              r="270" 
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="1.5" 
              strokeDasharray="6 12 24 12"
              strokeOpacity="0.35" 
            />
            <circle 
              cx="300" 
              cy="300" 
              r="255" 
              fill="none" 
              stroke="#00BFFF" 
              strokeWidth="1" 
              strokeDasharray="2 8" 
              strokeOpacity="0.4" 
            />
            {/* Angle Markers */}
            <line x1="300" y1="20" x2="300" y2="38" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="300" y1="562" x2="300" y2="580" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="20" y1="300" x2="38" y2="300" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.7" />
            <line x1="562" y1="300" x2="580" y2="300" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.7" />
          </g>

          {/* Main Segmented Tech Gauge Arcs (Counter-Clockwise Rotation) */}
          <g className="origin-center animate-[rotate-hud-ccw_35s_linear_infinite]">
            <circle 
              cx="300" 
              cy="300" 
              r="220" 
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="8" 
              strokeDasharray="40 18 12 18 80 30" 
              strokeOpacity="0.45"
              filter="url(#hud-glow)"
            />
            <circle 
              cx="300" 
              cy="300" 
              r="200" 
              fill="none" 
              stroke="#38BDF8" 
              strokeWidth="1" 
              strokeDasharray="8 6" 
              strokeOpacity="0.5" 
            />
          </g>

          {/* High-Precision Inner Radar Reticle (Clockwise Rotation) */}
          <g className="origin-center animate-[rotate-hud-cw_20s_linear_infinite]">
            <circle 
              cx="300" 
              cy="300" 
              r="160" 
              fill="none" 
              stroke="#00E5FF" 
              strokeWidth="2.5" 
              strokeDasharray="90 30 45 30" 
              strokeOpacity="0.65"
              filter="url(#hud-glow)"
            />
            <circle 
              cx="300" 
              cy="300" 
              r="135" 
              fill="none" 
              stroke="#1E90FF" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              strokeOpacity="0.4" 
            />
            {/* Targeting Reticle Corners */}
            <path d="M 230,230 L 210,230 L 210,250" fill="none" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.8" />
            <path d="M 370,230 L 390,230 L 390,250" fill="none" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.8" />
            <path d="M 230,370 L 210,370 L 210,350" fill="none" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.8" />
            <path d="M 370,370 L 390,370 L 390,350" fill="none" stroke="#00BFFF" strokeWidth="2" strokeOpacity="0.8" />
          </g>

          {/* Innermost Core Radar Sphere & Crosshairs */}
          <circle 
            cx="300" 
            cy="300" 
            r="85" 
            fill="none" 
            stroke="#1E90FF" 
            strokeWidth="2" 
            strokeOpacity="0.5" 
          />
          <circle 
            cx="300" 
            cy="300" 
            r="45" 
            fill="rgba(30, 144, 255, 0.12)" 
            stroke="#00E5FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.8" 
          />
          <circle 
            cx="300" 
            cy="300" 
            r="8" 
            fill="#00BFFF" 
            filter="url(#hud-glow)"
          />

          {/* Connecting 45-degree circuit leads radiating from the dial */}
          <path 
            d="M 450,200 L 520,200 L 560,240 L 590,240" 
            fill="none" 
            stroke="#1E90FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.45" 
          />
          <circle cx="590" cy="240" r="3" fill="#00E5FF" filter="url(#hud-glow)" />

          <path 
            d="M 420,380 L 480,440 L 540,440" 
            fill="none" 
            stroke="#1E90FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.45" 
          />
          <circle cx="540" cy="440" r="3" fill="#00E5FF" filter="url(#hud-glow)" />

          <path 
            d="M 240,480 L 240,540 L 290,590" 
            fill="none" 
            stroke="#1E90FF" 
            strokeWidth="1.5" 
            strokeOpacity="0.45" 
          />
          <circle cx="290" cy="590" r="3" fill="#00E5FF" filter="url(#hud-glow)" />
        </svg>
      </div>

      {/* 4. Canvas for Animated Pulsing Circuit Nodes & Traveling Packets */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />

      {/* 5. Subtle CRT Scanline overlay for tactical depth */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 191, 255, 0.08) 50%)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  );
};
