# Angular 22 Portfolio - Modern, Zoneless & SSR Developer Portfolio Template

[![Angular Version](https://img.shields.io/badge/Angular-22.0.4-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1.7-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Taiga UI](https://img.shields.io/badge/Taiga_UI-4.89.0-FF4B5C?style=flat-square)](https://taiga-ui.dev/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/gabri-mejia/deploy-status)](https://gabri-mejia.netlify.app/home)

A high-performance, modern, and SEO-friendly **Angular Portfolio** template designed for developers to showcase their work, experience, and skills. Built from the ground up with **Angular 22**, using a Zoneless change detection architecture, Server-Side Rendering (SSR), Taiga UI, and Tailwind CSS 4.

With love, by Gabri Mejía ❤

🚀 **[Live DEMO](https://gabri-mejia.netlify.app/home)**

---

## 🌟 Key Features

This project serves as a showcase of the latest and most modern frontend development practices:

- **Angular 22 Core**: Leveraging the absolute latest framework features including Signals, Standalone components, block control flow (`@if`, `@for`, `@defer`), and functional injectors (`inject()`).
- **Zoneless Change Detection**: Highly optimized rendering architecture using native Angular signals without the overhead of Zone.js.
- **Server-Side Rendering (SSR)**: Perfect lighthouse SEO and fast initial page loads, deploying seamlessly on Netlify.
- **Incremental Hydration**: Improved hydration performance with Event Replay.
- **Taiga UI**: Built with accessible (a11y-compliant), mobile-first components and templates.
- **Tailwind CSS 4**: Modern styling utilizing the brand new Tailwind CSS 4 engine.
- **Multi-language Support (i18n)**: Fully localized in both English and Spanish with runtime language toggling.
- **ESLint & Prettier**: Configured linting and code formatting out-of-the-box.

---

## 🛠️ Getting Started

### Prerequisites

You need [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/endermejia/angular20-portfolio-ssr-zoneless.git
   cd angular20-portfolio-ssr-zoneless
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

### Development Server

To start a local development server, run:

```bash
bun start
# or
npm start
```

This will start the server with Hot Module Replacement (HMR) disabled, which allows `@defer` blocks to work properly with lazy loading.

If you prefer to use HMR (note that this will cause all `@defer` block dependencies to be loaded eagerly), you can run:

```bash
bun run start:hmr
# or
npm run start:hmr
```

Once the dev server is running, open your browser and navigate to `http://localhost:4200/`.

---

## 📦 Building and Running Production SSR

### Build the Project

To build the browser bundle and server bundle for Server-Side Rendering:

```bash
bun run build
# or
npm run build
```

This compiles your project and stores the build artifacts in the `dist/angular22` directory.

### Run Local SSR Server

To run the built SSR application locally:

```bash
bun run serve:ssr:angular22
# or
npm run serve:ssr:angular22
```

---

## 🚀 Deploying to Netlify

This project is fully configured for SSR on Netlify using the official `@netlify/angular-runtime` plugin.

1. Connect your repository to Netlify.
2. Ensure the build command is: `npm run build`.
3. Set the publish directory to: `dist/angular22/browser`.
4. Netlify will detect `@netlify/angular-runtime` in `netlify.toml` and configure SSR automatically.

---

## 🔍 GitHub SEO Optimization & Configuration

To make this repository rank high when users search for **"portfolio angular"** or **"angular portfolio"** on GitHub, make sure you configure your GitHub repository settings as follows:

1. **Repository Description**:
   > A modern Angular 22 Portfolio template featuring SSR (Server-Side Rendering), Zoneless change detection, Signals, Taiga UI, and Tailwind CSS 4. Optimized for performance and SEO, perfect for frontend developer portfolios.
2. **Repository Topics / Tags**:
   Add the following topics to your GitHub repository settings:
   - `angular`
   - `angular-portfolio`
   - `portfolio`
   - `portfolio-template`
   - `angular22`
   - `ssr`
   - `zoneless`
   - `signals`
   - `taiga-ui`
   - `tailwindcss`
   - `frontend-portfolio`
   - `developer-portfolio`
3. **Repository Homepage URL**:
   Set the website link to: `https://gabri-mejia.netlify.app/home`

---

## 📜 Notes on Server-Side Rendering (SSR)

When running the application with SSR, you may see the following message in the console:
```
Not in browser environment, skipping map initialization
```
This is expected behavior and not an error. The map initialization is intentionally skipped during server-side rendering because map libraries like Leaflet require browser-specific APIs that are not available in the server environment. The map will be properly initialized when the application runs in the browser.
