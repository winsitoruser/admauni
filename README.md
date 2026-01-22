# ADMA University Alumni Management System

Comprehensive alumni management system with 9 core modules for university alumni engagement.

## Features

### 🔐 1. Authentication & Verification
- Alumni registration (NIM / graduation year)
- Login (email / SSO campus)
- Manual/automatic verification
- Password reset

### 👤 2. Alumni Profile & Database
- Personal & academic data
- Work history
- Skills & interests
- Privacy controls
- CV upload

### 🔍 3. Alumni Directory
- Search & filter (batch, major, location, company)
- Alumni distribution map
- Bookmark / connect with alumni

### 💬 4. Forum & Community
- Topic-based discussions / major
- Comments & replies
- Content moderation
- Notifications

### 📣 5. News & Information
- Campus articles & announcements
- Newsletter
- Alumni highlights

### 📅 6. Events & Reunions
- Create & manage events
- RSVP / registration
- Online & offline events
- Email/WhatsApp reminders

### 💼 7. Job Portal
- Post job openings
- Direct applications
- Company profiles
- Applicant statistics

### 📊 8. Admin Dashboard
- Alumni statistics
- User activity
- Data export (Excel/PDF)
- Approval & moderation

### 💳 9. Donation & Sponsorship (Phase 2)
- Alumni donations
- Payment gateway
- Transparency reports

## Tech Stack

**Frontend:**
- React 18
- React Router
- TailwindCSS
- Zustand (state management)
- React Query
- Leaflet (maps)
- Recharts (analytics)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Socket.io (real-time)
- Nodemailer (emails)
- Multer (file uploads)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/winsitoruser/admauni.git
cd admauni
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database:
```bash
# Create PostgreSQL database
createdb admauni_alumni

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

5. Start development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
admauni/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── lib/               # Third-party configurations
├── server/                # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   ├── migrations/        # Database migrations
│   └── seeds/             # Database seeders
├── public/                # Static files
└── uploads/               # User uploaded files
```

## API Documentation

API endpoints are organized by module:

- `/api/auth` - Authentication & verification
- `/api/users` - User profiles
- `/api/alumni` - Alumni directory
- `/api/forum` - Forum & community
- `/api/news` - News & information
- `/api/events` - Events & reunions
- `/api/jobs` - Job portal
- `/api/admin` - Admin dashboard
- `/api/donations` - Donations (Phase 2)

## Development

```bash
# Run frontend only
npm run client

# Run backend only
npm run server

# Run both concurrently
npm run dev
```

## Production Build

```bash
npm run build
```

## License

MIT License - ADMA University
