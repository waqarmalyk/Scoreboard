# Cricket Scoreboard - Component Structure

## Overview

The application has been refactored from a single 1272-line App.tsx file into a modular, component-based architecture with 615 lines in App.tsx (52% reduction).

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ActionButtons.tsx
│   ├── BallTypeButtons.tsx
│   ├── BatsmanInput.tsx
│   ├── BowlerInput.tsx
│   ├── CurrentOver.tsx
│   ├── ExtrasDisplay.tsx
│   ├── PreviousOvers.tsx
│   ├── ScoreDisplay.tsx
│   ├── Statistics.tsx
│   ├── TeamNameInput.tsx
│   ├── ThemeColorPicker.tsx
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   └── useTheme.ts      # Theme management hook
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Components

### Theme Management

- **ThemeColorPicker** - Floating theme selector with 9 color options
- **useTheme** - Custom hook for theme state and utility functions

### Match Input Components

- **TeamNameInput** - Team name input fields
- **BatsmanInput** - Batsman name inputs with strike indicator
- **BowlerInput** - Current bowler name input

### Display Components

- **ScoreDisplay** - Main score, wickets, overs, and target information
- **ExtrasDisplay** - Wides and no-balls counter
- **CurrentOver** - Visual representation of current over balls
- **PreviousOvers** - History of completed overs

### Action Components

- **BallTypeButtons** - All ball type input buttons (0-6, W, WD, NB)
- **ActionButtons** - Undo, reset, and innings control buttons
- **Statistics** - Batting and bowling statistics tables

## Type Definitions

All TypeScript interfaces are centralized in `src/types/index.ts`:

- `Ball` - Individual ball data structure
- `BallType` - Union type for ball types
- `PlayerStats` - Batsman statistics interface
- `BowlerStats` - Bowler statistics interface
- `ThemeColor` - Available theme colors

## Benefits of Refactoring

1. **Improved Readability** - Each component has a single responsibility
2. **Better Maintainability** - Easy to locate and modify specific features
3. **Reusability** - Components can be reused or tested independently
4. **Type Safety** - Centralized type definitions with proper TypeScript imports
5. **Cleaner Code** - Main App.tsx focuses on state management and business logic

## No Breaking Changes

All functionality has been preserved:

- Theme switching
- Score tracking
- Player statistics
- Innings management
- LocalStorage persistence
- All button interactions
- Validation logic
