import { useEffect, useRef } from "react";

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const stars: { x: number; y: number; size: number; opacity: number; speed: number; phase: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      stars.length = 0;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.floor((w * h) / 4000);

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          speed: Math.random() * 0.3 + 0.05,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    let time = 0;
    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      const edgeFade = 120; // px from edges to fade out

      for (const star of stars) {
        const flicker = Math.sin(time * star.speed * 10 + star.phase) * 0.3 + 0.7;

        // Fade near edges so stars don't get cut off
        const fadeBottom = Math.min(1, (h - star.y) / edgeFade);
        const fadeTop = Math.min(1, star.y / edgeFade);
        const fadeLeft = Math.min(1, star.x / edgeFade);
        const fadeRight = Math.min(1, (w - star.x) / edgeFade);
        const edgeAlpha = fadeBottom * fadeTop * fadeLeft * fadeRight;

        const alpha = star.opacity * flicker * edgeAlpha;
        if (alpha < 0.01) continue;

        // Cyan-tinted stars matching --primary (175 80% 50%)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(175, 60%, 80%, ${alpha})`;
        ctx.fill();

        // Subtle glow on larger stars
        if (star.size > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(175, 80%, 60%, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
};

export default StarfieldBackground;