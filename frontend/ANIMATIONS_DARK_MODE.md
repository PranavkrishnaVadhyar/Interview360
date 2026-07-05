# Interview360 - Animations & Dark Mode Documentation

## Overview

This document describes the animations and dark mode features implemented in Interview360's landing page.

## Dark Mode Implementation

### How It Works

Dark mode is implemented using a custom theme toggle component that:

1. **Detects User Preference**
   - Checks `localStorage` for saved theme preference
   - Falls back to system `prefers-color-scheme` if no preference is saved
   - Defaults to light mode if no preference is detected

2. **Theme Toggle Button**
   - Located in the navigation header next to "Start Now" button
   - Shows sun icon in dark mode, moon icon in light mode
   - Smooth transition between modes
   - Persists user selection to localStorage

3. **CSS Custom Properties**
   - All colors use CSS variables defined in `globals.css`
   - Dark mode uses `.dark` class on `<html>` element
   - Smooth color transitions via Tailwind's `transition-colors` class

### Color Scheme

**Light Mode:**
- Background: Very light gray (oklch(0.985 0.005 0))
- Foreground: Dark blue-gray (oklch(0.165 0.004 250))
- Primary: Blue (oklch(0.518 0.238 264))
- Secondary: Purple (oklch(0.625 0.191 256))

**Dark Mode:**
- Background: Dark navy (oklch(0.145 0.01 250))
- Foreground: Light gray (oklch(0.95 0.01 250))
- Primary: Bright blue (oklch(0.625 0.191 256))
- Secondary: Purple (oklch(0.488 0.243 264.376))

### File Changes

- `components/theme-toggle.tsx` - Dark mode toggle component
- `components/navigation.tsx` - Integrated theme toggle
- `app/globals.css` - Dark mode CSS variables

## Animation System

### Custom Animations

All animations are defined in `globals.css` with these keyframe sets:

#### 1. **Fade In (fadeInUp)**
- Fades element in while sliding up 20px
- Duration: 600ms
- Easing: ease-out
- Use case: Section headings, main content

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 2. **Slide Left/Right (slideInLeft, slideInRight)**
- Slides elements from left or right while fading in
- Duration: 600ms
- Easing: ease-out
- Use case: Side-by-side layouts, directional emphasis

#### 3. **Fade In (fadeIn)**
- Simple opacity fade without movement
- Duration: 400ms
- Easing: ease-out
- Use case: Overlays, modals, quick reveals

#### 4. **Scale In (scaleIn)**
- Scales element from 95% to 100% while fading in
- Duration: 400ms
- Easing: ease-out
- Use case: Cards, buttons, feature boxes

#### 5. **Glow**
- Animates box-shadow for a glowing effect
- Duration: 3s infinite
- Use case: Call-to-action elements, highlight focus

#### 6. **Float**
- Subtle vertical floating animation
- Duration: 3s infinite
- Translation: ±10px vertical
- Use case: Decorative elements, background shapes, icons

#### 7. **Pulse Slow**
- Gentle opacity pulse
- Duration: 2s infinite
- Use case: Loading states, subtle emphasis

### Utility Classes

#### Animation Classes
```css
.animate-fadeInUp     /* Fade in from below */
.animate-slideInLeft  /* Slide from left */
.animate-slideInRight /* Slide from right */
.animate-fadeIn       /* Simple fade */
.animate-scaleIn      /* Scale and fade */
.animate-glow         /* Glowing effect */
.animate-float        /* Floating motion */
.animate-pulse-slow   /* Slow pulse */
```

#### Stagger Classes
For sequential animations across multiple elements:
```css
.animate-stagger-1 { animation-delay: 0.1s; }
.animate-stagger-2 { animation-delay: 0.2s; }
.animate-stagger-3 { animation-delay: 0.3s; }
.animate-stagger-4 { animation-delay: 0.4s; }
.animate-stagger-5 { animation-delay: 0.5s; }
.animate-stagger-6 { animation-delay: 0.6s; }
```

## Landing Page Animation Effects

### Navigation
- **Header**: `animate-fadeIn` (400ms)
- Appears instantly with subtle fade

### Hero Section
- **Heading**: `animate-fadeInUp` (600ms)
- **Description**: `animate-fadeInUp` with `animate-stagger-1` (700ms delay)
- **Buttons**: `animate-fadeInUp` with `animate-stagger-2` (800ms delay)
- **Stats**: `animate-scaleIn` with individual stagger delays (800-1000ms)
- **Background Shapes**: `animate-float` with 3s duration and 1s delay offset

### Features Section
- **Title**: `animate-fadeInUp` (600ms)
- **Subtitle**: `animate-fadeInUp` with `animate-stagger-1` (700ms)
- **Feature Cards**: `animate-scaleIn` with incremental delays (700-900ms)
  - Each card fades up with slight scale effect
  - Icons have `animate-float` effect
  - Cards have hover states: `hover:scale-105` and `hover:shadow-lg`

### How It Works Section
- **Title**: `animate-fadeInUp` (600ms)
- **Subtitle**: `animate-fadeInUp` with stagger (700ms)
- **Step Circles**: `animate-scaleIn` with delays (800-1100ms)
  - Hover effect: `hover:shadow-lg hover:shadow-primary/50`
  - Each circle numbers appear with staggered scaling

### Testimonials Section
- **Title**: `animate-fadeInUp` (600ms)
- **Cards**: `animate-scaleIn` with delays (700-900ms)
  - Cards: `hover:scale-105` and `hover:shadow-lg`
  - Star ratings: `animate-float` with individual delays
  - Creates a floating star effect

### FAQ Section
- **Title**: `animate-fadeInUp` (600ms)
- **Accordion Items**: `animate-scaleIn` with delays (800-1300ms)
  - Open animation on content: `animate-fadeIn`
  - Chevron rotation: `transition-transform duration-300`
  - 300ms smooth rotation transition

### Footer
- **Container**: `animate-fadeIn` (400ms)
- **Each Column**: `animate-fadeInUp` with stagger delays (500-800ms)
- **Bottom Section**: `animate-fadeInUp` with delay (900ms)

## Performance Considerations

### Optimization Strategies

1. **Hardware Acceleration**
   - Uses `transform` and `opacity` for animations (GPU accelerated)
   - Avoids animating layout properties like width, height, padding

2. **Timing**
   - Entrance animations: 400-600ms (keeps page feeling responsive)
   - Infinite animations: 2-3s (subtle, not distracting)
   - Stagger delays: 0.1-0.5s (cascading effect)

3. **Reduced Motion**
   - Respects `prefers-reduced-motion` media query
   - Can be enhanced with:
     ```css
     @media (prefers-reduced-motion: reduce) {
       * {
         animation-duration: 0.01ms !important;
       }
     }
     ```

## Implementation Examples

### Adding Animations to a Component

```tsx
// Example: Animated card component
<div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
  <h3 className="animate-fadeInUp">Card Title</h3>
  <p className="animate-fadeInUp animate-stagger-1">Card content</p>
</div>
```

### Chaining Multiple Animations

```tsx
// Title fades up, then description follows
<h2 className="text-4xl font-bold animate-fadeInUp">
  Section Title
</h2>
<p className="animate-fadeInUp animate-stagger-1" style={{ animationDelay: '0.1s' }}>
  Description text
</p>
```

### Float Effect for Decorative Elements

```tsx
<div className="absolute animate-float" style={{ animationDelay: '1s' }}>
  Floating element
</div>
```

## Browser Compatibility

- **Modern Browsers**: All CSS animations fully supported
- **IE 11**: Not supported (graceful degradation)
- **Mobile Browsers**: Full support with GPU acceleration
- **Reduced Motion**: Respected on supported devices

## Testing Dark Mode & Animations

### Manual Testing
1. Open application in browser
2. Click moon/sun icon in navigation to toggle dark mode
3. Refresh page to verify persistence
4. Change system theme to test auto-detection
5. Observe animations when scrolling through sections

### Browser DevTools
1. Toggle device emulation for `prefers-color-scheme`
2. Disable animations in DevTools and verify readability
3. Check performance in Lighthouse

## Future Enhancements

- [ ] Add `prefers-reduced-motion` support globally
- [ ] Create animation preference in user settings
- [ ] Add page transition animations
- [ ] Implement Intersection Observer for scroll-triggered animations
- [ ] Add animation speed adjustment UI

## File Structure

```
app/
├── globals.css (animation definitions & dark mode colors)
└── layout.tsx (dark mode class handling)

components/
├── theme-toggle.tsx (dark mode toggle button)
├── navigation.tsx (integrated theme toggle)
├── hero.tsx (animations applied)
├── features.tsx (animations applied)
├── how-it-works.tsx (animations applied)
├── testimonials.tsx (animations applied)
├── faq.tsx (animations applied)
└── footer.tsx (animations applied)
```

## Troubleshooting

### Animations not playing
- Check browser DevTools Animations panel
- Verify `animation-delay` is not excessive
- Ensure elements have proper positioning context

### Dark mode not persisting
- Clear localStorage and refresh
- Check browser localStorage limit
- Verify theme-toggle component is mounted

### Performance issues
- Profile with DevTools Performance tab
- Check for animating non-GPU properties
- Reduce number of simultaneous animations
- Consider using `will-change` property sparingly

## Conclusion

The animation system and dark mode implementation create a polished, modern user experience while maintaining excellent performance and accessibility. The staggered animations create a sense of hierarchy and guide the user's eye through the page naturally.
