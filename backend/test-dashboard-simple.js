import { db } from "./db.js"

// Simple test for dashboard API
async function testDashboardSimple() {
  console.log('Testing Dashboard API (Simple)...\n');
  
  // Test organization ID
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
      
      // Test 2: Check if required tables exist
      console.log('\nTest 2: Checking required tables...');
      const tables = ['transactions', 'campaigns', 'campaign_details', 'donors', 'landing_page'];
      
      let tableChecks = 0;
      tables.forEach(table => {
        db.query(`SELECT COUNT(*) as count FROM ${table} LIMIT 1`, (err, result) => {
          tableChecks++;
          if (err) {
            console.log(`❌ Table '${table}' not found or error:`, err.message);
          } else {
            console.log(`✅ Table '${table}' exists`);
          }
          
          if (tableChecks === tables.length) {
            console.log('\n🎉 Basic table check completed!');
            console.log('\nYou can now test the API endpoints:');
            console.log(`GET /api/dashboard/summary/${testOrgId}`);
            console.log(`GET /api/dashboard/recent-donations/${testOrgId}`);
            console.log(`GET /api/dashboard/top-campaigns/${testOrgId}`);
            console.log(`GET /api/dashboard/organization-status/${testOrgId}`);
            console.log(`GET /api/dashboard/notifications/${testOrgId}`);
          }
        });
      });
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDashboardSimple();
