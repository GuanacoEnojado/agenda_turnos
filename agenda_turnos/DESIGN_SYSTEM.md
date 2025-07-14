# Unified Design System Documentation

## Overview
This document describes the unified design system implemented across all pages and components in the Agenda Turnos Ionic/Angular application.

## Color Palette

### Primary Blue Palette
- `--app-color-blue-1: #0466c8` - Light Blue (Primary actions, buttons)
- `--app-color-blue-2: #0353a4` - Medium Blue (Secondary actions)  
- `--app-color-blue-3: #023e7d` - Dark Blue (Text, headers)
- `--app-color-blue-4: #002855` - Darker Blue (Accents)
- `--app-color-blue-5: #001845` - Very Dark Blue (Special cases)
- `--app-color-blue-6: #001233` - Darkest Blue (Avoid for backgrounds)

### Grey Palette (for absences, negative actions)
- `--app-color-grey-1: #33415c` - Light Grey
- `--app-color-grey-2: #5c677d` - Medium Grey
- `--app-color-grey-3: #7d8597` - Dark Grey  
- `--app-color-grey-4: #979dac` - Darkest Grey

### Text Colors
- `--app-text-light: #ffffff` - White text for dark backgrounds
- `--app-text-dark: #000000` - Black text for light backgrounds

## Spacing System
- `--app-spacing-xs: 4px` - Extra small spacing
- `--app-spacing-sm: 8px` - Small spacing
- `--app-spacing-md: 16px` - Medium spacing (default)
- `--app-spacing-lg: 24px` - Large spacing
- `--app-spacing-xl: 32px` - Extra large spacing

## Border Radius
- `--app-border-radius: 8px` - Default border radius
- `--app-border-radius-sm: 4px` - Small border radius
- `--app-border-radius-lg: 12px` - Large border radius

## Component Styling

### Buttons
All buttons use consistent styling with the blue palette:
- **Primary buttons**: Use `--app-color-blue-1` background
- **Secondary buttons**: Use `--app-color-grey-2` background
- **Tertiary buttons**: Use `--app-color-blue-2` background
- **Warning/Danger buttons**: Use `--app-color-grey-3` background

Button sizes:
- **Small**: 32px min-height, reduced padding
- **Default**: Standard Ionic sizing with custom padding
- **Large**: 48px min-height, increased padding

### Cards
- Clean white background with subtle shadow
- Blue accent headers using `--app-color-blue-3`
- Consistent padding using spacing variables
- Rounded corners with `--app-border-radius`

### Toolbars
- Blue background using `--app-color-blue-1`
- White text for contrast
- Consistent styling across all pages

### Lists and Items
- Blue background using `--app-color-blue-1`
- White text for readability
- Compact design with 60px minimum height
- Rounded corners and spacing between items

### Forms
- Outline style inputs for better accessibility
- Floating labels for better UX
- Consistent error messaging styling
- Icon integration for visual context

### Badges
- Color-coded based on content type
- Consistent sizing and padding
- Readable text on appropriate backgrounds

## Theme Support

### Light Theme
The application supports a light theme with:
- White backgrounds
- Dark text
- Blue accent colors
- High contrast for accessibility

### Dark Theme  
The application supports a dark theme with:
- Dark backgrounds
- Light text
- Adjusted blue colors for dark backgrounds
- Maintained contrast ratios

### Theme Switching
Themes can be applied by adding CSS classes:
- `.light-theme` - Forces light theme
- `.dark-theme` - Forces dark theme
- Default behavior follows system preference

## Applied Pages

The unified design system has been implemented across:

### Main Application Pages
- **Home Page** (`/home`) - Login form with unified styling
- **Main Dashboard** (`/main`) - Dashboard with consistent card and button styling
- **Registration** (`/registro`) - Form with unified input and button styling
- **Worker Registration** (`/registrofuncionario`) - Employee form with consistent styling

### Feature Pages
- **Employee List** (`/lista-funcionarios`) - Reference implementation with compact list design
- **Shift Change** (`/cambiodeturno`) - Unified form and selection styling
- **Global Calendar** (`/calendario-global`) - Consistent toolbar and content styling
- **Preferences** (`/preferencias`) - Settings with unified form styling

### Placeholder Pages
- **Search by Day** (`/busquedadia`) - Inherits global styles
- **Employee Elimination** (`/eliminacion`) - Inherits global styles  
- **Shift Calendar** (`/calendario-turnos`) - Inherits global styles

## Global Styles Location

All global styles are defined in:
```
src/global.scss
```

This file contains:
1. Color palette definitions
2. Spacing and layout variables
3. Component styling overrides
4. Theme support
5. Responsive design utilities

## Best Practices

### When Adding New Components
1. Use the defined color palette variables
2. Apply consistent spacing using spacing variables
3. Follow the established component patterns
4. Test in both light and dark themes
5. Ensure accessibility standards are met

### Maintenance
- All color changes should be made in the CSS variables
- Component styling should extend the global patterns
- Page-specific styles should be minimal and focused
- Regular testing across different screen sizes

## Browser Support
The design system supports:
- Modern browsers with CSS custom properties support
- Mobile devices through Ionic's responsive design
- High contrast mode for accessibility
- Reduced motion preferences

## Performance Considerations
- CSS variables enable efficient theme switching
- Global styles reduce duplication
- Minimal page-specific styling improves maintainability
- Ionic's optimization handles mobile performance

---

*This design system ensures consistency, accessibility, and maintainability across the entire Agenda Turnos application.*
