# Story 1.1: Next.js Project Initialization

**Story ID:** STORY-1.1
**Epic:** EPIC-1 (Project Foundation)
**Priority:** P0 (Blocker)
**Estimated Time:** 1.5 hours
**Agent Assignment:** DEV Agent #1
**Dependencies:** None

---

## User Story

**As a** developer
**I want to** initialize a Next.js 14 project with Vercel AI SDK Chat Template
**So that** I have a solid foundation with built-in AI chat capabilities

---

## Acceptance Criteria

- [ ] Next.js 14 project created with App Router
- [ ] Vercel AI SDK and OpenAI SDK installed
- [ ] TypeScript configured in strict mode
- [ ] ESLint and Prettier configured
- [ ] Project builds successfully (`npm run build`)
- [ ] Development server runs (`npm run dev`)
- [ ] Git repository initialized
- [ ] `.gitignore` properly configured

---

## Technical Tasks

### 1. Initialize Next.js Project
```bash
# Option 1: From scratch
npx create-next-app@latest gandalf --typescript --tailwind --app --eslint

# Option 2: Using Vercel AI SDK template (recommended)
npx create-next-app@latest gandalf -e https://github.com/vercel/ai/tree/main/examples/next-openai

cd gandalf
```

### 2. Install Core Dependencies
```bash
npm install ai openai
npm install -D @types/node typescript
```

### 3. Configure TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4. Configure ESLint (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 5. Configure Prettier (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 6. Create .gitignore
```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

## Testing Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts server on port 3000
- [ ] Browser shows Next.js default page
- [ ] Hot reload works (edit page.tsx)
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes
- [ ] TypeScript strict mode catches errors
- [ ] Git initialized with proper .gitignore

---

## Files Created

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `.eslintrc.json`
- `.prettierrc`
- `.gitignore`
- `next.config.js`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `.git/` (repository)

---

## Dependencies Added

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ai": "^latest",
    "openai": "^latest",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## Handoff to Next Story

After completing this story:
- Story 1.2 (UI Framework Setup) can begin
- Story 1.3 (Project Structure) can begin in parallel

Provide to next developers:
- Repository URL/location
- Confirmation that `npm run dev` works
- Confirmation that TypeScript strict mode is enabled

---

## Notes

- If using Vercel AI SDK template, much of this is pre-configured
- Ensure Node.js 18+ is installed
- Recommend using npm (not yarn/pnpm) for consistency
- Port 3000 must be available

---

**Status:** Ready to Start
**Estimated Time:** 1.5 hours
**Complexity:** Low
