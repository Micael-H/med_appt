# Medical Appointment Booking

## About the project

Medical Appointment Booking is the StayHealthy Inc. website project for the IBM Front-End Development Capstone. StayHealthy is a non-profit organization working to improve access to healthcare in remote areas. The planned website helps patients find doctors and schedule consultations.

## Current development stage

This stage implements the **static website layouts** laboratory using HTML and CSS, with a small JavaScript enhancement for the mobile menu and demonstration form submission. The starter landing page has been adapted to the approved Module 1 design, using a green, lime and cream palette.

The pages include:

- A responsive navigation bar with Home, Appointments, Sign Up and Login links.
- A sign-up form with required Role (Patient or Doctor), Name, Phone Number, Email and Password fields, plus Submit and Reset buttons. Email uses native email validation; the password requires at least eight characters.
- A login form with required Email and Password fields, plus Login and Reset buttons.
- Reciprocal links between the sign-up and login pages and links back to the landing page.

These are academic layouts. Authentication, patient profiles and appointment processing belong to later development stages.

## Repository structure

```text
grihf-frontend_capstone_starter_code/
├── Landing_Page/
│   ├── LandingPage.html
│   └── LandingPage.css
├── Navbar/
│   ├── Navbar.html
│   └── Navbar.css
├── Sign_Up/
│   ├── Sign_Up.html
│   └── Sign_Up.css
├── Login/
│   ├── Login.html
│   └── Login.css
├── assets/
│   ├── forms.css
│   └── site.js
├── .gitignore
└── README.md
```

`Navbar.css` supplies the shared visual styles, and `assets/forms.css` shares the form layout between Sign Up and Login. The lab may refer to `Landing_Page` simply as the Landing folder.

## Open the website

No npm installation or build step is required.

Open `Landing_Page/LandingPage.html` in a modern browser, then use the navigation links to open Sign Up and Login.

### Skills Network Labs

1. Open the cloned repository in the lab editor.
2. Open `Landing_Page/LandingPage.html` and choose **Go Live** to start Live Server.
3. If the preview does not open automatically, open the lab's application preview on port **5500** and navigate to `/Landing_Page/LandingPage.html`.

### Optional local server

If Python is installed, run this command from the repository root:

```bash
python -m http.server 5500
```

Then visit [the local landing page](http://localhost:5500/Landing_Page/LandingPage.html).

## Form behavior and data

`assets/site.js` controls the responsive navigation and handles demonstration form submissions. With the script loaded, native browser validation checks the required fields before submission. A successful demonstration clears the fields and displays a status message; Reset clears the fields and that message.

The demonstration does not create accounts, authenticate users, store credentials or transmit form data. Use fictional information only. Never commit personal access tokens, passwords, private keys or real patient information.

## Laboratory evidence

Capture the implemented layouts in the browser and save the screenshots with the names required by the lab:

- `navbar_layout.png`
- `signup_form_layout.png`
- `login_form_layout.png`

These names describe the evidence to prepare; this README does not certify that screenshots or checks have already been completed.

## Later course stages

The first-phase requirements also include doctor listings and search, appointment scheduling, rescheduling and cancellation, upcoming appointment notifications, consultation feedback and profile management. Follow the later course labs to implement those features and their required React and backend integration.

## Upstream starter

[IBM Developer Skills Network — Front-End Capstone Starter Code](https://github.com/ibm-developer-skills-network/grihf-frontend_capstone_starter_code)

This project builds on the official starter repository. Refer to the upstream repository for its applicable terms.

## Skills Network lab

Cloned and verified in IBM Skills Network Cloud IDE.

## React environment and backend connectivity

This repository is `med_appt`, the next course stage. The React UI is the default Vite screen required by this lab; the previous HTML/CSS layouts are preserved directly under `src/Landing_Page`, `src/Navbar`, `src/Sign_Up`, `src/Login` and `src/assets`. Conversion to React components belongs to the next labs.

### Run in Skills Network

1. Run `npm ci` in the project root and `npm ci --prefix server`.
2. Create MongoDB in Skills Network Toolbox. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` using the current Mongo host, port and password (URL-encode the password if necessary). Set a random `JWT_SECRET` and set `CLIENT_ORIGIN` to the client preview URL for port 4173.
3. Run `node index.js` from `server`. A successful database connection is confirmed before the HTTP server starts on port 8181. Launch port 8181 in the toolbox; it should display `Hello World!`.
4. Copy `.env.example` to `.env` in the project root and set `VITE_API_URL` to the backend preview URL. This is a public endpoint, never a password.
5. Run `npm run preview` in the root and launch port 4173. The preview command builds before starting the Vite preview server.

The lab services are temporary. After restarting MongoDB, update only the ignored `server/.env`; never commit it. `src/config.js` reads `VITE_API_URL` with a localhost:8181 fallback. `src/Setauthtoken.js` is supplied for the later routing integration and requires React Router.

### Backend adjustments

Based on the IBM Server_Setup.zip provided in the course. Credentials are read from environment variables rather than committed into db.js. The backend waits for MongoDB, limits CORS to CLIENT_ORIGIN (comma-separated origins allowed), uses expiring JWTs and protects profile routes by the authenticated user's token id. Send `auth-token` or `Authorization: Bearer ...` when accessing GET/PUT `/api/auth/user` or PUT `/api/auth/update`; an email header alone is not authorization. Use fictitious test data only.

Validation commands: `npm run build`, `npm run lint`, and `node --check server/index.js`. This is an educational starter, not a production healthcare system.

For the Skills Network client preview, also set VITE_PREVIEW_HOST in the root .env to the exact hostname of the port 4173 preview URL, without https:// or a path. This explicitly allows that host in Vite preview.

