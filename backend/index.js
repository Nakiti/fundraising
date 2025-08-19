import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import { config } from "./config.js"
import organizationRoutes from "./routes/organizationRoutes.js"
import campaignRoutes from "./routes/campaignRoutes.js"
import donationPageRoutes from "./routes/donation_pageRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import designationRoutes from "./routes/designationRoutes.js"
import campaign_designationRoutes from "./routes/campaign_designationRoutes.js"
import custom_questionRoutes from "./routes/campaign_questionRoutes.js"
import landing_pageRoutes from "./routes/landing_pageRoutes.js"
import user_organizationRoutes from "./routes/user_organizationRoutes.js"
import campaign_detailRoutes from "./routes/campaign_detailsRoutes.js"
import sectionRoutes from "./routes/sectionRoutes.js"
import thankYouPageRoutes from "./routes/thankyou_pageRoutes.js"
import faqRoutes from "./routes/campaign_faqRoutes.js"
import ticketPageRoutes from "./routes/ticket_pageRoutes.js"
import campaignTicketRoutes from "./routes/campaign_ticketRoutes.js"
import peerFundraisingPageRoutes from "./routes/peer_fundraising_pageRoutes.js"
import peerLandingPageRoutes from "./routes/peer_landing_pageRoutes.js"
import donationFormRoutes from "./routes/donation_formRoutes.js"
import ticketPurchasePageRoutes from "./routes/ticket_purchase_pageRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import { 
  globalErrorHandler, 
  notFoundHandler, 
  handleUnhandledRejection, 
  handleUncaughtException 
} from "./middleware/errorHandler.js"

const app = express()

// Security middleware
app.use(helmet({
   contentSecurityPolicy: false, // Disable CSP for development
   crossOriginEmbedderPolicy: false
}))

// Rate limiting - more lenient in development
const limiter = rateLimit({
   windowMs: config.server.nodeEnv === "production" ? config.rateLimit.windowMs : 1 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
   max: config.server.nodeEnv === "production" ? config.rateLimit.maxRequests : 1000, // 1000 requests per minute in dev, 100 per 15 min in prod
   message: {
      success: false,
      message: "Too many requests from this IP, please try again later."
   },
   standardHeaders: true,
   legacyHeaders: false,
   skip: (req) => {
      // Skip rate limiting for health checks and certain routes
      return req.path === '/api/health' || 
             req.path.startsWith('/api/health') ||
             req.method === 'OPTIONS';
   }
})

// Apply rate limiting to all routes except those specified above
app.use(limiter)

// Stricter rate limiting for auth routes only
const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 10, // limit each IP to 10 requests per windowMs (increased from 5)
   message: {
      success: false,
      message: "Too many authentication attempts, please try again later."
   },
   standardHeaders: true,
   legacyHeaders: false,
})

const corsOptions = {
   origin: config.server.nodeEnv === "production" 
      ? ["https://yourdomain.com"] // Replace with your actual domain
      : ["http://localhost:3000", "http://localhost:3001"],
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true, // Enable credentials (cookies, etc.)
   optionsSuccessStatus: 200
};
 
app.use(express.json({ limit: '10mb' }))
app.use(cors(corsOptions))
app.use(cookieParser())

// Health check endpoint
app.get('/api/health', (req, res) => {
   res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv
   });
});

// Rate limit status endpoint (for debugging)
app.get('/api/rate-limit-status', (req, res) => {
   res.status(200).json({
      success: true,
      message: 'Rate limit status',
      environment: config.server.nodeEnv,
      rateLimitConfig: {
         windowMs: config.server.nodeEnv === "production" ? config.rateLimit.windowMs : 1 * 60 * 1000,
         maxRequests: config.server.nodeEnv === "production" ? config.rateLimit.maxRequests : 1000,
         authWindowMs: 15 * 60 * 1000,
         authMaxRequests: 10
      },
      timestamp: new Date().toISOString()
   });
});

// Rate limit reset endpoint (for debugging - development only)
if (config.server.nodeEnv === "development") {
   app.post('/api/rate-limit-reset', (req, res) => {
      // This is a simple reset - in production you'd want more sophisticated rate limit management
      res.status(200).json({
         success: true,
         message: 'Rate limit reset (development only)',
         timestamp: new Date().toISOString()
      });
   });
}

// Apply auth rate limiting to login routes
app.use("/api/user/login", authLimiter)
app.use("/api/user/create", authLimiter)

// Routes
app.use("/api/organization", organizationRoutes)
app.use("/api/campaign", campaignRoutes)
app.use("/api/donationPage", donationPageRoutes)   
app.use("/api/transaction", transactionRoutes) 
app.use("/api/user", userRoutes) 
app.use("/api/designation", designationRoutes)
app.use("/api/campaign_designation", campaign_designationRoutes)
app.use("/api/campaign_question", custom_questionRoutes)
app.use("/api/landing_page", landing_pageRoutes)
app.use("/api/user_organization", user_organizationRoutes)
app.use("/api/campaign_details", campaign_detailRoutes)
app.use("/api/sections", sectionRoutes)
app.use("/api/thankYouPage", thankYouPageRoutes)
app.use("/api/faq", faqRoutes)
app.use("/api/ticket_page", ticketPageRoutes)
app.use("/api/campaign_ticket", campaignTicketRoutes)
app.use("/api/peer_fundraising_page", peerFundraisingPageRoutes)
app.use("/api/peer_landing_page", peerLandingPageRoutes)
app.use("/api/donation_form", donationFormRoutes)
app.use("/api/ticket_purchase_page", ticketPurchasePageRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Global error handling middleware (must be last)
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', handleUnhandledRejection);

// Handle uncaught exceptions
process.on('uncaughtException', handleUncaughtException);

app.listen(config.server.port, () => {
   console.log(`Server running on port ${config.server.port} in ${config.server.nodeEnv} mode`);
}).on('error', (err) => {
   console.error('Server error:', err);
   if (err.code === 'EADDRINUSE') {
      console.error(`Port ${config.server.port} is already in use`);
      console.error('Please stop the existing process or use a different port');
   } else {
      console.error('Server failed to start:', err.message);
   }
   // Don't exit immediately, give time for cleanup
   setTimeout(() => {
      process.exit(1);
   }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
   console.log('SIGTERM received, shutting down gracefully');
   process.exit(0);
});

process.on('SIGINT', () => {
   console.log('SIGINT received, shutting down gracefully');
   process.exit(0);
});

// Handle process errors more gracefully
process.on('exit', (code) => {
   console.log(`Process exiting with code: ${code}`);
});

process.on('warning', (warning) => {
   console.warn('Process warning:', warning.name, warning.message);
   // Don't exit on warnings
});