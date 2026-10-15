# Medical Appointment Booking â€” StayHealthy

IBM Front-End Development Capstone, Final project (Modules 1–5). A responsive React/Vite application adapted from the preceding HTML/CSS layouts and the IBM lab components.

Public deployment: https://stayhealthy-capstone-micael.micahos.chatgpt.site/

## Features

- Application-wide Notification card updates after booking and cancellation.
- GiveReviews and ReviewForm: accessible star ratings, comments and one review per demonstration booking.
- ProfileCard edits name and phone through the authenticated API; ReportsLayout displays/downloads the fictional patient_report.PDF.
- Shared responsive Navbar and React Router navigation.
- Patient registration and login connected to the Express/MongoDB backend. Validated required fields, email, ten-digit phone and password length; reset, error and loading states.
- Session token kept in sessionStorage; profile restored through the authenticated API. Logout removes token/email and returns Home.
- Doctor search by name or specialty, specialty suggestions, ratings and experience.
- AppointmentForm inside DoctorCard, available date/time selection, confirmation, conflict prevention, cancellation and upcoming appointments. Bookings are an academic simulation stored per user in the current browser tab, not backend appointments.
- InstantConsultation adapted from the IBM ZIP with reactjs-popup and UUID booking references. Controlled form and confirmation/cancellation are integrated; no live consultation occurs.

All doctors, ratings and availability are fictional demonstration fixtures. Use fictional patient information. This is an educational application, not a production healthcare service.

## Structure

```text
med_appt/
  src/
    Components/
      Navbar/             Navbar.jsx + Navbar.css
      Landing_Page/       Landing_Page.jsx + LandingPage.css
      Sign_Up/            Sign_Up.jsx + Sign_Up.css
      Login/              Login.jsx + Login.css
      FindDoctorSearch/   specialty/name search
      DoctorCard/         doctor details, form, cancellation
      AppointmentForm/    date/time form
      BookAppointment/    booking coordination and tab persistence
      InstantConsultation/ IBM component adaptation and SOURCE.md
      data/               fictional doctors and availability
    services/auth.js      register/login API client
    config.js             API_URL
    App.jsx               routes and authenticated session
  server/                 Express API and MongoDB connection
  scripts/smoke-api.cjs    real API authorization regression checks
```

The preceding HTML files remain alongside their converted components as course references. The running application uses JSX.

## Install and run

Use Node.js compatible with the version of Vite declared in package.json.

```sh
npm ci
npm ci --prefix server
```

1. Copy server/.env.example to server/.env. Configure MONGODB_URI using the current Skills Network MongoDB connection, generate a random JWT_SECRET and set CLIENT_ORIGIN to the frontend's exact origin. PORT defaults to 8181. Never commit this file.
2. Copy .env.example to .env in the project root. Set VITE_API_URL to the backend URL (localhost:8181 for local development). For Skills Network preview, set VITE_PREVIEW_HOST to the exact port4173 preview hostname without https:// or a path. Never put a password in a VITE_ variable.
3. Run `npm start --prefix server`. Database connection must succeed before the server starts. The root endpoint returns Hello World!.
4. Run `npm run dev` for local development, or `npm run preview` for the course lab. Preview builds first, then serves on port4173. Launch that port through the Skills Network Toolbox.

On restarting the lab's MongoDB service, update only the ignored server/.env because the host and password may change.

## Validation

```sh
npm run build
npm run lint
node --check server/index.js
node scripts/smoke-api.cjs
```

The smoke test requires the backend running on localhost:8181 and server/.env or environment variables pointing to the same MongoDB. It creates two unique fictional users, checks authentication, isolation of profile updates and CORS, then removes only its own records. It never prints passwords, tokens or the Mongo URI.

Browser checks cover registration/login, invalid inputs, logout/session restoration, search, booking/cancellation, duplicate-time prevention, instant consultation and mobile layouts.

## Backend and source adaptations

The backend is based on the course's Server_Setup.zip. Credentials use environment variables; JWTs expire; profile routes use the verified token id instead of trusting an email header. Send auth-token or Authorization: Bearer when accessing profiles. CORS allows CLIENT_ORIGIN only (comma-separated origins supported).

Instant consultation source and adaptations: [SOURCE.md](src/Components/InstantConsultation/SOURCE.md). Signup/Login follow the supplied conversion lab's API contracts and controlled React state; invalid reloads, unused code and insecure credential handling were corrected.

## Course checklist and evidence

Required screenshots are saved separately in the local stayhealthy-modulo3-evidencias delivery folder, including the exact checklist filename InstantConsultaion.png and the lab alias instant_consultation.png.

The updated setup lab explicitly requires Vite (`npm create vite@latest`). Checklist question1 still names Create React App. This project intentionally follows the updated lab; it was not created using only create-react-app. Do not mark that literal statement true.

## Hosted API

The deployed Site serves the React production build and a same-origin Worker API from hosting/api.js. D1 stores demonstration accounts with salted PBKDF2 password hashes and hashed one-hour opaque sessions. User profile access is scoped to the authenticated session. The original Express/MongoDB server remains available for the course laboratory. Bookings/reviews stay in sessionStorage; this is disclosed in the UI.

Hosted checks: `node --test hosting/api.test.mjs`. Schema migration: `drizzle/0000_auth.sql`. The hosting build embeds the Vite assets and the API in a Worker; it does not expose server secrets to the browser.

SEO description, keywords, robots and theme-color are in index.html.
