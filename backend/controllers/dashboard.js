import { db } from "../db.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

// Get dashboard summary statistics
export const getDashboardSummary = (req, res) => {
  const { id } = req.params;
  const { period = 'week' } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Calculate date range based on period
  let startDate, endDate = new Date();
  
  switch (period) {
    case 'week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
  }

  const startFormatted = startDate.toISOString().slice(0, 19).replace('T', ' ');
  const endFormatted = endDate.toISOString().slice(0, 19).replace('T', ' ');

  // Get summary statistics
  const summaryQuery = `
    SELECT 
      COUNT(DISTINCT t.id) as totalDonations,
      COUNT(DISTINCT t.donor_id) as newSupporters,
      COALESCE(SUM(t.amount), 0) as totalRaised,
      COUNT(DISTINCT c.id) as activeCampaigns
    FROM transactions t
    LEFT JOIN campaigns c ON t.campaign_id = c.id
    WHERE t.organization_id = ? 
    AND t.date BETWEEN ? AND ?
    AND t.status = 'completed'
  `;

  // Get previous period for comparison
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(startDate);
  const periodDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  previousStartDate.setDate(previousStartDate.getDate() - periodDays);
  previousEndDate.setDate(previousEndDate.getDate() - periodDays);
  
  const previousStartFormatted = previousStartDate.toISOString().slice(0, 19).replace('T', ' ');
  const previousEndFormatted = previousEndDate.toISOString().slice(0, 19).replace('T', ' ');

  const previousSummaryQuery = `
    SELECT 
      COUNT(DISTINCT t.id) as totalDonations,
      COUNT(DISTINCT t.donor_id) as newSupporters,
      COALESCE(SUM(t.amount), 0) as totalRaised,
      COUNT(DISTINCT c.id) as activeCampaigns
    FROM transactions t
    LEFT JOIN campaigns c ON t.campaign_id = c.id
    WHERE t.organization_id = ? 
    AND t.date BETWEEN ? AND ?
    AND t.status = 'completed'
  `;

  db.query(summaryQuery, [id, startFormatted, endFormatted], (err, currentData) => {
    if (err) {
      console.error('Dashboard summary query error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch dashboard summary',
          code: 'DATABASE_ERROR'
        }
      });
    }
    
    db.query(previousSummaryQuery, [id, previousStartFormatted, previousEndFormatted], (err2, previousData) => {
      if (err2) {
        console.error('Previous period query error:', err2);
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to fetch previous period data',
            code: 'DATABASE_ERROR'
          }
        });
      }
      
      const current = currentData && currentData[0] ? currentData[0] : { totalDonations: 0, newSupporters: 0, totalRaised: 0, activeCampaigns: 0 };
      const previous = previousData && previousData[0] ? previousData[0] : { totalDonations: 0, newSupporters: 0, totalRaised: 0, activeCampaigns: 0 };
      
      // Calculate percentage changes
      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };
      
      const summary = {
        totalDonations: {
          value: current.totalDonations,
          change: calculateChange(current.totalDonations, previous.totalDonations),
          trend: current.totalDonations >= previous.totalDonations ? 'up' : 'down'
        },
        newSupporters: {
          value: current.newSupporters,
          change: calculateChange(current.newSupporters, previous.newSupporters),
          trend: current.newSupporters >= previous.newSupporters ? 'up' : 'down'
        },
        totalRaised: {
          value: current.totalRaised,
          change: calculateChange(current.totalRaised, previous.totalRaised),
          trend: current.totalRaised >= previous.totalRaised ? 'up' : 'down'
        },
        activeCampaigns: {
          value: current.activeCampaigns,
          change: calculateChange(current.activeCampaigns, previous.activeCampaigns),
          trend: current.activeCampaigns >= previous.activeCampaigns ? 'up' : 'down'
        }
      };
      
      res.status(200).json({
        success: true,
        data: summary,
        message: 'Dashboard summary retrieved successfully'
      });
    });
  });
};

// Get recent donations
export const getRecentDonations = (req, res) => {
  const { id } = req.params;
  const { limit = 10 } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  const query = `
    SELECT 
      t.id,
      t.amount,
      t.date,
      t.status,
      d.first_name,
      d.last_name,
      d.email,
      COALESCE(cd.external_name, 'Unknown Campaign') as campaign_name
    FROM transactions t
    INNER JOIN donors d ON t.donor_id = d.id
    LEFT JOIN campaign_details cd ON t.campaign_id = cd.campaign_id
    WHERE t.organization_id = ?
    AND t.status = 'completed'
    ORDER BY t.date DESC
    LIMIT ?
  `;

  db.query(query, [id, parseInt(limit)], (err, data) => {
    if (err) {
      console.error('Recent donations query error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch recent donations',
          code: 'DATABASE_ERROR'
        }
      });
    }
    
    // Ensure data is an array and handle null/undefined cases
    const donationsData = Array.isArray(data) ? data : [];
    
    const donations = donationsData.map(donation => ({
      id: donation.id,
      name: `${donation.first_name} ${donation.last_name}`,
      amount: donation.amount,
      campaign: donation.campaign_name,
      time: donation.date,
      avatar: `${donation.first_name.charAt(0)}${donation.last_name.charAt(0)}`
    }));
    
    res.status(200).json({
      success: true,
      data: donations,
      message: 'Recent donations retrieved successfully'
    });
  });
};

// Get top campaigns
export const getTopCampaigns = (req, res) => {
  const { id } = req.params;
  const { limit = 5 } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  const query = `
    SELECT 
      c.id,
      COALESCE(cd.external_name, 'Unnamed Campaign') as name,
      COALESCE(cd.goal, 0) as goal,
      COALESCE(SUM(t.amount), 0) as raised,
      COUNT(DISTINCT t.donor_id) as donors,
      c.status
    FROM campaigns c
    LEFT JOIN campaign_details cd ON c.id = cd.campaign_id
    LEFT JOIN transactions t ON c.id = t.campaign_id AND t.status = 'completed'
    WHERE c.organization_id = ?
    AND c.status = 'active'
    GROUP BY c.id, cd.external_name, cd.goal, c.status
    ORDER BY raised DESC
    LIMIT ?
  `;

  db.query(query, [id, parseInt(limit)], (err, data) => {
    if (err) {
      console.error('Top campaigns query error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch top campaigns',
          code: 'DATABASE_ERROR'
        }
      });
    }
    
    // Ensure data is an array and handle null/undefined cases
    const campaignsData = Array.isArray(data) ? data : [];
    
    const campaigns = campaignsData.map(campaign => {
      const percentageFunded = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0;
      
      // Calculate trend (simplified - could be enhanced with historical data)
      const trend = percentageFunded > 50 ? '+15%' : percentageFunded > 25 ? '+8%' : '+5%';
      
      return {
        id: campaign.id,
        name: campaign.name,
        raised: campaign.raised,
        goal: campaign.goal,
        donors: campaign.donors,
        trend: trend,
        percentageFunded: Math.round(percentageFunded)
      };
    });
    
    res.status(200).json({
      success: true,
      data: campaigns,
      message: 'Top campaigns retrieved successfully'
    });
  });
};

// Get organization status
export const getOrganizationStatus = (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Get organization details
  const orgQuery = `
    SELECT 
      o.name,
      o.status,
      o.created_at,
      COUNT(DISTINCT c.id) as total_campaigns,
      COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_campaigns
    FROM organizations o
    LEFT JOIN campaigns c ON o.id = c.organization_id
    WHERE o.id = ?
    GROUP BY o.id, o.name, o.status, o.created_at
  `;

  // Check if pages exist 
  const pagesQuery = `
    SELECT 
      'landing' as page_type,
      CASE WHEN lp.id IS NOT NULL THEN 'active' ELSE 'inactive' END as status
    FROM organizations o
    LEFT JOIN landing_pages lp ON o.id = lp.organization_id
    WHERE o.id = ?
  `;

  db.query(orgQuery, [id], (err, orgData) => {
    if (err) {
      console.error('Organization status query error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch organization status',
          code: 'DATABASE_ERROR'
        }
      });
    }
    
    if (!orgData || orgData.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Organization not found',
          code: 'NOT_FOUND'
        }
      });
    }
    
    const org = orgData[0];
    
    db.query(pagesQuery, [id], (err2, pagesData) => {
      if (err2) {
        console.error('Pages status query error:', err2);
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to fetch pages status',
            code: 'DATABASE_ERROR'
          }
        });
      }
      
      // Ensure pagesData is an array and handle null/undefined cases
      const pagesArray = Array.isArray(pagesData) ? pagesData : [];
      
      const pages = pagesArray.reduce((acc, page) => {
        acc[page.page_type] = page.status;
        return acc;
      }, {});
      
      const status = {
        organization: {
          name: org.name,
          status: org.status,
          createdAt: org.created_at,
          totalCampaigns: org.total_campaigns,
          activeCampaigns: org.active_campaigns
        },
        pages: pages,
        health: {
          score: calculateHealthScore(org, pages),
          status: org.status === 'active' ? 'healthy' : 'needs_attention'
        }
      };
      
      res.status(200).json({
        success: true,
        data: status,
        message: 'Organization status retrieved successfully'
      });
    });
  });
};

// Helper function to calculate organization health score
function calculateHealthScore(org, pages) {
  let score = 0;
  
  // Organization status (40 points)
  if (org.status === 'active') score += 40;
  
  // Active campaigns (30 points)
  if (org.active_campaigns > 0) score += 30;
  else if (org.total_campaigns > 0) score += 15;
  
  // Pages (30 points)
  const activePages = Object.values(pages).filter(status => status === 'active').length;
  score += (activePages / 2) * 30; // 15 points per active page
  
  return Math.min(100, score);
}

// Get dashboard notifications
export const getDashboardNotifications = (req, res) => {
  const { id } = req.params;
  const { limit = 10 } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Get recent activities that could be notifications
  const query = `
    SELECT 
      'donation' as type,
      CONCAT(d.first_name, ' ', d.last_name, ' donated $', t.amount) as message,
      t.date as time,
      t.id as reference_id
    FROM transactions t
    INNER JOIN donors d ON t.donor_id = d.id
    WHERE t.organization_id = ?
    AND t.status = 'completed'
    AND t.date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    
    UNION ALL
    
    SELECT 
      'milestone' as type,
      CONCAT('Campaign "', COALESCE(cd.external_name, 'Unnamed Campaign'), '" reached ', 
             ROUND((COALESCE(SUM(t.amount), 0) / COALESCE(cd.goal, 1)) * 100), '% of goal') as message,
      MAX(t.date) as time,
      c.id as reference_id
    FROM campaigns c
    LEFT JOIN campaign_details cd ON c.id = cd.campaign_id
    LEFT JOIN transactions t ON c.id = t.campaign_id AND t.status = 'completed'
    WHERE c.organization_id = ?
    AND c.status = 'active'
    AND COALESCE(cd.goal, 0) > 0
    GROUP BY c.id, cd.external_name, cd.goal
    HAVING (COALESCE(SUM(t.amount), 0) / COALESCE(cd.goal, 1)) >= 0.5
    
    ORDER BY time DESC
    LIMIT ?
  `;

  db.query(query, [id, id, parseInt(limit)], (err, data) => {
    if (err) {
      console.error('Notifications query error:', err);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch notifications',
          code: 'DATABASE_ERROR'
        }
      });
    }
    
    // Ensure data is an array and handle null/undefined cases
    const notificationsData = Array.isArray(data) ? data : [];
    
    const notifications = notificationsData.map((notification, index) => ({
      id: index + 1,
      message: notification.message,
      time: notification.time,
      type: notification.type,
      referenceId: notification.reference_id
    }));
    
    res.status(200).json({
      success: true,
      data: notifications,
      message: 'Notifications retrieved successfully'
    });
  });
};
