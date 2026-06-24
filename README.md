# Sihat Clinic — Hospital Management System

A complete mobile-first clinic management web application built with React.js + LocalStorage.

## 🏥 About

**Sihat Clinic HMS** is a premium, offline-first healthcare management application for:

- **Dr. Raiyan** — Chronic Disease & Pain Management  
- **Dr. Fahim** — Face & Hair Treatment

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 Dashboard | Stats, quick actions, today's schedule |
| 👥 Patients | Add, edit, search, full patient history |
| 📅 Appointments | Schedule, manage, status tracking |
| 🕐 Today's View | Real-time today's patient queue |
| 🩺 Consultations | Treatment records, prescription, diagnosis |
| 📋 Reports | Lab reports, scans, test results |
| 💊 Follow-ups | Upcoming follow-up tracking |
| 👨‍⚕️ Doctors | Doctor-wise stats and patient lists |
| 🔍 Search | Global search across all data |
| 🔔 Notifications | Alerts for today, tomorrow, missed |
| 🌙 Dark Mode | Full dark theme support |
| 💾 Export/Import | JSON backup and restore |

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Header, BottomNav
│   ├── common/         # Toast, StatCard
│   ├── patients/       # PatientCard
│   └── appointments/   # AppointmentCard
├── pages/              # All page components
├── hooks/              # useStore (global state)
├── services/           # localStorage utilities
├── data/               # Sample data seeder
└── styles/             # Global CSS
```

## 💾 LocalStorage Keys

- `sihat_patients`
- `sihat_appointments`
- `sihat_consultations`
- `sihat_reports`
- `sihat_followups`
- `sihat_settings`

## 🎨 Tech Stack

- **React 18** + Vite
- **React Router DOM v6**
- **LocalStorage** (no backend)
- **Lucide React** icons
- **date-fns** for date utilities
- **CSS Variables** for theming

## 📱 Mobile-First Design

- Max-width 480px container (app-like)
- Bottom navigation bar
- Touch-friendly interactions
- PWA-style UI
- Smooth animations

---

Built with ❤️ for Sihat Clinic
