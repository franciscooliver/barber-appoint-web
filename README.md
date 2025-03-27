# Barber Appoint Web

A Vue 3 web application for managing barbershop appointments, built with TypeScript and modern tooling.

## Features

- User authentication and authorization
- Appointment management system
- Profile management
- Real-time notifications with toast messages
- Responsive design with PrimeVue components
- Role-based access control

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- Vue Router for routing
- PrimeVue for UI components
- SCSS for styling
- Vite as build tool
- Cypress for testing
- ESLint and Prettier for code quality

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Project Setup

1. Clone the repository
2. Install dependencies:
```sh
npm install
```

3. Copy environment file and configure:
```sh
cp .env.example .env
```

4. Configure the API URL in `.env`:
```
VITE_APP_API_URL=http://localhost:3001
```

## Development

Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```sh
npm run build
```

The built files will be in the `dist` directory.

## Testing

### Unit Tests
Run component tests with Cypress:
```sh
# Development mode
npm run test:unit:dev

# Headless mode
npm run test:unit
```

### End-to-End Tests
```sh
# Development mode
npm run test:e2e:dev

# Production build
npm run test:e2e
```

## Code Quality

### Lint and Fix Files
```sh
npm run lint
```

### Format Code
```sh
npm run format
```

## Project Structure

```
src/
├── assets/         # Static assets and global styles
├── components/     # Vue components
├── router/         # Route configurations
├── services/      # API services
├── stores/        # Pinia stores
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── views/         # Page components
```

## Features Details

### Authentication
- Login system with JWT
- Protected routes
- Role-based access control

### Appointment Management
- View appointments
- Schedule new appointments
- Cancel appointments
- Update appointment status

### User Profile
- View and edit profile information
- Address management with CEP integration
- Avatar support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and confidential.
