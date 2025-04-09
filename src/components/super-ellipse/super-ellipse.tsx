import React, { useRef, useEffect, useMemo, useCallback } from "react";

export type SuperEllipseProps = React.HTMLAttributes<HTMLDivElement> & {
  tag?: React.ElementType;
  exponent?: number;
  radius?: number;
  round?: number; // 一般的なborder-radiusに近い角丸
  quality?: number;
};

const format = (n: number) => n.toFixed(2);

export const SuperEllipse = ({
  tag: Component = "div",
  style,
  exponent = 4,
  radius: radiusArg,
  round: roundArg,
  quality = 0.5,
  ...rest
}: SuperEllipseProps) => {
  const ref = useRef<HTMLElement>(null);

  const { computedRadius, computedRound, arcSteps } = useMemo(() => {
    let computedRound = 0;
    let computedRadius: number | undefined;
    if (roundArg !== undefined) {
      computedRound = roundArg;
      computedRadius = (exponent / 2) * roundArg;
    } else if (radiusArg !== undefined) {
      computedRadius = radiusArg;
      computedRound = (2 / exponent) * radiusArg;
    }
    return { computedRadius, computedRound, arcSteps: Math.max(1, Math.round( computedRound / 2 * Math.PI * quality )) };
  }, [roundArg, radiusArg, exponent]);

  const quarterSuperEllipse = useCallback((
    cx: number,
    cy: number,
    d: number,
    quadrant: number, // 0:bottom-right / 1:bottom-left / 2:top-left / 3:top-right
    exp: number,
    steps: number
  ): string[] => {
    const startAngle = (quadrant % 4) * (Math.PI / 2);
    const endAngle = startAngle + (Math.PI / 2);
    const pts: string[] = [];
    const a = d / 2;
    const b = d / 2;

    for (let i = 0; i <= steps; i++) {
      const t = startAngle + ((endAngle - startAngle) * i) / steps;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const factorX = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exp);
      const factorY = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exp);
      pts.push(`${format(cx + a * factorX)} ${format(cy + b * factorY)}`);
    }
    return pts;
  }, []);

  const addQuarterArcSegment = useCallback((
    pts: string[],
    cx: number,
    cy: number,
    d: number,
    quadrant: number
  ) => {
    const stepsForArc = Math.max(4, arcSteps);
    const arcPoints = quarterSuperEllipse(cx, cy, d, quadrant, exponent, stepsForArc);
    arcPoints.slice(1).forEach((pt) => pts.push(`L ${pt}`));
  }, [arcSteps, exponent, quarterSuperEllipse]);

  const buildClipPath = useCallback((W: number, H: number): string => {
    const pts: string[] = [];
    const diameter = typeof computedRadius === "number" ? Math.min(computedRadius * 2, W, H) : Math.min(W, H);
    pts.push(`M ${format(diameter / 2)} 0`);
    pts.push(`L ${format(W - diameter / 2)} 0`);
    addQuarterArcSegment( pts, W - diameter / 2, diameter / 2, diameter, 3);
    pts.push(`L ${format(W)} ${format(H - diameter / 2)}`);
    addQuarterArcSegment( pts, W - diameter / 2, H - diameter / 2, diameter, 0);
    pts.push(`L ${format(diameter / 2)} ${format(H)}`);
    addQuarterArcSegment( pts, diameter / 2, H - diameter / 2, diameter, 1);
    pts.push(`L ${format(0)} ${format(diameter / 2)}`);
    addQuarterArcSegment( pts, diameter / 2, diameter / 2, diameter, 2);
    pts.push("Z");
    return pts.join(" ");
  }, [computedRadius, addQuarterArcSegment]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const updateClipPath = () => {
      const { offsetWidth: W, offsetHeight: H } = el;
      const path = buildClipPath(W, H).replace(/\s+/g, " ").trim();
      el.style.clipPath = `path('${path}')`;
    };

    updateClipPath();
    const ro = new ResizeObserver(updateClipPath);
    ro.observe(el);
    return () => ro.disconnect();
  }, [buildClipPath]);

  return (
    <Component
      ref={ref}
      style={{
        ...style,
        ...(!style?.clipPath ? { borderRadius: `${computedRound}px` } : {}),
      }}
      {...rest}
    />
  );
}

