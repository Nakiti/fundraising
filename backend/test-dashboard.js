import { db } from "./db.js"

// Test dashboard API endpoints
async function testDashboardAPI() {
  console.log('Testing Dashboard API...\n');
  
  // Test organization ID (you may need to change this to a valid ID)
  const testOrgId = 1;
  
  try {
    // Test 1: Check if organization exists
    console.log('Test 1: Checking if organization exists...');
    const orgQuery = "SELECT * FROM organizations WHERE id = ?";
    
    db.query(orgQuery, [testOrgId], (err, data) => {
      if (err) {
        console.error('❌ Error checking organization:', err.message);
        return;
      }
      
      if (data.length === 0) {
        console.log('⚠️  Organization not found. Please use a valid organization ID.');
        console.log('Available organizations:');
        
        // List available organizations
        db.query("SELECT id, name FROM organizations LIMIT 5", (err2, orgs) => {
          if (err2) {
            console.error('❌ Error fetching organizations:', err2.message);
          } else {
            orgs.forEach(org => {
              console.log(`   ID: ${org.id}, Name: ${org.name}`);
            });
          }
        });
        return;
      }
      
      console.log('✅ Organization found:', data[0].name);
      
      // Test 2: Check transactions
      console.log('\nTest 2: Checking transactions...');
      const transQuery = "SELECT COUNT(*) as count FROM transactions WHERE organization_id = ?";
      
      db.query(transQuery, [testOrgId], (err, data) => {
        if (err) {
          console.error('❌ Error checking transactions:', err.message);
          return;
        }
        
        console.log(`✅ Found ${data[0].count} transactions`);
        
        // Test 3: Check campaigns
        console.log('\nTest 3: Checking campaigns...');
        const campaignQuery = "SELECT COUNT(*) as count FROM campaigns WHERE organization_id = ?";
        
        db.query(campaignQuery, [testOrgId], (err, data) => {
          if (err) {
            console.error('❌ Error checking campaigns:', err.message);
            return;
          }
          
          console.log(`✅ Found ${data[0].count} campaigns`);
          
          // Test 4: Check donors
          console.log('\nTest 4: Checking donors...');
          const donorQuery = `
            SELECT COUNT(DISTINCT t.donor_id) as count 
            FROM transactions t 
            WHERE t.organization_id = ?
          `;
          
          db.query(donorQuery, [testOrgId], (err, data) => {
            if (err) {
              console.error('❌ Error checking donors:', err.message);
              return;
            }
            
            console.log(`✅ Found ${data[0].count} unique donors`);
            
            // Test 5: Check landing page
            console.log('\nTest 5: Checking landing page...');
            const landingQuery = "SELECT COUNT(*) as count FROM landing_page WHERE organization_id = ?";
            
            db.query(landingQuery, [testOrgId], (err, data) => {
              if (err) {
                console.error('❌ Error checking landing page:', err.message);
                return;
              }
              
              console.log(`✅ Found ${data[0].count} landing pages`);
              console.log('\n🎉 Dashboard API test completed successfully!');
              console.log('\nYou can now test the API endpoints:');
              console.log(`GET /api/dashboard/summary/${testOrgId}`);
              console.log(`GET /api/dashboard/recent-donations/${testOrgId}`);
              console.log(`GET /api/dashboard/top-campaigns/${testOrgId}`);
              console.log(`GET /api/dashboard/organization-status/${testOrgId}`);
              console.log(`GET /api/dashboard/notifications/${testOrgId}`);
            });
          });
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDashboardAPI();
