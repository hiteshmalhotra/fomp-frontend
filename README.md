# FOMP — Food Operations Management Platform

Internal enterprise web application for managing a multi-location canteen operation inside a company campus.

---

## Tech Stack

| Layer           | Technology                  |
|---------------- |-----------------------------|
| Framework       | React 18.x + TypeScript 5.x |
| UI Library      | Ant Design 5.x              |
| State           | Zustand                     |
| Server State    | TanStack Query v5           |
| HTTP            | Axios                       |
| Routing         | React Router v6             |
| Forms           | React Hook Form + Zod       |
| Build           | Vite 8.x                    |
| Package Manager | npm                         |
| Node            | v20.x LTS                   |

---

## Prerequisites

### macOS

1. **Install Homebrew**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install Node.js v20 LTS**
```bash
brew install node@20
node --version   # should print v20.x.x
```

3. **Install Git**
```bash
brew install git
git --version
```

4. **Install VS Code**
Download from https://code.visualstudio.com and install.

Then add the `code` CLI:
- Open VS Code
- Press `Cmd + Shift + P`
- Type `Shell Command: Install 'code' command in PATH`
- Press Enter

5. **Install GitHub Desktop** *(optional but recommended)*
Download from https://desktop.github.com

---

### Windows

1. **Install Node.js v20 LTS**
Download from https://nodejs.org/en/download — choose "LTS" → Windows Installer (.msi)

Verify:
```bash
node --version   # v20.x.x
npm --version
```

2. **Install Git**
Download from https://git-scm.com/download/win — use all default options during install.

Verify:
```bash
git --version
```

3. **Install VS Code**
Download from https://code.visualstudio.com

During install, check:
- ✅ Add "Open with Code" action to Windows Explorer
- ✅ Add to PATH

4. **Install GitHub Desktop** *(optional but recommended)*
Download from https://desktop.github.com

---

## Recommended VS Code Extensions

Install these in VS Code (`Cmd/Ctrl + Shift + X`):

| Extension | Publisher |
|-----------|-----------|
| ESLint | Microsoft |
| Prettier | Prettier |
| TypeScript + JavaScript | Microsoft |
| CSS Modules | clinyong |
| Auto Import | steoates |
| GitLens | GitKraken |
| Error Lens | Alexander |

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fomp-frontend.git
cd fomp-frontend
```

Or via GitHub Desktop:
- Open GitHub Desktop
- File → Clone Repository
- Choose `fomp-frontend`
- Click Clone

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Environment variables

Create `.env.development` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Food Operations Management Platform
VITE_APP_SHORT_NAME=FOMP
VITE_ENV=development
```

Create `.env.production` in the project root:

```env
VITE_API_BASE_URL=https://api.fomp.company.com
VITE_APP_NAME=Food Operations Management Platform
VITE_APP_SHORT_NAME=FOMP
VITE_ENV=production
```

> ⚠️ Never commit `.env` files to git. They are already in `.gitignore`.

---

### 4. Start development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

### 5. Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

---

### 6. Preview production build locally

```bash
npm run preview
```

---

## Project Structure

```
fomp-frontend/
├── src/
│   ├── api/                        Axios instance + API functions
│   │   ├── client.ts               Axios instance with interceptors
│   │   └── auth.api.ts             Auth endpoints
│   ├── components/
│   │   ├── common/                 Shared reusable components
│   │   │   └── PasswordStrengthIndicator/
│   │   ├── layout/                 AppLayout, Sidebar, TopNav
│   │   └── forms/                  Shared form components
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── _shared/            Shared layout + hooks for auth
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── unauthorized/
│   │   ├── admin/
│   │   ├── store/
│   │   ├── kitchen/
│   │   └── canteen/
│   ├── store/                      Zustand stores
│   │   ├── auth.store.ts           JWT, user, role
│   │   └── ui.store.ts             Sidebar, theme
│   ├── hooks/                      Global custom hooks
│   ├── types/                      TypeScript interfaces
│   ├── utils/                      Formatters, constants, permissions
│   ├── router/                     Routes + guards
│   └── theme/                      Ant Design token overrides
├── .env.development
├── .env.production
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Roles and Access

| Role | Home Route |
|------|-----------|
| ROLE_ADMIN | /admin/dashboard |
| ROLE_STORE_MANAGER | /store/dashboard |
| ROLE_KITCHEN_MANAGER | /kitchen/dashboard |
| ROLE_CANTEEN_MANAGER | /canteen/dashboard |
| ROLE_USER | /profile |

---

## Backend

All API requests go through the Spring Boot API Gateway:

- Development: `http://localhost:8080`
- Production: `https://api.fomp.company.com`

Never call microservice ports directly.

---

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Stage and commit
git add .
git commit -m "feat: description of what you built"

# Push
git push origin feature/your-feature-name
```

### Commit message format

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Config, tooling, setup |
| `refactor:` | Code restructure |
| `style:` | CSS / UI only changes |
| `docs:` | Documentation |

---

## Available Scripts

```bash
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## Pending

- [ ] TypeScript types from OpenAPI spec
- [ ] CI/CD — GitHub Actions + Dockerfile
- [ ] SSE notifications
- [ ] Inner screen Figma designs
- [ ] Vitest + React Testing Library setup
- [ ] ESLint + Prettier config

---

## License

Internal use only. All rights reserved.