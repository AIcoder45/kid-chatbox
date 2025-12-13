# Spline 3D Robot Setup Guide

This guide explains how to set up the Spline 3D robot animation on the home page.

## Overview

The home page now uses **Spline 3D** to display an interactive 3D robot instead of the emoji. The implementation includes:

- ✅ Spline React integration (`@splinetool/react-spline`)
- ✅ Loading states and error handling
- ✅ Fallback to emoji robot if Spline fails to load
- ✅ Responsive design (300px mobile, 400px desktop)
- ✅ Smooth floating animation (Framer Motion)

## Setup Options

### Option 1: Use Spline Cloud URL (Recommended)

1. **Create a Spline Account** (if you don't have one)
   - Go to [https://spline.design](https://spline.design)
   - Sign up for a free account

2. **Create or Import a 3D Robot Scene**
   - Create a new scene in Spline
   - Design or import a robot model
   - Export/publish your scene to get a URL

3. **Configure the Scene URL**
   - Copy your Spline scene URL (format: `https://prod.spline.design/.../scene.splinecode`)
   - Add it to your `.env` file:
     ```env
     VITE_SPLINE_ROBOT_SCENE=https://prod.spline.design/your-scene-id/scene.splinecode
     ```
   - Or update it directly in `src/constants/app.ts`:
     ```typescript
     SPLINE_ROBOT_SCENE: 'https://prod.spline.design/your-scene-id/scene.splinecode'
     ```

### Option 2: Use Local Spline File

1. **Export Spline Scene Locally**
   - In Spline, export your scene as `.splinecode` file
   - Place it in `public/assets/3d/bot.splinecode`

2. **Update Configuration**
   - Update `src/constants/app.ts`:
     ```typescript
     SPLINE_ROBOT_SCENE: '/assets/3d/bot.splinecode'
     ```

## Current Configuration

The default is set to `null` in `src/constants/app.ts`, which means the emoji robot (🤖) will be shown by default:
```typescript
SPLINE_ROBOT_SCENE: import.meta.env.VITE_SPLINE_ROBOT_SCENE || null
```

**To enable Spline 3D**, you must configure `VITE_SPLINE_ROBOT_SCENE` in your `.env` file or update the constant directly.

## Component Location

The Spline 3D robot is implemented in:
- **Component**: `src/components/home/HeroImage.tsx`
- **Usage**: Used in `src/components/Home.tsx`

## Features

- **Loading State**: Shows a spinner while the 3D scene loads
- **Error Handling**: Falls back to emoji robot (🤖) if Spline fails
- **Responsive**: Adapts to mobile and desktop screen sizes
- **Animated**: Includes floating animation using Framer Motion
- **Performance**: Uses React Suspense for optimal loading

## Troubleshooting

### Robot Not Showing?

1. **Check Console**: Look for Spline loading errors in browser console
2. **Verify URL**: Ensure the Spline scene URL is correct and accessible
3. **Network**: Check if the Spline service is accessible (no CORS issues)
4. **Fallback**: The emoji robot should appear if Spline fails

### Performance Issues?

- Spline 3D scenes can be resource-intensive
- Consider optimizing your Spline scene (reduce polygons, simplify animations)
- The component includes lazy loading with Suspense

## Example Spline Scene Requirements

For best results, your Spline scene should:
- Be optimized for web (not too complex)
- Have a robot character as the main focus
- Be sized appropriately (fits in 300-400px container)
- Include smooth animations (idle, floating, etc.)

## Resources

- [Spline Documentation](https://docs.spline.design/)
- [Spline React Integration](https://docs.spline.design/integrations/react)
- [Spline Examples](https://spline.design/examples)

