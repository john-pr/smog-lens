# Smog Lens (Active Air)

A modern React-based air quality monitoring application that displays real-time air pollution data from Polish GIOS (Główny Inspektorat Ochrony Środowiska) API. Features an interactive map with station clustering, dark/light theme support, and multi-language interface.

## Features

- **Interactive Map**: Leaflet-based map with marker clustering for visualizing air quality stations
- **Real-time Data**: Fetches live air quality indices and station details from GIOS API
- **Station Information**: Detailed view of each station with air quality parameters and charts
- **Theme Support**: Dark and light mode with persistent user preference
- **Multi-language**: English and Polish localization with auto-detection
- **Performance Optimized**: Viewport-based filtering, throttled callbacks, and smart data fetching
- **Responsive Design**: Tailwind CSS for mobile and desktop interfaces

## Tech Stack

- **Frontend Framework**: React 19 with Vite 7
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4 with dark mode support
- **Routing**: React Router
- **Maps**: Leaflet with React-Leaflet and marker clustering
- **Internationalization**: i18next with auto-language detection
- **Build Tools**: Vite with React Compiler (babel-plugin-react-compiler)
- **UI Icons**: Lucide React
- **Charts**: Chart.js with React Chart.js 2
- **SVG Handling**: Vite SVGR plugin

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another available port).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Application setup and configuration
├── pages/                  # Page components
│   └── MapPage/           # Interactive map page
├── features/              # Feature-sliced architecture
│   ├── stations/          # Station data and state management
│   │   ├── api/          # API calls
│   │   ├── hooks/        # Custom React hooks
│   │   └── model/        # Redux slice
│   ├── stationDetails/    # Individual station details
│   │   ├── api/          # API calls
│   │   └── model/        # Redux slice
│   └── map/              # Map components
├── shared/               # Shared utilities and components
│   ├── lib/
│   │   ├── constants/    # Application constants
│   │   └── hooks/        # Shared hooks
│   └── ui/               # Reusable UI components
├── assets/               # Static assets (flags, loaders, markers)
└── main.jsx             # React entry point
```

## Architecture

### Feature-Sliced Design
Code is organized by feature rather than technical layer, following Feature-Sliced Design (FSD) principles. Each feature contains its own API calls, state management, and components.

### State Management
Three main Redux slices:
- **`stations`**: Station data with localStorage caching (1-hour TTL)
- **`indices`**: Air quality indices per station (fetched on-demand for visible viewport)
- **`stationDetails`**: Detailed station information

### Performance Optimizations

- **Viewport-based Filtering**: Stations filtered by visible map bounds with debounced updates
- **Throttled Callbacks**: Map event handlers use `useThrottledCallback` to reduce re-renders
- **Conditional Data Fetching**: Indices fetched only for visible stations
- **localStorage Caching**: Station data cached for 1 hour

### Theme System

The application includes a light/dark theme system:

- **Provider**: `ThemeProvider` in `src/app/` (already wrapped in app)
- **Hook**: Use `useTheme()` to access theme utilities
- **Persistence**: Theme choice saved to localStorage under key `appTheme`
- **Styling**: Toggles `dark` class on document root for Tailwind CSS dark mode

### Internationalization (i18n)

- Translation files in `public/locales/{lang}/common.json`
- Supports English (EN) and Polish (PL)
- Auto-detects language using `i18next-browser-languagedetector`

## API Integration

The application integrates with the Polish GIOS API (`https://api.gios.gov.pl`) to fetch:
- List of air quality monitoring stations
- Real-time air quality indices
- Detailed station information

**Note**: The Vite dev server proxies `/gios/*` requests to avoid CORS issues. See [vite.config.js](vite.config.js).

## SVG Handling

SVGs are imported as React components using the `?react` query parameter:

```jsx
import ThreeDots from "../assets/loaders/threeDots.svg?react";
```

## Development Guidelines

### Code Style
- Follow ESLint rules in [eslint.config.js](eslint.config.js)
- Use meaningful names and comments for complex logic
- Keep components focused and reusable

### Adding Features
1. Create feature directory under `src/features/`
2. Structure with api/, model/, and component subdirectories
3. Use Redux slices for state management
4. Add i18n keys to `public/locales/` files

### Performance Tips
- React Compiler automatically optimizes components
- Use `useThrottledCallback` for frequent events
- Lazy-load components when appropriate
- Monitor bundle size with production builds

## Browser Support

Targets modern browsers supporting ES2020, React 19, CSS Grid/Flexbox, and CSS Custom Properties.

## Troubleshooting

### CORS Issues
Dev server automatically proxies CORS requests. Check `vite.config.js` for production setup.

### Map Not Displaying
- Verify Leaflet CSS is loaded in `index.html`
- Check map container has defined height/width
- Ensure Leaflet script is loaded

### Theme Not Persisting
- Verify localStorage is enabled
- Check `ThemeProvider` wraps the app
- Confirm dark mode class toggling on document root

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet](https://leafletjs.com)
- [i18next](https://www.i18next.com)
