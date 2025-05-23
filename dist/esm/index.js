
'use client';
import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const format = (n) => n.toFixed(2);
const SuperEllipse = (_a) => {
    var { tag: Component = "div", style, exponent = 4, radius: radiusArg, round: roundArg, quality = 0.5 } = _a, rest = __rest(_a, ["tag", "style", "exponent", "radius", "round", "quality"]);
    const ref = useRef(null);
    const [width, setWidth] = useState(null);
    const { computedRadius, computedRound, arcSteps } = useMemo(() => {
        let computedRound = 0;
        let computedRadius;
        const round = (() => {
            if (typeof roundArg === "number")
                return roundArg;
            if (typeof roundArg === "object") {
                const { default: defaultRound } = roundArg, rest = __rest(roundArg, ["default"]);
                if (width === null)
                    return defaultRound;
                const key = Math.max(-1, ...Object.keys(rest).map(k => +k).filter(k => width >= +k));
                if (key < 0)
                    return defaultRound;
                return rest[key];
            }
            return void 0;
        })();
        const radius = (() => {
            if (typeof radiusArg === "number")
                return radiusArg;
            if (typeof radiusArg === "object") {
                const { default: defaultRadius } = radiusArg, rest = __rest(radiusArg, ["default"]);
                if (width === null)
                    return defaultRadius;
                const key = Math.max(-1, ...Object.keys(rest).map(k => +k).filter(k => width >= +k));
                if (key < 0)
                    return defaultRadius;
                return rest[key];
            }
            return void 0;
        })();
        if (round !== void 0) {
            computedRound = round;
            computedRadius = (exponent / 2) * round;
        }
        else if (radius !== void 0) {
            computedRadius = radius;
            computedRound = (2 / exponent) * radius;
        }
        return { computedRadius, computedRound, arcSteps: Math.max(1, Math.round((computedRound || 20) / 2 * Math.PI * quality)) };
    }, [width, roundArg, radiusArg, exponent]);
    const quarterSuperEllipse = useCallback((cx, cy, d, quadrant, // 0:bottom-right / 1:bottom-left / 2:top-left / 3:top-right
    exp, steps) => {
        const startAngle = (quadrant % 4) * (Math.PI / 2);
        const endAngle = startAngle + (Math.PI / 2);
        const pts = [];
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
    const addQuarterArcSegment = useCallback((pts, cx, cy, d, quadrant) => {
        const stepsForArc = Math.max(4, arcSteps);
        const arcPoints = quarterSuperEllipse(cx, cy, d, quadrant, exponent, stepsForArc);
        arcPoints.slice(1).forEach((pt) => pts.push(`L ${pt}`));
    }, [arcSteps, exponent, quarterSuperEllipse]);
    const buildClipPath = useCallback((W, H) => {
        const pts = [];
        const diameter = typeof computedRadius === "number" ? Math.min(computedRadius * 2, W, H) : Math.min(W, H);
        pts.push(`M ${format(diameter / 2)} 0`);
        pts.push(`L ${format(W - diameter / 2)} 0`);
        addQuarterArcSegment(pts, W - diameter / 2, diameter / 2, diameter, 3);
        pts.push(`L ${format(W)} ${format(H - diameter / 2)}`);
        addQuarterArcSegment(pts, W - diameter / 2, H - diameter / 2, diameter, 0);
        pts.push(`L ${format(diameter / 2)} ${format(H)}`);
        addQuarterArcSegment(pts, diameter / 2, H - diameter / 2, diameter, 1);
        pts.push(`L ${format(0)} ${format(diameter / 2)}`);
        addQuarterArcSegment(pts, diameter / 2, diameter / 2, diameter, 2);
        pts.push("Z");
        return pts.join(" ");
    }, [computedRadius, addQuarterArcSegment]);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const updateClipPath = () => {
            const { offsetWidth: W, offsetHeight: H } = el;
            setWidth(W);
            const path = buildClipPath(W, H).replace(/\s+/g, " ").trim();
            el.style.clipPath = `path('${path}')`;
        };
        updateClipPath();
        const ro = new ResizeObserver(updateClipPath);
        ro.observe(el);
        return () => ro.disconnect();
    }, [buildClipPath, setWidth]);
    return (React.createElement(Component, Object.assign({ ref: ref, style: Object.assign(Object.assign({}, style), (!(style === null || style === void 0 ? void 0 : style.clipPath) ? { borderRadius: `${computedRound}px` } : {})) }, rest)));
};

export { SuperEllipse };
