# Dark/Light Mode Auto-Detection Implementation

## Overview
This document describes the auto-detection implementation for the DarkModeToggle component in the Gandalf AI Math Tutor.

## Features Implemented

### 1. System Preference Detection
- On first app load, the component detects the user's system theme preference using `window.matchMedia('(prefers-color-scheme: dark)')`
- Automatically applies the detected theme without requiring user interaction

### 2. Manual Override with Persistence
- When a user manually toggles the theme, their preference is saved to localStorage
- The saved preference is distinguished from auto-detected theme using new keys:
  - `user-dark`: User manually selected dark mode
  - `user-light`: User manually selected light mode

### 3. System Theme Change Listener
- The component listens for system theme changes via `MediaQueryListEvent`
- Only applies system theme changes if the user has NOT set a manual preference
- Listener is properly cleaned up on component unmount to prevent memory leaks

### 4. Migration from Old Storage Format
- Automatically migrates existing users from old `theme` localStorage key to new `theme-preference` key
- Preserves user preferences during migration
- Cleans up old localStorage key after migration

## Implementation Details

### LocalStorage Keys

**Old format (deprecated):**
- `theme`: `'dark'` | `'light'`

**New format:**
- `theme-preference`: `'user-dark'` | `'user-light'` | (not set = use system)

### Logic Flow

```
1. Component mounts
   └─> Migrate old 'theme' key if exists

2. Check localStorage for 'theme-preference'
   ├─> If 'user-dark': Apply dark mode
   ├─> If 'user-light': Apply light mode
   └─> If not set:
       ├─> Detect system preference
       ├─> Apply system preference
       └─> Add listener for system theme changes

3. User clicks toggle
   ├─> Toggle current theme
   ├─> Save as 'user-dark' or 'user-light'
   └─> System theme listener remains active but won't apply changes

4. System theme changes (while component is mounted)
   ├─> Check if user has manual preference
   ├─> If no manual preference: Apply new system theme
   └─> If manual preference exists: Ignore system change
```

## Test Scenarios

### Scenario 1: First Visit with Dark System Theme
1. User visits app for first time
2. System is set to dark mode
3. Expected: App loads in dark mode automatically

### Scenario 2: First Visit with Light System Theme
1. User visits app for first time
2. System is set to light mode
3. Expected: App loads in light mode automatically

### Scenario 3: Manual Override
1. User visits app (auto-detects light mode from system)
2. User clicks toggle to switch to dark mode
3. localStorage saves `theme-preference: 'user-dark'`
4. Expected: App stays in dark mode even if system changes to light

### Scenario 4: System Theme Change (No Manual Override)
1. User visits app (auto-detects dark mode from system)
2. User doesn't manually toggle
3. System theme changes to light mode
4. Expected: App automatically switches to light mode

### Scenario 5: System Theme Change (After Manual Override)
1. User visits app
2. User manually toggles to dark mode
3. localStorage saves `theme-preference: 'user-dark'`
4. System theme changes to light mode
5. Expected: App STAYS in dark mode (ignores system change)

### Scenario 6: Migration from Old Format
1. Existing user has `theme: 'dark'` in localStorage
2. User visits app after update
3. Expected:
   - Migrates to `theme-preference: 'user-dark'`
   - Removes old `theme` key
   - Preserves dark mode setting

## Code Location

**File:** `/Users/aleksandrgaun/Downloads/Gandalf/components/settings/DarkModeToggle.tsx`

## Key Functions

### `applyTheme(dark: boolean)`
Applies the theme to the document by adding/removing the 'dark' class.

### `useEffect` Hook (Initialization)
- Handles migration from old localStorage format
- Detects and applies initial theme
- Sets up system theme change listener
- Returns cleanup function to remove listener

### `toggleDarkMode()`
- Toggles the current theme state
- Applies the new theme
- Saves user preference to localStorage

## Browser Compatibility

The implementation uses:
- `window.matchMedia('(prefers-color-scheme: dark)')` - Supported in all modern browsers
- `MediaQueryListEvent` - Supported in all modern browsers
- `localStorage` - Universal support

## Performance Considerations

- Listener is only added when no manual preference exists
- Listener is properly cleaned up on component unmount
- No unnecessary re-renders or state updates
- Migration logic runs only once on mount

## Future Enhancements (Optional)

Potential features that could be added:

1. **Reset to System Button**: Allow users to clear their manual preference and return to auto-detection
2. **Visual Indicator**: Show whether current theme is from system or user preference
3. **Sync Across Tabs**: Use `storage` event to sync theme changes across browser tabs
4. **Transition Animation**: Add smooth transition when theme changes
