import { useEffect, useRef } from "react";

type Star = { x: number; y: number; size: number; opacity: number; speed: number; phase: number };

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const stars: Star[] = [];
    let width = 0;
    let height = 0;

    const makeStar = (w: number, h: number): Star => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      phase: Math.random() * Math.PI * 2,
    });

    // Grow or shrink the field to match the current box instead of rebuilding it,
    // so a late layout shift doesn't make the whole sky blink.
    const syncStars = (w: number, h: number) => {
      const count = Math.floor((w * h) / 4000);

      if (stars.length > count) stars.length = count;
      for (const star of stars) {
        if (star.x > w) star.x = Math.random() * w;
        if (star.y > h) star.y = Math.random() * h;
      }
      while (stars.length < count) stars.push(makeStar(w, h));
    };

    const measure = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return;

      const dpr = window.devicePixelRatio || 1;
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // setTransform, not scale: scale compounds if the browser skips the
      // implicit reset when the bitmap dimensions happen to be unchanged.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      syncStars(w, h);
    };

    let time = 0;
    const animate = () => {
      const w = width;
      const h = height;
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

    measure();
    animate();

    // The hero settles after mount (avatar load, font swap, entrance animation),
    // so track the real box rather than measuring once and trusting it.
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);

    // A monitor change alters devicePixelRatio without changing the CSS box.
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
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
