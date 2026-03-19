# 🗺️ TrashMapper

**Report & map illegally dumped trash to organize community cleanups.**

TrashMapper is a mobile-friendly web app that lets anyone snap photos of illegal dumping, pin the location on a map, and describe the situation. All reports are collected to help plan and organize garbage cleaning initiatives.

## Features

- 📍 **Interactive Map** — Dark-themed map with all reported locations
- 📸 **Photo Upload** — Snap multiple photos directly from your phone camera
- 🗑️ **Report Trash** — Drop a pin, describe the situation, rate severity
- 📱 **Mobile-First** — Works great on Android and iPhone
- 🔒 **Privacy-First** — Data stored locally in your browser (no account needed)

## Tech Stack

- **Next.js 14** — React framework with App Router
- **Leaflet** — Interactive maps with OpenStreetMap tiles
- **Vanilla CSS** — Custom design system with dark theme + glassmorphism
- **localStorage + IndexedDB** — Client-side data persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is deployed on [Vercel](https://vercel.com). Push to `main` triggers automatic deployment.

## License

MIT
