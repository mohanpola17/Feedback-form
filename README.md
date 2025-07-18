# Feedback Collection Platform

A full-stack platform for businesses to collect feedback via customizable forms.

## Features
- Admin registration & login (JWT auth)
- Create feedback forms (text/multiple-choice questions)
- Public form submission (no login required)
- Admin dashboard for viewing responses (table + summary)
- Export responses as CSV
- Mobile-responsive UI

## Tech Stack
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React (PWA template), Axios, React Router

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   MONGO_URI=mongodb://localhost:27017/feedback-platform
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Usage
- Register and log in as an admin.
- Create feedback forms with 3-5 questions (text or multiple-choice).
- Share the public form link with users.
- Users submit feedback via the public link (no login required).
- View all responses and summary in the dashboard.
- Export responses as CSV.

## Design Decisions
- **Separation of concerns:** Clear split between backend (API, data) and frontend (UI, logic).
- **Data modeling:** Flexible form and response models for easy extension.
- **Security:** JWT auth for admin, public endpoints for users.
- **Responsiveness:** Mobile-friendly UI with simple CSS.

## Future Improvements
- Add user management for multiple admins per business
- Add question types (rating, date, etc.)
- Add analytics dashboard
- Add email notifications

---

**Built with love for feedback-driven businesses!** 