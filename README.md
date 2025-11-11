# Advanced Tilt Effect

> Created by [@kakajan](https://github.com/kakajan) - Educational project for students learning web animations

A sophisticated 3D tilt effect built with HTML, Tailwind CSS, and pure JavaScript. Features smooth perspective transformations, dynamic lighting, and customizable parameters.

## Features

- **3D Perspective Transforms** - Smooth rotations on X and Y axes
- **Dynamic Shine Effect** - Radial gradient that follows mouse movement
- **Enhanced Shadows** - Depth-based shadow adjustments
- **Parallax Inner Content** - Subtle movement of card content
- **Customizable Parameters** - Control tilt intensity, speed, and behavior
- **Performance Optimized** - Uses `will-change` and optimized transforms
- **Responsive** - Automatically updates on window resize
- **Zero Dependencies** - Pure JavaScript (except Tailwind CDN)

## Usage

### Basic Implementation

Add the `data-tilt` attribute to any element:

```html
<div class="tilt-card" data-tilt>
    <div class="tilt-card-inner">
        Your content here
    </div>
</div>
```

### Customization Options

Use data attributes to customize behavior:

```html
<div data-tilt 
     data-max-tilt="20" 
     data-speed="400" 
     data-scale="1.05"
     data-glare="true"
     data-reverse="true">
    Content
</div>
```

### Available Parameters

- `data-max-tilt` - Maximum tilt angle in degrees (default: 15)
- `data-speed` - Transition speed in milliseconds (default: 300)
- `data-scale` - Scale factor on hover (default: 1)
- `data-glare` - Enable glare effect (default: false)
- `data-reverse` - Reverse tilt direction (default: false)

### Required CSS Classes

- `.tilt-card` - Main container element
- `.tilt-card-inner` - Inner content with translateZ
- `.tilt-shine` - Shine/glare overlay element
- `.tilt-shadow` - Enable dynamic shadow effects

## JavaScript API

### Manual Initialization

```javascript
const element = document.querySelector('.my-element');
const tilt = new TiltEffect(element, {
    maxTilt: 20,
    speed: 400,
    scale: 1.05,
    glare: true,
    reverse: false
});
```

### Methods

- `tilt.updateElementPosition()` - Recalculate element position
- `tilt.reset()` - Reset to default position
- `tilt.destroy()` - Remove all event listeners

### Events

Listen for tilt changes:

```javascript
element.addEventListener('tiltChange', (e) => {
    const { tiltX, tiltY, percentageX, percentageY } = e.detail;
    console.log('Tilt values:', tiltX, tiltY);
});
```

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

Requires CSS transforms and perspective support.

## Performance Tips

1. Limit number of tilt elements on a single page
2. Use `will-change` sparingly (automatically handled)
3. Avoid applying tilt to very large elements
4. Consider reducing `maxTilt` for better performance on mobile

## Customization Examples

### Subtle Professional Look
```html
<div data-tilt data-max-tilt="8" data-speed="600" data-scale="1.02">
```

### Dramatic Gaming Style
```html
<div data-tilt data-max-tilt="25" data-speed="200" data-scale="1.1" data-glare="true">
```

### Reverse Tilt
```html
<div data-tilt data-reverse="true" data-max-tilt="15">
```

## Author

**kakajan**
- GitHub: [@kakajan](https://github.com/kakajan)
- Purpose: Educational resource for students

## License

Free to use for personal and commercial projects. Attribution appreciated but not required.

## For Students

This project demonstrates:
- Pure JavaScript class-based programming
- CSS 3D transforms and perspective
- Event handling and DOM manipulation
- Performance optimization techniques
- Clean, maintainable code structure

Feel free to fork, modify, and learn from this code!

## Credits

Created with ❤️ by [@kakajan](https://github.com/kakajan) using pure JavaScript and Tailwind CSS.