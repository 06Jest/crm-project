import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedNumber({
  to, prefix = '', suffix = '', duration = 2200,
}: Props) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.unobserve(el); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // Ease out expo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.floor(eased * to));
      if (p < 1) requestAnimationFrame(step);
      else setValue(to);
    };
    requestAnimationFrame(step);
  }, [started, to, duration]);

  return <span ref={spanRef}>{prefix}{value.toLocaleString()}{suffix}</span>;
}