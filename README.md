# SomaVault

A modern study vault web app for organizing materials, managing past questions, and building study plans with a clean, mobile-first UI.

## 🎨 Brand Colors (Extracted from Logo)

- **Primary (Navy):** HSL(215, 28%, 25%) - Main navigation, text, headings
- **Accent (Crimson):** HSL(0, 70%, 42%) - CTAs, highlights, important elements
- **Secondary (Beige):** HSL(30, 25%, 78%) - Backgrounds, cards
- **Background:** HSL(35, 30%, 96%) - Page backgrounds

## 🚀 Getting Started

```bash
# Install dependencies (from /frontend)
cd frontend
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
study-vault/
├── frontend/
│   ├── src/
│   │   ├── assets/           # Static assets (logo, images)
│   │   ├── components/
│   │   │   ├── archive/      # FolderTree, UploadModal, PQHub
│   │   │   ├── layout/       # Sidebar, TopNav, MainLayout, BottomNav
│   │   │   ├── profile/      # SubscriptionModal
│   │   │   ├── planner/      # Study plan components
│   │   │   └── ui/           # Shadcn UI components
│   │   ├── pages/            # Dashboard, Archive, MyLibrary, StudyPlanner, Profile
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 📱 Features

- **Archive:** Folder navigation, materials and past questions with uploads, mobile search, context actions
- **My Library:** Personal materials and past questions with upload and search
- **Study Planner:** Create and manage study plans
- **Profile:** Theme toggle, account settings, subscription modal

## 🔧 Tech Stack

React 18 + TypeScript | Vite | Tailwind CSS | Radix UI / shadcn | Lucide Icons | React Router | Recharts

## 🧪 Scripts

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```
