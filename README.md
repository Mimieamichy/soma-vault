# Study Vault

A modern SaaS web application for students to organize study materials, create personalized study plans, and access AI-powered question answering from their documents.

## 🎨 Brand Colors (Extracted from Logo)

- **Primary (Navy):** HSL(215, 28%, 25%) - Main navigation, text, headings
- **Accent (Crimson):** HSL(0, 70%, 42%) - CTAs, highlights, important elements
- **Secondary (Beige):** HSL(30, 25%, 78%) - Backgrounds, cards
- **Background:** HSL(35, 30%, 96%) - Page backgrounds

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
study-vault/
├── src/
│   ├── assets/           # Static assets (logo, images)
│   ├── components/
│   │   ├── layout/       # Sidebar, TopNav, MainLayout
│   │   ├── archive/      # FolderTree, MaterialCard, UploadZone, PQHub
│   │   ├── planner/      # StudyPlanForm, FragmentCard
│   │   └── ui/           # Shadcn UI components
│   ├── pages/            # Dashboard, Archive, StudyPlanner, Profile
│   └── main.tsx
├── backend/              # Empty (placeholder for future backend)
└── package.json
```

## 📱 Features

- **Dashboard:** Stats overview, weekly progress chart, recent activity
- **Archive:** Folder navigation, file uploads, PQ Hub AI Q&A
- **Study Planner:** Create plans, timeline view, fragment editing
- **Profile:** Settings, theme preview, subscription plans

## 🔧 Tech Stack

React 18 + TypeScript | Vite | Tailwind CSS | Lucide Icons | React Router | Recharts | Shadcn/ui
