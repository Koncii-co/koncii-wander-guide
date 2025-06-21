# Koncii - Your AI Travel Concierge

Koncii is a modern, AI-powered travel planning application designed to provide a seamless and intelligent experience for discovering, planning, and booking trips. It leverages a powerful tech stack to deliver a feature-rich and user-friendly interface.

## ✨ Features

- **AI-Powered Assistance**: Integrated chat interface for travel suggestions and planning.
- **Interactive Maps**: Explore destinations and nearby attractions with Mapbox.
- **Authentication**: Secure user sign-in and profile management with Auth0.
- **Trip & Booking Management**: Users can view and manage their planned trips and bookings.
- **Responsive Design**: A beautiful and consistent UI across all devices, built with shadcn/ui and Tailwind CSS.
- **Light & Dark Modes**: Theme toggling for user preference.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Auth0](https://auth0.com/)
- **Mapping**: [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: React Context & Hooks (with considerations for `@tanstack/react-query` for server state)
- **Backend Service**: [Supabase](https://supabase.com/) (for user profile sync)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (or your preferred package manager like Yarn or pnpm)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/koncii_co_frontend.git
    cd koncii_co_frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Environment Variables

To run the application, you need to create a `.env.local` file in the root of your project and add the following environment variables.

```
# Auth0 Configuration
VITE_AUTH0_DOMAIN="your-auth0-domain"
VITE_AUTH0_CLIENT_ID="your-auth0-client-id"

# Supabase Configuration
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Mapbox Configuration
VITE_MAPBOX_TOKEN="your-mapbox-public-token"
```

- You can get your Auth0 credentials from the [Auth0 Dashboard](https://manage.auth0.com/).
- You can get your Supabase credentials from the [Supabase Dashboard](https://app.supabase.com/).
- You can get your Mapbox token from the [Mapbox Account](https://account.mapbox.com/).

### Running the Application

Once the dependencies are installed and the environment variables are set, you can run the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📜 Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Serves the production build locally for testing.
- `npm run lint`: Lints the project files using ESLint.

## 📁 Project Structure

The project follows a standard Vite + React structure, with key directories organized as follows:

```
koncii_co_frontend/
├── public/                  # Static assets (images, fonts)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components for routing
│   ├── services/            # API service calls (Auth0, Supabase)
│   └── ...
├── .env.local               # Environment variables (untracked)
├── package.json
└── vite.config.ts           # Vite configuration
```

---

This README should provide a great starting point for anyone looking to understand or contribute to your project.
