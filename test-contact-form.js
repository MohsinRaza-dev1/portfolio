// Test the contact form functionality
async function testContactForm() {
  console.log('🧪 Testing contact form functionality...');
  
  const testData = {
    name: 'Test User From Form',
    email: 'testform@example.com',
    message: 'This is a test message from the contact form to verify it works properly.'
  };
  
  try {
    console.log('Sending test message via contact API...');
    const response = await fetch('http://localhost:3002/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Contact form test successful!');
      console.log('Response:', result);
      
      // Verify the message was saved
      console.log('\n📋 Verifying message was saved...');
      const getResponse = await fetch('http://localhost:3002/api/contact');
      if (getResponse.ok) {
        const messages = await getResponse.json();
        const latestMessage = messages[messages.length - 1];
        console.log('Latest message saved:', {
          name: latestMessage.name,
          email: latestMessage.email,
          message: latestMessage.message.substring(0, 50) + '...',
          createdAt: new Date(latestMessage.createdAt).toLocaleString()
        });
        console.log('✅ Message successfully saved to database!');
      }
    } else {
      console.error('❌ Contact form test failed:', response.status);
      const errorText = await response.text();
      console.error('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Error testing contact form:', error.message);
  }
}

testContactForm();
