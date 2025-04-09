
'use client';
'use strict';

var React = require('react');

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
    const ref = React.useRef(null);
    const { computedRadius, computedRound, arcSteps } = React.useMemo(() => {
        let computedRound = 0;
        let computedRadius;
        if (roundArg !== undefined) {
            computedRound = roundArg;
            computedRadius = (exponent / 2) * roundArg;
        }
        else if (radiusArg !== undefined) {
            computedRadius = radiusArg;
            computedRound = (2 / exponent) * radiusArg;
        }
        return { computedRadius, computedRound, arcSteps: Math.max(1, Math.round(computedRound / 2 * Math.PI * quality)) };
    }, [roundArg, radiusArg, exponent]);
    const quarterSuperEllipse = React.useCallback((cx, cy, d, quadrant, // 0:bottom-right / 1:bottom-left / 2:top-left / 3:top-right
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
    const addQuarterArcSegment = React.useCallback((pts, cx, cy, d, quadrant) => {
        const stepsForArc = Math.max(4, arcSteps);
        const arcPoints = quarterSuperEllipse(cx, cy, d, quadrant, exponent, stepsForArc);
        arcPoints.slice(1).forEach((pt) => pts.push(`L ${pt}`));
    }, [arcSteps, exponent, quarterSuperEllipse]);
    const buildClipPath = React.useCallback((W, H) => {
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
    React.useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
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
    return (React.createElement(Component, Object.assign({ ref: ref, style: Object.assign(Object.assign({}, style), (!(style === null || style === void 0 ? void 0 : style.clipPath) ? { borderRadius: `${computedRound}px` } : {})) }, rest)));
};

exports.SuperEllipse = SuperEllipse;
