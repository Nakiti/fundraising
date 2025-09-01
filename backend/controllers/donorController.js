import { asyncHandler } from "../middleware/errorHandler.js";
import { 
  sendCreated, 
  sendUpdated, 
  sendSuccess, 
  sendValidationError
} from "../utils/response.js";
import { getDonorService } from "../services/ServiceRegistry.js";

// Initialize service
const donorService = getDonorService();

// Register a new donor
export const registerDonor = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const donor = await donorService.registerDonor(organizationId, req.body);
  sendCreated(res, { donor }, 'Donor registered successfully');
});

// Login donor
export const loginDonor = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, password } = req.body;
  
  const loginResult = await donorService.loginDonor(organizationId, email, password);
  
  // Set session token in cookie
  res.cookie('donor_session', loginResult.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict'
  });
  
  sendSuccess(res, { donor: loginResult.donor }, 'Login successful');
});

// Logout donor
export const logoutDonor = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies.donor_session;
  
  await donorService.logoutDonor(sessionToken);
  
  // Clear cookie
  res.clearCookie('donor_session');
  sendSuccess(res, null, 'Logout successful');
});

// Get donor profile
export const getDonorProfile = asyncHandler(async (req, res) => {
  const { donorId } = req.donor; // Assuming donor is attached by auth middleware
  
  const profile = await donorService.getDonorProfile(donorId);
  sendSuccess(res, profile, 'Profile retrieved successfully');
});

// Update donor profile
export const updateDonorProfile = asyncHandler(async (req, res) => {
  const { donorId } = req.donor; // Assuming donor is attached by auth middleware
  
  const updatedProfile = await donorService.updateDonorProfile(donorId, req.body);
  sendUpdated(res, updatedProfile, 'Profile updated successfully');
});

// Get donor donations (using transactions table)
export const getDonorDonations = asyncHandler(async (req, res) => {
  const { donorId } = req.donor; // Assuming donor is attached by auth middleware
  const { limit, offset, status } = req.query;
  
  const options = {
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
    status
  };
  
  const donations = await donorService.getDonorDonations(donorId, options);
  sendSuccess(res, donations, 'Donations retrieved successfully');
});

// Get donor summary (using transactions table)
export const getDonorSummary = asyncHandler(async (req, res) => {
  const { donorId } = req.donor; // Assuming donor is attached by auth middleware
  
  const summary = await donorService.getDonorSummary(donorId);
  sendSuccess(res, summary, 'Donor summary retrieved successfully');
});

// Record donation (using transactions table) - This would typically be in a transaction controller
export const recordDonation = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  const donationData = { ...req.body, donorId };
  
  // This would typically use a transaction service
  // For now, keeping as a placeholder that could be moved to transaction controller
  sendCreated(res, { message: 'This endpoint should be moved to transaction controller' }, 'Donation recording not implemented in donor service');
});

// Get donor preferences - Simple implementation using base service
export const getDonorPreferences = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  
  // This could be expanded to use a preferences service
  sendSuccess(res, {}, 'Donor preferences retrieved successfully');
});

// Update donor preferences - Simple implementation
export const updateDonorPreferences = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  const { key, value } = req.body;
  
  // This could be expanded to use a preferences service
  sendUpdated(res, { key, value }, 'Preferences updated successfully');
});

// Check donor session
export const checkSession = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies.donor_session;
  
  const donorData = await donorService.validateSession(sessionToken);
  
  if (donorData) {
    sendSuccess(res, { 
      authenticated: true, 
      donor: donorData 
    }, 'Session valid');
  } else {
    // Clear invalid cookie
    res.clearCookie('donor_session');
    sendSuccess(res, { 
      authenticated: false 
    }, 'Session invalid');
  }
});

// Get organization donors (Admin only)
export const getOrganizationDonors = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { limit, offset } = req.query;
  
  // This would typically have additional authorization checks
  const donors = await donorService.findBy(
    { organization_id: organizationId, is_active: true },
    'id, email, first_name, last_name, created_at, last_login',
    {
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      orderBy: 'created_at DESC'
    }
  );
  
  sendSuccess(res, donors, 'Organization donors retrieved successfully');
});

// Get donor analytics (Admin only)
export const getDonorAnalytics = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  // This would typically have additional authorization checks
  const query = `
    SELECT 
      COUNT(DISTINCT d.id) as total_donors,
      COUNT(DISTINCT CASE WHEN d.is_guest = FALSE THEN d.id END) as registered_donors,
      COUNT(DISTINCT CASE WHEN d.is_guest = TRUE THEN d.id END) as guest_donors,
      COUNT(DISTINCT CASE WHEN d.last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN d.id END) as active_donors_30d
    FROM donors d
    WHERE d.organization_id = ? AND d.is_active = TRUE
  `;
  
  const results = await donorService.executeQuery(query, [organizationId]);
  const analytics = results[0] || {
    total_donors: 0,
    registered_donors: 0,
    guest_donors: 0,
    active_donors_30d: 0
  };
  
  sendSuccess(res, analytics, 'Donor analytics retrieved successfully');
});

// Check for existing guest donations by email
export const checkGuestDonations = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email } = req.body;
  
  if (!email) {
    return sendValidationError(res, { email: 'required' }, 'Email is required');
  }
  
  const guestData = await donorService.checkGuestDonations(organizationId, email);
  sendSuccess(res, guestData, 'Guest donations checked');
});

// Convert guest donor to registered donor
export const convertGuestToRegistered = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  const convertedDonor = await donorService.convertGuestToRegistered(organizationId, req.body);
  sendCreated(res, { donor: convertedDonor }, 'Guest donor converted successfully');
});