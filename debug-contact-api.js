// Debug the contact API by testing it with detailed error logging
async function debugContactAPI() {
  try {
    console.log('🔧 Debugging contact API...');
    
    // First, let's test if we can connect to the database directly
    console.log('1. Testing database connection...');
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    try {
      const count = await prisma.contactMessage.count();
      console.log(`✅ Database connection successful. Found ${count} messages.`);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      await prisma.$disconnect();
      return;
    }
    
    // Now test the API endpoint with detailed error handling
    console.log('2. Testing API endpoint...');
    
    const testData = {
      name: 'Debug Test User',
      email: 'debug@example.com',
      message: 'This is a debug test message.'
    };
    
    console.log('Sending request to: http://localhost:3002/api/contact');
    console.log('Request data:', testData);
    
    try {
      const response = await fetch('http://localhost:3002/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      if (response.ok) {
        console.log('✅ API call successful');
      } else {
        console.error('❌ API call failed with status:', response.status);
        
        // Try to parse the error
        try {
          const errorData = JSON.parse(responseText);
          console.error('Error details:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response:', responseText);
        }
      }
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError.message);
      console.error('This might mean the server is not running or there\'s a network issue');
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Debug script error:', error.message);
  }
}

debugContactAPI();
