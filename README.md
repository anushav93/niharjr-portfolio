# Nihar J Reddy Photography Portfolio

A modern, enterprise-grade photography portfolio built with Next.js 15, Contentful CMS, and Tailwind CSS.

## Features

- **Contentful CMS Integration** - Headless CMS for easy content management
- **Responsive Design** - Mobile-first approach with beautiful layouts
- **Theme System** - Easy color customization via CSS variables
- **Image Optimization** - Automatic image optimization with Next.js Image
- **Gallery with Collections** - Organized photo galleries with filtering
- **Contact Form** - Email integration with Resend
- **Admin Dashboard** - Protected admin area with Google OAuth
- **Dark Mode Support** - Full dark mode theming

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Contentful
- **Styling**: Tailwind CSS with CSS Custom Properties
- **Authentication**: NextAuth.js with Google OAuth
- **Email**: Resend
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Contentful account
- Google OAuth credentials (for admin)
- Resend API key (for contact form)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/niharjr-portfolio.git
cd niharjr-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:

```bash
# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_api_token
CONTENTFUL_ENVIRONMENT=master

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=your_admin_email

# Email
RESEND_API_KEY=your_resend_api_key

# Optional: Unsplash (for image migration)
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Contentful Setup

See [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md) for detailed instructions on:

- Creating content models
- Setting up API keys
- Migrating images from Unsplash
- Publishing content

## Theme Customization

Colors are managed through CSS custom properties in `src/styles/theme.css`.

### Changing Colors

1. Open `src/styles/theme.css`
2. Modify the color variables:

```css
:root {
  /* Change primary color to purple */
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  
  /* Change secondary color to pink */
  --color-secondary-500: #ec4899;
}
```

3. The entire site updates automatically

### Available Color Palettes

- **Primary** - Main brand color (default: blue)
- **Secondary** - Accent color (default: orange)
- **Accent** - Highlight color (default: amber)
- **Neutral** - Grayscale
- **Success** - Positive states (green)
- **Error** - Negative states (red)
- **Warning** - Caution states (yellow)
- **Info** - Informational states (cyan)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery page
│   └── page.tsx           # Homepage
├── components/            # Shared components
├── lib/                   # Utilities and clients
│   ├── auth.ts           # NextAuth configuration
│   └── contentful.ts     # Contentful client
├── styles/
│   └── theme.css         # Design tokens
└── types/
    └── contentful.ts     # TypeScript types
```

## Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Migrate images from Unsplash to Contentful
npx ts-node scripts/migrate-images.ts
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The site can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Self-hosted

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTENTFUL_SPACE_ID` | Yes | Contentful space ID |
| `CONTENTFUL_ACCESS_TOKEN` | Yes | Content Delivery API token |
| `CONTENTFUL_MANAGEMENT_TOKEN` | No | Management API token (for scripts) |
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption key |
| `NEXTAUTH_URL` | Yes | Application URL |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | Yes | Resend API key for emails |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.
