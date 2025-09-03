# ResultsChain

A modern, responsive dashboard application built with React, TypeScript, Vite, Zustand, Recharts, Framer Motion, and Tailwind CSS.

## Features
- Fixed-width dashboard layout, mobile responsive
- Tab-based navigation for Profile and Settings
- Custom charts with tooltips and legends
- State management with Zustand
- Clean separation of UI components
- Vercel-ready for deployment

## Project Structure
```
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── audit/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── results/
│   │   ├── settings/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   └── types/
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```sh
npm install
```

### Development
```sh
npm run dev
```

### Build
```sh
npm run build
```

### Lint
```sh
npm run lint
```

## Deployment
- Ready for Vercel or any static hosting platform.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
