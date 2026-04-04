# Google Review Automation System - Frontend

A modern, responsive Next.js + Tailwind CSS dashboard for managing Google reviews with AI-powered suggestions and automated responses.

## Features

### 🎯 Admin Dashboard
- **KPI Cards**: Total reviews, positive/negative reviews, response rate
- **Charts & Analytics**: Review trends, rating distribution, sentiment analysis
- **Recent Reviews**: List with status indicators (responded, pending)

### 📱 Review Funnel
- QR code generation for in-store review collection
- Direct review links for email/SMS campaigns
- Funnel analytics showing completion rates

### ✨ AI Review Suggestions
- AI-generated response suggestions
- Easy apply or edit functionality
- History of previous suggestions

### 🤖 Automated Responses
- Table view of customer reviews
- AI response suggestions for each review
- Approve, edit, or schedule responses
- Status tracking (draft, scheduled, posted)

### ⚙️ Settings & Integrations
- Business profile management
- Google Maps integration setup
- Notification preferences
- Customizable alerts

## Tech Stack

- **Framework**: Next.js 16+
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4+
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Custom component library

## Installation

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Setup

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   # or
   pnpm install
   ```

2. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Setup

1. Create your local env file:

  ```bash
  cp .env.example .env.local
  ```

2. Fill required values in `.env.local`:

  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI`

3. Optional AI config for local response generation:

  - `AI_PROVIDER=auto|openai|gemini`
  - `OPENAI_API_KEY`
  - `GEMINI_API_KEY`

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── dashboard/               # Dashboard page
│   ├── review-funnel/           # Review funnel page
│   ├── ai-suggestions/          # AI suggestions page
│   ├── automated-responses/     # Automated responses page
│   └── settings/                # Settings page
├── components/
│   ├── layout/                  # Layout components
│   │   └── header.tsx           # Main header with navigation
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── badge.tsx            # Badge component
│   │   ├── input.tsx            # Input components
│   │   ├── modal.tsx            # Modal component
│   │   └── table.tsx            # Table components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── kpi-card.tsx         # KPI card component
│   │   ├── charts.tsx           # Chart components
│   │   └── review-list.tsx      # Review list component
│   └── providers/
│       └── theme-provider.tsx   # Theme context provider
├── lib/
│   └── mock-data.ts             # Mock data for development
└── types/                        # TypeScript type definitions
```

## Available Scripts

### Development
```bash
npm run dev
```
Runs the development server at http://localhost:3000

### Build
```bash
npm run build
```
Creates an optimized production build

### Production
```bash
npm run start
```
Runs the production server

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality

## Features Implemented

### Dashboard
- ✅ KPI cards with trend indicators
- ✅ Review trend chart (line chart)
- ✅ Rating distribution chart (bar chart)
- ✅ Sentiment analysis pie chart
- ✅ Recent reviews list with status

### Review Funnel
- ✅ QR code generation placeholder
- ✅ Direct review link generation
- ✅ Funnel progress bars
- ✅ CTA buttons for campaigns

### AI Suggestions
- ✅ Original vs AI suggestion comparison
- ✅ Edit and apply functionality
- ✅ Status tracking
- ✅ Previous suggestions history

### Automated Responses
- ✅ Reviews table with all details
- ✅ AI suggestions preview
- ✅ Approve/schedule responses
- ✅ Modal for editing responses
- ✅ Status management

### Settings
- ✅ Business profile management
- ✅ Google Maps integration status
- ✅ Notification preferences
- ✅ Notification method selection

## UI/UX Features

- ✅ **Responsive Design**: Mobile-first, fully responsive across all devices
- ✅ **Dark Mode**: Full dark mode support with theme toggle
- ✅ **Smooth Animations**: Fade-in and slide-in animations
- ✅ **Accessible**: Semantic HTML, focus management, keyboard navigation
- ✅ **Performance**: Optimized components, lazy loading
- ✅ **Clean Design**: Minimalist, modern SaaS aesthetics

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    600: '#0284c7',
    // ... customize as needed
  }
}
```

### Components
All UI components are in `src/components/ui/` and can be customized independently.

### Mock Data
Update `src/lib/mock-data.ts` to change sample data for development.

## API Integration

Currently, all data is mock data. To integrate with a real backend:

1. Create API client methods in `src/lib/api.ts`
2. Replace mock data imports with API calls
3. Add error handling and loading states
4. Implement authentication if needed

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind (no CSS files needed)
- Optimized bundle size with tree-shaking

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: All modern versions

## Future Enhancements

- [ ] Real-time notifications
- [ ] WebSocket integration for live updates
- [ ] Advanced filtering and search
- [ ] Data export functionality
- [ ] Custom report builder
- [ ] Multi-language support
- [ ] OAuth 2.0 authentication
- [ ] API rate limiting visualization

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - Google Review Automation System

## Support

For issues and questions, please contact the development team.
