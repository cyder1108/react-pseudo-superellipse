import React from 'react';

type SuperEllipseResponsiveParams = {
    [key: string]: number;
} & {
    default: number;
};
type SuperEllipseProps = React.HTMLAttributes<HTMLDivElement> & {
    tag?: React.ElementType;
    exponent?: number;
    radius?: number | SuperEllipseResponsiveParams;
    round?: number | SuperEllipseResponsiveParams;
    quality?: number;
};
declare const SuperEllipse: ({ tag: Component, style, exponent, radius: radiusArg, round: roundArg, quality, ...rest }: SuperEllipseProps) => React.JSX.Element;

export { SuperEllipse };
export type { SuperEllipseProps };
