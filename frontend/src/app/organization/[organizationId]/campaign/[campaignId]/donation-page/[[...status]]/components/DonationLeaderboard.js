"use client"
import { useState, useEffect } from "react"
import { getTransactionsByCampaign } from "@/app/services/fetchService"
import { FaTrophy, FaClock, FaHeart } from "react-icons/fa"

const DonationLeaderboard = ({ campaignId, display }) => {
   const [transactions, setTransactions] = useState([])
   const [loading, setLoading] = useState(true)
   const [activeTab, setActiveTab] = useState('highest') // 'highest' or 'recent'

   useEffect(() => {
      const fetchTransactions = async () => {
         try {
            setLoading(true)
            const response = await getTransactionsByCampaign(campaignId)
            // Filter only completed transactions
            const completedTransactions = response.filter(t => t.status === 'completed')
            setTransactions(completedTransactions)
         } catch (error) {
            console.error('Error fetching transactions:', error)
         } finally {
            setLoading(false)
         }
      }

      fetchTransactions()
   }, [campaignId])

   // Sort transactions by amount (highest first)
   const highestDonors = [...transactions]
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 10)

   // Sort transactions by date (most recent first)
   const recentDonors = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)

   const getDisplayName = (transaction) => {
      if (transaction.first_name && transaction.last_name) {
         return `${transaction.first_name} ${transaction.last_name}`
      } else if (transaction.first_name) {
         return transaction.first_name
      } else {
         return 'Anonymous Donor'
      }
   }

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      })
   }

   if (loading) {
      return (
         <div className="bg-white border border-slate-100 p-6 rounded-xl animate-pulse">
            <div className="h-6 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-3">
               {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-200 rounded-lg"></div>
               ))}
            </div>
         </div>
      )
   }

   if (transactions.length === 0) {
      return null // Don't show leaderboard if no transactions
   }

   return (
      <div className="bg-white border border-slate-100 p-6 rounded-xl">
         <h3 
            className="font-bold text-xl mb-6"
            style={{
               color: display?.p_color || '#1e293b',
               fontSize: Math.min(parseInt(display?.cardTitleSize) || 20, 24) + 'px'
            }}
         >
            Donation Leaderboard
         </h3>

         {/* Tab Navigation */}
         <div className="flex space-x-1 mb-6 p-1 bg-slate-100 rounded-lg">
            <button
               onClick={() => setActiveTab('highest')}
               className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'highest' 
                     ? 'bg-white text-slate-900' 
                     : 'text-slate-600 hover:text-slate-900'
               }`}
            >
               <FaTrophy className="w-4 h-4" />
               <span>Highest Donors</span>
            </button>
            <button
               onClick={() => setActiveTab('recent')}
               className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'recent' 
                     ? 'bg-white text-slate-900' 
                     : 'text-slate-600 hover:text-slate-900'
               }`}
            >
               <FaClock className="w-4 h-4" />
               <span>Recent Donors</span>
            </button>
         </div>

         {/* Leaderboard Content */}
         <div className="space-y-3">
            {(activeTab === 'highest' ? highestDonors : recentDonors).map((transaction, index) => (
               <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
               >
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                        {index === 0 && activeTab === 'highest' ? (
                           <FaTrophy className="w-5 h-5 text-yellow-500" />
                        ) : (
                           <FaHeart className="w-4 h-4 text-rose-400" />
                        )}
                     </div>
                     <div>
                        <div 
                           className="font-semibold text-base"
                           style={{ 
                              color: display?.p_color || '#1e293b',
                              fontSize: Math.min(parseInt(display?.bodyTextSize) || 16, 18) + 'px'
                           }}
                        >
                           {getDisplayName(transaction)}
                        </div>
                        {activeTab === 'recent' && (
                           <div 
                              className="text-sm"
                              style={{ color: display?.s_color || '#64748b' }}
                           >
                              {formatDate(transaction.date)}
                           </div>
                        )}
                     </div>
                  </div>
                  <div 
                     className="font-bold text-lg"
                     style={{ 
                        color: display?.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(display?.bodyTextSize) || 16, 18) + 'px'
                     }}
                  >
                     ${parseFloat(transaction.amount).toFixed(2)}
                  </div>
               </div>
            ))}
         </div>

         {transactions.length === 0 && (
            <div className="text-center py-8">
               <FaHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p 
                  className="text-base"
                  style={{ color: display?.s_color || '#64748b' }}
               >
                  Be the first to donate!
               </p>
            </div>
         )}
      </div>
   )
}

export default DonationLeaderboard
