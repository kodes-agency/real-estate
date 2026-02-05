# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real estate platform built with **Next.js 15 (App Router)** and **Payload CMS v3** as the headless CMS. The frontend is a Next.js application serving the public website, while Payload CMS provides the admin interface and API. All content is in **Bulgarian**.

- **Frontend**: Next.js App Router at `/app/(frontend)/`
- **Backend**: Payload CMS admin at `/admin` and API at `/api`
- **Database**: PostgreSQL via `@payloadcms/db-postgres`
- **File Storage**: AWS S3 via `@payloadcms/storage-s3`

## Development Commands

```bash
# Start development server (with Turbo mode)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Seed properties database
npm run seed:properties
```

## Architecture

### Route Groups

The app uses Next.js route groups for separation:
- `(frontend)` - Public-facing routes
- `(payload)` - Payload CMS admin (`/admin`) and API routes (`/api`)

### Payload Collections

Content is managed through Payload CMS collections defined in `/collections/`:
- `Properties` - Real estate listings
- `Categories`, `ParentCategories` - Property categorization
- `Regions`, `Cities` - Geographic organization
- `Characteristics`, `Tags` - Property attributes
- `Requests`, `PropertiesRequests` - Property inquiries/leads
- `Media` - Image assets (stored on S3)
- `Users` - Admin users

### Global Data

The `HomePage` global (`/globals/HomePage.ts`) defines homepage content. Access via:
```typescript
const homePage = await payload.findGlobal({ slug: 'home-page' })
```

### Data Fetching Patterns

Server components fetch data directly using Payload client:
```typescript
import getPayload from '@/lib/getPayload'

const payload = await getPayload()
const properties = await payload.find({
  collection: 'properties',
  where: { ... }
})
```

### Component Organization

- `components/global/` - Shared app-wide components (header, theme providers)
- `components/home/` - Homepage-specific components
- `components/page/` - Page-specific components
- `components/forms/` - Form components (using TanStack Form + Zod)
- `components/ui/` - Reusable Shadcn UI components

### Styling

- **Tailwind CSS v4** via PostCSS plugin
- **Custom gold theme** - Extended with gold accent colors (see `GoldButton`, `GoldLine`, `GoldText` components)
- **Font**: Montserrat with Cyrillic subset support
- CSS variables for theming in `app/globals.css`

### TypeScript Configuration

Path aliases configured:
- `@/*` → Project root
- `@payload-config` → `./payload.config.ts`

Payload generates types at `payload-types.ts` - regenerate after schema changes.

## Payload CMS Configuration

Key settings in `payload.config.ts`:
- **Auto-login** for development when `PAYLOAD_ENABLE_AUTOLOGIN=true`, `DEV_USERNAME`, and `DEV_PASSWORD` are set
- **SEO plugin** enabled for properties and home-page
- **Lexical editor** for rich text fields
- **Bulgarian (bg)** as the only supported language
- **S3 storage** configured for Media collection

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Payload encryption secret
- `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT` - S3 configuration

Optional (dev):
- `PAYLOAD_ENABLE_AUTOLOGIN`, `DEV_USERNAME`, `DEV_PASSWORD` - Auto-login for admin
