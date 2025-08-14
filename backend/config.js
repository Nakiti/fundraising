import dotenv from 'dotenv';
dotenv.config();

export const config = {
   database: {
      host: process.env.DB_HOST || "mysql-ehundi.mysql.database.azure.com",
      user: process.env.DB_USER || "nakiti",
      password: process.env.DB_PASSWORD || "eHundi$123",
      database: process.env.DB || "fundraising",
      port: process.env.DB_PORT || 3306,
   },
   jwt: {
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-here-change-this-in-production",
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
   },
   server: {
      port: process.env.PORT || 4000,
      nodeEnv: process.env.NODE_ENV || "development",
   },
   cookie: {
      secret: process.env.COOKIE_SECRET || "your-cookie-secret-key-here",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: "/",
      domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined
   },
   rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
   }
};
