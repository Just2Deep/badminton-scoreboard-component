# Badminton Scoreboard Component

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/frozenlake05-gmailcoms-projects/v0-badminton-scoreboard-component)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/P45lHaVX3Ak)

## Overview

A dynamic, real-time badminton tournament scoreboard application built with Next.js and React. This application displays live match information, upcoming games, and recent results for the "Super Cup - Season 03" badminton tournament.

## Features

### 🏆 Tournament Display

-   **Live Tournament Branding**: Features tournament logos and "Super Cup - Season 03" branding
-   **Real-time Data**: Automatically fetches and updates match data from Google Sheets
-   **Auto-refresh**: Updates every 15 seconds to ensure current information

### 📊 Scoreboard Components

-   **Upcoming Matches**: Displays next 6 scheduled matches with player names and match numbers
-   **Recent Results**: Shows completed matches with scores and winners in a scrolling marquee
-   **Live Match Indicators**: Highlights currently live matches with animated indicators
-   **Match Details**: Includes match numbers, player names, scores, and timestamps

### 🎨 Visual Features

-   **Dual Display Mode**: Alternates between scoreboard and media slideshow every 30/20 seconds
-   **Media Gallery**: Rotating slideshow of tournament photos and highlights
-   **Responsive Design**: Optimized for various screen sizes and displays
-   **Smooth Animations**: CSS animations for data updates and transitions
-   **Modern UI**: Gradient backgrounds, glass-morphism effects, and professional styling

### 🔄 Data Management

-   **Google Sheets Integration**: Pulls data from OpenSheet API
-   **Error Handling**: Graceful error handling with retry functionality
-   **Loading States**: Skeleton loading animations while data loads
-   **Data Validation**: Filters and validates match data before display

## Technical Stack

-   **Framework**: Next.js 14 with React 18
-   **Styling**: Tailwind CSS with custom animations
-   **UI Components**: Radix UI primitives
-   **Data Source**: Google Sheets via OpenSheet API
-   **Deployment**: Vercel
-   **TypeScript**: Full type safety

## Data Structure

The app expects Google Sheets data with the following columns:

-   `Match`: Match number
-   `Player A`: First player name
-   `Player B`: Second player name
-   `Score`: Match score
-   `Winner`: Winner name
-   `Status`: "past" or "next" to indicate match status

## Deployment

Your project is live at:

**[https://vercel.com/frozenlake05-gmailcoms-projects/v0-badminton-scoreboard-component](https://vercel.com/frozenlake05-gmailcoms-projects/v0-badminton-scoreboard-component)**

## Development

### Local Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

### Environment

-   Node.js 18+
-   pnpm package manager
-   Modern browser with CSS Grid support

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/P45lHaVX3Ak](https://v0.app/chat/projects/P45lHaVX3Ak)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Usage

Perfect for:

-   Tournament venues displaying live scores
-   Sports clubs showing match schedules
-   Badminton academies tracking competitions
-   Event organizers managing tournaments
-   Sports facilities with digital displays

The scoreboard automatically cycles between match information and promotional media, making it ideal for tournament venues and sports facilities.
