# Parascores

A modern web application for tracking live football scores, statistics, and match information.

## Overview

Parascores provides real-time football match data, including scores, lineups, statistics, and league tables. Built with React and TypeScript, it offers a responsive and intuitive interface for football fans to follow their favorite teams and competitions.

## Features

- **Live Scores**: Real-time match score updates
- **Match Statistics**: Comprehensive match stats including possession, shots, and cards
- **Team Lineups**: View detailed formations and player positions
- **Head to Head**: Historical matchup statistics between teams
- **League Tables**: Current standings for all major leagues
- **Dark/Light Theme**: Toggle between visual modes for comfortable viewing
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Stadium Information**: Venue details with Google Maps integration

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- React Query for data fetching
- React Router for navigation
- Context API for state management
- PrimeReact for UI components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/parascores.git
cd parascores
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file with required API keys

```bash
npm run dev
```

## Project Structure

parascores/ ├── public/ # Static assets ├── src/ │ ├── api/ # API integration and queries │ ├── components/ # React components │ │ ├── pages/ # Page components │ │ └── ... # UI components │ ├── context/ # React context providers │ ├── hooks/ # Custom React hooks │ ├── types/ # TypeScript type definitions │ ├── utils/ # Utility functions │ ├── App.tsx # Main application component │ ├── index.css # Global styles │ └── main.tsx # Application entry point ├── tailwind.config.js # Tailwind CSS configuration ├── tsconfig.json # TypeScript configuration └── package.json # Project dependencies and scripts

## Key Components

### Match Details

The Match component displays comprehensive information about a specific match, including:

- Live score
- Match events (goals, cards, substitutions)
- Team lineups and formations
- Match statistics
- Head-to-head historical data

### League Fixtures

The Fixtures component shows all matches for a specific league, with:

- Filtering options for live/upcoming matches
- Date navigation
- Quick access to match details

### Team Lineups

The LineUpCard component visualizes team formations with:

- Interactive player positions
- Formation display (4-3-3, 4-4-2, etc.)
- Player details on interaction

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Match Details

![Match Details](screenshots/match.png)

### League Table

![League Table](screenshots/league.png)

## API Integration

Parascores uses the SportMonks Football API to fetch live and historical football data. API calls are managed through the custom hooks in the `src/api` directory.

## Future Enhancements

- User accounts and favorite teams
- Push notifications for goals and match events
- Historical match archives
- Advanced statistics and player ratings
- Betting odds integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by SportMonks API
- Icons from React Icons
- UI components from PrimeReact

---

Built with ❤️ by Oluwaseyi
