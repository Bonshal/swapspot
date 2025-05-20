# SwapSpot - Online Marketplace

SwapSpot is a modern, secure online marketplace built with React, TypeScript, and a suite of best-in-class technologies.

## Features

- Peer-to-peer listings
- Real-time messaging
- Secure payments with escrow 
- Automated reviews & analytics
- AI-driven fraud detection
- Aadhaar-based KYC (coming soon)

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand, React Query
- **Routing**: React Router
- **UI Components**: Custom component library with Tailwind
- **Build & DevOps**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/swapspot.git
   cd swapspot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```
npm run build
```

The built files will be in the `dist` directory.

### Docker

You can also use Docker to run the application:

```
docker-compose up -d
```

This will build and start the application at `http://localhost:8080`.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── auth/       # Authentication components
│   ├── home/       # Homepage components
│   ├── layout/     # Layout components
│   └── ui/         # Base UI components
├── pages/          # Page components
├── store/          # State management
├── utils/          # Utility functions
├── App.tsx         # Main app component
└── main.tsx        # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
