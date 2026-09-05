# Daybook — React Native To-Do App with Authentication

A full-stack take-home submission: a React Native (CLI, TypeScript) Android app
with email/password authentication, task CRUD, and a Node.js + Express +
MongoDB backend.

.
├── backend/ Node.js + Express + TypeScript + MongoDB API
└── mobile-app/ React Native CLI (TypeScript) Android app


## What's implemented

**Core requirements**
- Register / log in with email + password (JWT-based auth, bcrypt-hashed passwords)
- Add tasks with title, description, due date + time, and priority
- Mark tasks complete, edit, and delete tasks
- Task list with status, grouped and sorted intelligently (see below)
- Backend REST API on Node.js + Express with MongoDB (Mongoose)
- Redux Toolkit for state management, session persisted via AsyncStorage

**Bonus features**
- **Combined priority + deadline sorting algorithm** (`mobile-app/src/utils/sortTasks.ts`):
  tasks aren't sorted by priority *or* date alone — a single "urgency score"
  weighs how soon a task is due against how important it is, so an urgent
  low-priority task can still outrank a high-priority task that isn't due for weeks.
  Overdue tasks always float to the top; completed tasks always sink to the bottom.
- Active / Completed / All filter tabs on the task list
- Pull-to-refresh, inline delete confirmation, empty states
- A distinct visual identity (see Design notes below) rather than a generic UI kit look

## Tech stack

| Layer | Choice |
|---|---|
| Mobile | React Native CLI 0.87, TypeScript, React Navigation (native-stack) |
| State | Redux Toolkit + React-Redux, AsyncStorage for session persistence |
| Networking | Axios, with a request interceptor that attaches the JWT |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB via Mongoose |
| Auth | JSON Web Tokens + bcrypt password hashing |

## Running the backend

```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run dev                # starts on http://localhost:5000 with nodemon
```

Requires a MongoDB instance — either local (`mongodb://127.0.0.1:27017/todo_app`,
the default in `.env.example`) or a free MongoDB Atlas cluster (paste its
connection string into `MONGO_URI`).

Health check: `GET http://localhost:5000/api/health`

### API summary

| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | – | `{ name, email, password }` |
| POST | `/api/auth/login` | – | `{ email, password }` |
| GET | `/api/auth/me` | Bearer | – |
| GET | `/api/tasks` | Bearer | – |
| POST | `/api/tasks` | Bearer | `{ title, description?, dueDate?, priority }` |
| PUT | `/api/tasks/:id` | Bearer | any subset of the above + `completed` |
| PATCH | `/api/tasks/:id/complete` | Bearer | – (toggles) |
| DELETE | `/api/tasks/:id` | Bearer | – |

## Running the mobile app

```bash
cd mobile-app
npm install
npx react-native run-android   # with an emulator running, or a device connected
```

**Pointing the app at your backend:** open `mobile-app/src/api/client.ts`.
- Android **emulator**: the default `http://10.0.2.2:5000/api` already reaches
  a backend running on your host machine — no change needed.
- Physical **Android device**: replace it with your computer's LAN IP, e.g.
  `http://192.168.1.20:5000/api` (device and computer must be on the same network).

### Windows-specific setup notes

Two Windows-only fixes were required to get a clean build, both already
reflected in this repo:

1. **CMake version.** The Android Gradle Plugin's default bundled CMake
   (3.22.1) ships with an older `ninja` that enforces Windows' legacy 260-character
   path limit, which the New Architecture's autolinked C++ codegen (for
   `react-native-screens`, `react-native-safe-area-context`, etc.) can exceed.
   `mobile-app/android/app/build.gradle` pins `externalNativeBuild.cmake.version`
   to **4.1.2** to fix this — install CMake 4.1.2 via Android Studio's
   SDK Manager → SDK Tools → CMake (with "Show Package Details" checked) before
   building.
2. **Windows long path support.** Also enable it system-wide: in the Registry
   Editor, set `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled`
   to `1`.

Also create `mobile-app/android/local.properties` (not committed, machine-specific)
containing:
sdk.dir=C:\Users\<you>\AppData\Local\Android\Sdk


## Design notes

The visual direction is a calm "morning notebook" aesthetic: a pale sage-grey
background, deep-teal ink for structure and primary actions, and a warm,
distinct color per priority level (coral for high, amber for medium, sage
green for low) so the list is scannable without reading every label. Headings
use the platform serif face for a bit of personality against the sans-serif
body text, avoiding both the generic "SaaS card kit" look and a stock purple
gradient theme.

## Project structure (mobile-app/src)

src/
├── api/ axios client + auth/task endpoints
├── components/ AppButton, AppInput, TaskCard, PrioritySelector, EmptyState
├── hooks/ typed Redux hooks
├── navigation/ auth stack ↔ app stack switch, driven by auth state
├── screens/ Login, Register, TaskList, TaskEditor (add/edit)
├── store/ Redux Toolkit store + auth/tasks slices
├── theme/ color and typography design tokens
├── types/ shared TypeScript types
└── utils/ date formatting + the urgency sorting algorithm


## Verification

- Both projects type-check clean (`tsc --noEmit`)
- Mobile app passes ESLint
- Backend boots and responds correctly on `/api/health`
- App built and tested end-to-end on a physical Android emulator (Pixel-class,
  API 36): registration, login, logout, add/edit/delete/complete tasks, the
  urgency sort, filters, and session persistence across app restarts were all
  verified working, alongside live backend logs confirming real API calls
  against MongoDB.

## Author

Darshan