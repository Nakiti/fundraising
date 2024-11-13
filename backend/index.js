import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import organizationRoutes from "./routes/organizationRoutes.js"
import campaignRoutes from "./routes/campaignRoutes.js"
import previewRoutes from "./routes/previewRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import designationRoutes from "./routes/designationRoutes.js"
import campaign_designationRoutes from "./routes/campaign_designationRoutes.js"
import custom_questionRoutes from "./routes/campaign_questionRoutes.js"
import landing_pageRoutes from "./routes/landing_pageRoutes.js"

const app = express()

const corsOptions ={
   origin: true,
   credentials: true
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/organization", organizationRoutes)
app.use("/api/campaign", campaignRoutes)
app.use("/api/preview", previewRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/user", userRoutes)
app.use("/api/designation", designationRoutes)
app.use("/api/campaign_designation", campaign_designationRoutes)
app.use("/api/campaign_question", custom_questionRoutes)
app.use("/api/landing_page", landing_pageRoutes)

const port = 4000

app.listen(port, (req, res) => {
   console.log("runninnnnnnnnnnnn")
})