import dotenv from 'dotenv';
dotenv.config();

export const config = {
   database: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      port: process.env.DB_PORT,
   },
   jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
   },
   server: {
      port: process.env.PORT || 4000,
      nodeEnv: process.env.NODE_ENV || "development",
   },
   cookie: {
      secret: process.env.COOKIE_SECRET,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: "/",
      domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined
   },
   rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === "production" ? 100 : 1000), // 100 in prod, 1000 in dev
   }
};
