# Vite React TypeScript Boilerplate

A modern, fast React application boilerplate built with Vite, TypeScript, TailwindCSS, and comprehensive testing setup.

## Features

- ⚡️ [Vite](https://vitejs.dev/) - Lightning fast frontend tooling
- ⚛️ [React 19](https://react.dev/) - The latest version of React
- 🔷 [TypeScript](https://www.typescriptlang.org/) - Type safety and enhanced developer experience
- 🎨 [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- 🧪 [Vitest](https://vitest.dev/) - Unit testing with React Testing Library
- 📏 [ESLint](https://eslint.org/) - Code linting
- 🐳 Docker support

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn or pnpm

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd boilerplate-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

## Project Structure

```
src/
├── assets/      # Static assets
├── components/  # React components
├── test/        # Test setup and utilities
├── App.tsx      # Main App component
└── main.tsx     # Application entry point
```

## Docker

To build and run the application using Docker:

```bash
# Build the image
docker build -t boilerplate-vite .

# Run the container
docker run -p 3000:80 boilerplate-vite
```