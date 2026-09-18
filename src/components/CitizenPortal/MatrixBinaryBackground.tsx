import React, { useEffect, useRef } from 'react';

interface MatrixBinaryBackgroundProps {
  isLight?: boolean;
  opacity?: number;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  lastCharChange: number;
}

export const MatrixBinaryBackground: React.FC<MatrixBinaryBackgroundProps> = ({ 
  isLight = false,
  opacity = 0.85 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isLight) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Iconic Matrix Rain Characters (Binary, Hex, Cyber & Katakana)
    const matrixChars = [
      '0', '1', '0', '1', '1', '0', '0', '1',
      '0x', 'FF', 'A9', '3C', '7E', 'C4', '8B', '5F',
      '日', 'ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ｸ', 'ﾔ', 'ﾜ', 'ﾂ', 'ﾘ', 'ｹ', 'ﾒ',
      'λ', 'Ω', '§', 'Ψ', 'Δ', 'Σ', '⚡', 'Ø',
      '0', '1', '0', '1'
    ];

    // Larger, bold font size for prominent visibility
    const fontSize = 20;
    const colSpacing = 22;
    let numColumns = Math.ceil(width / colSpacing);

    const initColumns = (): MatrixColumn[] => {
      const cols: MatrixColumn[] = [];
      for (let i = 0; i < numColumns; i++) {
        cols.push({
          x: i * colSpacing,
          y: Math.floor(Math.random() * -height),
          // Moderately energetic, responsive fall speed
          speed: Math.random() * 0.45 + 0.45,
          chars: Array.from({ length: 24 }, () => matrixChars[Math.floor(Math.random() * matrixChars.length)]),
          lastCharChange: 0
        });
      }
      return cols;
    };

    let columns = initColumns();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      numColumns = Math.ceil(width / colSpacing);
      columns = initColumns();
    };

    window.addEventListener('resize', handleResize);

    // Initial background clear to deep pure black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    let frameCount = 0;

    const render = () => {
      frameCount++;

      // Soft black fade for smooth, energetic neon green trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px 'Chivo Mono', 'JetBrains Mono', 'Courier New', monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Slightly faster, crisp character mutation rate
        if (frameCount % 8 === 0 && Math.random() > 0.55) {
          const charIdx = Math.floor(Math.random() * col.chars.length);
          col.chars[charIdx] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }

        const headY = col.y;

        // Render stream characters from head down to tail
        for (let j = 0; j < col.chars.length; j++) {
          const charY = headY - (j * fontSize);
          if (charY < -fontSize || charY > height + fontSize) continue;

          const char = col.chars[j];

          if (j === 0) {
            // Bright white-green leading head drop with intense neon green halo
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00ff66';
            ctx.shadowBlur = 16;
            ctx.fillText(char, col.x, charY);
          } else if (j < 3) {
            // High-voltage Matrix neon green
            ctx.fillStyle = '#00ff41';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 10;
            ctx.fillText(char, col.x, charY);
          } else if (j < 10) {
            // Vibrant Matrix green stream
            ctx.fillStyle = 'rgba(0, 255, 65, 0.85)';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 4;
            ctx.fillText(char, col.x, charY);
          } else if (j < 18) {
            // Fading green trail
            ctx.fillStyle = 'rgba(0, 210, 55, 0.45)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(char, col.x, charY);
          } else {
            // Faint tail drop
            ctx.fillStyle = 'rgba(0, 160, 40, 0.2)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillText(char, col.x, charY);
          }
        }

        // Reset shadow for next column
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Advance column at a lively, medium-fast speed (~3px/frame)
        col.y += col.speed * fontSize * 0.28;

        // Reset column to top once entire stream passes screen bottom
        if (col.y - (col.chars.length * fontSize) > height) {
          col.y = Math.floor(Math.random() * -100);
          col.speed = Math.random() * 0.45 + 0.45;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  if (isLight) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#000000]">
      {/* Dynamic Cascading Matrix Green Rain Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{ opacity }}
        className="absolute inset-0 w-full h-full mix-blend-screen"
      />

      {/* Deep Cyberpunk Dark Vignette & Emerald / Matrix Green Radial Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/70 via-transparent to-[#000000]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,255,65,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(0,255,65,0.09),transparent_80%)]" />

      {/* Scanline CRT Grid Texture */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10" />
    </div>
  );
};



