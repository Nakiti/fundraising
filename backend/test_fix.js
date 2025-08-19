// Simple test script to verify the fix
import fetch from 'node-fetch';

const testEndpoint = async () => {
  try {
    console.log('Testing user_organization endpoint...');
    
    const response = await fetch('http://localhost:5000/api/user_organization/get/1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      console.log('✅ Test passed - No headers error!');
    } else {
      console.log('❌ Test failed - Got error response');
    }
    
  } catch (error) {
    console.log('❌ Test failed - Network error:', error.message);
  }
};

// Wait a bit for server to start, then test
setTimeout(testEndpoint, 2000);

