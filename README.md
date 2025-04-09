# SuperEllipse Component

## Overview

The `SuperEllipse` component is a React-based utility for dynamically generating a clip path that shapes an element like a superellipse. You can customize the shape using properties such as `exponent`, `radius`, and `round`. A `quality` parameter allows you to control the smoothness of the curve.
## Installation

Ensure that your project already uses React. Then, include the component in your project. For example, if you are publishing it as an npm package:

```bash
npm install react-pseudo-superellipse
```

## Usage Example

Here’s a simple example of how to use the SuperEllipse component in your React application:
``` jsx
import React from "react";
import { SuperEllipse } from "react-pseudo-superellipse";

const App = () => {
  return (
    <SuperEllipse
      style={{ width: "300px", height: "300px", background: "#fcc" }}
      exponent={4}   // Adjusts the curvature of the superellipse
      round={40}     // Defines a border-radius-like curvature
      quality={0.5}  // Controls the smoothness of the curve
    >
      Sample Content
    </SuperEllipse>
  );
};

export default App;
```

## Component Properties

|**Property**|**Type**|**Default**|**Description**|
|---|---|---|---|
|tag|React.ElementType|"div"|Specifies the HTML element used to wrap the component.|
|exponent|number|4|Determines the curvature of the superellipse. A higher value results in a shape with smoother and rounder corners.|
|radius|number|—|Sets the radius used for generating the clip path. This value is used for calculations if round is not provided.|
|round|number|—|Similar to a standard CSS border-radius. It allows you to define the curvature. When provided, it is used to compute the internal radius.|
|quality|number|0.5|Affects the number of calculated steps for generating the curve. Increasing this value yields a smoother curve but may impact performance.|

Any additional standard HTML attributes (e.g., className, onClick) are forwarded to the component’s root element.


## How It Works

• **Clip Path Generation:**

The component calculates points along the superellipse by dividing it into four quadrants. For each quadrant, a function computes the curve points, ensuring smooth transitions between segments.

• **Dynamic Updates:**

A ResizeObserver monitors changes in the element’s dimensions. When a resize is detected, the clip path is recalculated dynamically so that the shape adapts correctly to responsive layouts.

• **Customization:**

By adjusting the exponent, radius, and round properties, you can finely tune the appearance of the superellipse to meet your design requirements.

## Performance Considerations

A higher quality value increases the number of points calculated for the clip path, which may impact performance during rapid resizing. Choose an appropriate balance between visual quality and performance based on your application’s needs.

## Browser Compatibility

The component makes use of the CSS clip-path property. Most modern browsers support this feature; however, older browsers may have limited or no support. Consider implementing fallbacks if you need to support legacy environments.

## Contributing

Contributions are welcome! If you encounter any issues or have ideas for improvements, please open an issue or submit a pull request on the project’s GitHub repository.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).
