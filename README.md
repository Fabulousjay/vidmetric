# VidMetrics

This was given to me as a challenge. YouTube competitor intelligence tool. Paste any channel URL and instantly see which videos are performing best, why they are winning, and how the channel stacks up against a competitor.

Built as a 4-day product challenge. 

Live demo: https://vidmetric-rho.vercel.app/
GitHub: https://github.com/FABULOUSJAY/vidmetrics


## What it does

Paste a YouTube channel URL and get a full breakdown of every video — performance scores, engagement rates, view velocity, trending indicators, and auto-generated insights about what is working and what is not.

You can also paste a second channel URL to run a side-by-side comparison across six metrics, with a declared overall winner.

Everything exports. CSV for analysts, PDF for clients.


## Features

Channel analysis
- Resolves any YouTube URL format — @handle, /channel/, /c/, /user/
- Fetches channel stats — subscribers, total views, video count, upload rate
- Fetches up to 50 recent videos with full metadata

Performance scoring
- Every video gets a score from 0 to 100
- Score is weighted — 50% views relative to channel max, 30% engagement rate, 20% view velocity
- Weights are tunable in lib/config.ts without touching any component
- Labels — Excellent, Good, Average, Poor

Badges per video
- Top 1, Top 2, Top 3 by performance score
- Trending — velocity above 1.5x channel average
- Spiked — velocity above 2.5x channel average

Auto insights
- High or low engagement detection
- Upload frequency analysis
- Shorts vs long-form performance comparison
- Top performing video callout

Channel comparison
- Paste a second channel URL in the compare bar
- Side by side across six metrics — subscribers, total views, avg views per video, avg engagement, avg velocity, top score
- Winner indicators per metric
- Overall winner declared at the bottom

Video table
- Search with live filtering
- Sort by score, views, velocity, engagement, date, likes, comments
- Filter by date range — 7 days, 30 days, 90 days, all time
- Filter by minimum views and minimum engagement
- Filter by content type — Shorts vs long form

Charts
- Top 10 videos by views
- Top 10 videos by engagement rate

Exports
- CSV — all videos with every metric included
- PDF — channel stats header plus full video table, downloads as a file


## Stack

Next.js 14 App Router with TypeScript
Tailwind CSS with dark mode
Zustand for global state
Recharts for charts
RapidAPI — YouTube Data API v33
Vercel for deployment


## Getting started

Clone the repo

git clone https://github.com/FABULOUSJAY/vidmetrics.git
cd vidmetrics

Install dependencies

npm install

Create your environment file

Create a file called .env.local in the root of the project and add your RapidAPI key

RAPIDAPI_KEY=your_key_here

To get your key, go to rapidapi.com, search for YouTube Data API v33 by pawanjadam1,
subscribe to the free tier, and copy your key from the Auth section.

Run locally

npm run dev

Then open http://localhost:3000

Build for production

npm run build
npm start


## Deploying to Vercel

Push your code to GitHub. Go to vercel.com and import the repo.
Under Environment Variables add RAPIDAPI_KEY with your actual key.
Hit Deploy. Vercel handles the rest.

Your .env.local file is gitignored and never leaves your machine.


## Project structure

app/
  layout.tsx                fonts, nav, root shell
  page.tsx                  home page with channel input
  analyze/
    page.tsx                Suspense wrapper
    AnalyzeDashboard.tsx    data fetching and all loading states
    ChannelHeader.tsx       avatar, channel name, export buttons
    ChannelStats.tsx        four stat cards with calculations
    ChannelVideos.tsx       insights, charts, table, comparison
  api/
    channel/route.ts        resolves URL to channel ID and fetches stats
    videos/route.ts         fetches videos and runs scoring

components/
  ChannelInput.tsx          URL input with validation and error states
  StatCard.tsx              reusable metric display card
  VideoTable.tsx            full video list with filter and sort logic
  FilterBar.tsx             search, sort, date range, content type filters
  VideoCard.tsx             single video row with badge chips
  TopVideos.tsx             top three hero cards with medals and metrics
  InsightPanel.tsx          auto-generated insight cards
  Charts.tsx                bar charts for views and engagement
  CompareBar.tsx            second channel input connected to store
  ComparePanel.tsx          side by side metric comparison with winners
  DarkModeToggle.tsx        light and dark switch persisted to localStorage
  SkeletonLoader.tsx        skeleton cards and rows for loading states
  EmptyState.tsx            first impression on home page
  Nav.tsx                   sticky header with logo and dark mode toggle

lib/
  youtube.ts                all RapidAPI calls with retry and fallback logic
  metrics.ts                scoring engine, velocity, spike detection, badges
  insights.ts               pattern detection across video data
  export.ts                 CSV generation and download
  pdf.ts                    PDF report generation with jsPDF
  config.ts                 API config, score weights, thresholds
  flags.ts                  feature toggles for every major section

store/
  useVideoStore.ts          Zustand store for all global state

types/
  index.ts                  all shared TypeScript types


## Environment variables

RAPIDAPI_KEY — required 
