import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
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
const app = express()

const corsOptions = {
   origin: ['https://mango-river-06d82041e.5.azurestaticapps.net', "http://localhost:3000"], // Explicit frontend origin
   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
   credentials: true, // Required for cookies/credentials
};

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.options('*', (req, res) => {
   res.header('Access-Control-Allow-Origin', req.headers.origin);
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   res.header('Access-Control-Allow-Credentials', 'true');
   res.sendStatus(200);
});

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
app.use("/api/thankyouPage", thankYouPageRoutes)

const port = process.env.port ||  4000

app.listen(port, (req, res) => {
   console.log("runninnnnnnnnnnnn")
})