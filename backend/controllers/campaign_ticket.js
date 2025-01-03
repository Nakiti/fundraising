import { db } from "../db.js";

export const createCampaignTicketBatch = (req, res) => {
   const query = "INSERT INTO campaign_tickets (`campaign_id`, `title`, `quantity`, `price`, `description`, `attendees`, `max_purchase`, `start_date`, `end_date`, `created_at`) VALUES ?"
   
   const values = req.body.map(ticket => [
      Number(req.params.id),
      ticket.title,
      ticket.quantity,
      ticket.price,
      ticket.description,
      ticket.attendees,
      ticket.max_purchase,
      ticket.start_date,
      ticket.end_date,
      (new Date()).toISOString().slice(0, 19).replace('T', ' ')
   ])
   
   db.query(query, [values], (err, data) => {
      if (err) return console.log(err)
      return res.status(200).json(data)
   })
}

export const deleteCampaignTicketsBatch = (req, res) => {
   const query = "DELETE FROM campaign_tickets WHERE `id` IN (?)"

   const values = req.body.map(item => item.id)

   db.query(query, [values], (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}

export const getCampaignTickets = (req, res) => {
   const query = "SELECT * FROM campaign_tickets WHERE `campaign_id` = ?"

   const value = req.params.id
   db.query(query, value, (err, data) => {
      if (err) return res.json(err)
      return res.status(200).json(data)
   })
}