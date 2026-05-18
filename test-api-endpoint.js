// Test the contact API endpoint directly
async function testContactAPI() {
  try {
    console.log('🧪 Testing contact API endpoint...');
    
    // Test POST request to create a message
    const testData = {
      name: 'API Test User',
      email: 'apitest@example.com',
      message: 'This is a test message sent via API to verify the contact system works.'
    };
    
    const response = await fetch('http://localhost:3002/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API test successful!');
      console.log('Response:', result);
      
      // Test GET request to retrieve messages
      console.log('\n📋 Testing GET request to retrieve messages...');
      const getResponse = await fetch('http://localhost:3002/api/contact');
      
      if (getResponse.ok) {
        const messages = await getResponse.json();
        console.log(`✅ Retrieved ${messages.length} messages`);
        
        // Show the latest message
        if (messages.length > 0) {
          const latest = messages[0];
          console.log('\n📧 Latest message:');
          console.log('From:', latest.name);
          console.log('Email:', latest.email);
          console.log('Message:', latest.message);
          console.log('Date:', new Date(latest.createdAt).toLocaleString());
        }
      } else {
        console.error('❌ GET request failed:', getResponse.status);
      }
    } else {
      console.error('❌ API test failed:', response.status);
      const error = await response.text();
      console.error('Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testContactAPI();
