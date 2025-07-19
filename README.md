# Feedback Platform

A professional, full-stack feedback platform for creating, sharing, and analyzing feedback forms. Built with the MERN stack (MongoDB, Express, React, Node.js) and Material UI.

---

## 🚀 Features

- **Authentication & Security**
  - JWT-based admin authentication
  - Passwords securely hashed with bcrypt
  - Rate limiting on sensitive endpoints (login, registration, public form submission)
  - Secure HTTP headers with helmet
  - CORS configured for frontend-backend separation
- **Admin Dashboard**
  - View, create, and manage feedback forms
  - See all your forms in a responsive grid
  - View responses and analytics for each form
  - Export responses as CSV
- **Dynamic Form Builder**
  - Create forms with 3-5 questions
  - Support for text and multiple-choice questions
  - Add/remove questions and options dynamically
  - Real-time validation for form structure
- **Public Forms**
  - Shareable public links for anyone to submit feedback
  - Responsive, accessible public form UI
  - Validation for all answers
- **Response Analytics**
  - View all responses in a table
  - Summary statistics for each question (counts, text samples)
  - Download responses as CSV
- **UI/UX**
  - Modern, responsive Material UI design
  - Dark mode toggle with full theme support
  - Snackbar notifications for all feedback
  - Accessible: ARIA labels, keyboard navigation, color contrast
  - Consistent button and card styling in all modes
- **API & Data**
  - RESTful API with clear separation of concerns
  - Pagination for large lists (forms, responses)
  - Consistent error handling and validation
  - Mongoose models with indexes for performance
- **Scalability & Maintainability**
  - Modular code structure (controllers, models, routes, middleware, components, pages)
  - Easily extensible for new features (question types, user roles, analytics)
  - Environment variable support for easy deployment

---

## 🛠 Tech Stack
- **Frontend:** React, Material UI, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT, bcrypt
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit

---

## ⚡️ Setup Instructions

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd assignment_a
```

### 2. Install dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory with:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://feedback-platform.vercel.app
```
Optionally, create a `.env` in `frontend/` for API URL:
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### 4. Running the App
- **Backend:**
  ```sh
  cd backend
  npm start
  # or: npm run dev
  ```
- **Frontend:**
  ```sh
  cd frontend
  npm start
  ```
- Visit [https://feedback-platform.vercel.app](https://feedback-platform.vercel.app)

---

## 📚 API Documentation

### **Auth**
- `POST /api/auth/register` — Register admin
- `POST /api/auth/login` — Login, returns JWT

### **Forms**
- `POST /api/forms` — Create form (admin, validated)
- `GET /api/forms` — List forms (admin, paginated)
- `GET /api/forms/public/:formId` — Get public form
- `POST /api/forms/public/:formId/response` — Submit response (rate-limited, validated)
- `GET /api/forms/:formId/responses` — Get responses (admin, paginated)
- `GET /api/forms/:formId/summary` — Get response summary (admin)
- `GET /api/forms/:formId/export` — Export responses as CSV (admin)

### **Request/Response Examples**
- See `src/utils/api.js` and frontend pages for usage examples.

---

## 🎨 UI/UX Highlights
- Fully responsive and mobile-friendly
- Dark mode toggle with persistent theme
- Accessible forms and navigation (ARIA, keyboard, color contrast)
- Consistent button and card styling in all modes
- Snackbar notifications for all user feedback

---

## 📈 Scalability & Extensibility
- Modular codebase for easy feature addition
- Pagination and indexes for large data sets
- Ready for team collaboration and CI/CD
- Easily extendable for new question types, user roles, analytics, etc.

---

## 🧪 Testing
- (Add instructions if you have tests. Otherwise, describe how to manually test key flows.)

---

## 🛠 Troubleshooting
- **CORS errors:** Ensure `FRONTEND_URL` and `REACT_APP_API_URL` are set correctly.
- **MongoDB connection:** Check `MONGO_URI` in your `.env`.
- **Port conflicts:** Change default ports in frontend/backend if needed.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE) # Feedback-form
