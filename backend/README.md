# Backend Configuration Setup

## Environment Variables

This application requires the following environment variables to be set in a `.env` file:

### Database Configuration
- `DB_HOST` - Database host (e.g., "localhost" or "your-database-host")
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB` - Database name
- `DB_PORT` - Database port (default: 3306)

### JWT Configuration
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time (default: "24h")

### Server Configuration
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment mode ("development" or "production")

### Cookie Configuration
- `COOKIE_SECRET` - Secret key for cookie signing
- `DOMAIN` - Cookie domain (required in production)

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window (default: 100 in production, 1000 in development)

## Setup Instructions

1. The `config.js` file contains fallback values for local development
2. Create a `.env` file in the backend directory to override sensitive values
3. Add your environment variables to the `.env` file for production use
4. The `.env` file is gitignored to prevent sensitive information from being committed

## Security Notes

- The `.env` file is gitignored to prevent sensitive information from being committed
- For production, always use environment variables to override the fallback values
- The `config.js` file can be committed as it only contains development fallbacks
- Use strong, unique secrets for JWT and cookie signing in production
