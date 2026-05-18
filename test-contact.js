const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testContactSystem() {
  try {
    console.log('🔧 Testing contact system...');
    
    // Check existing messages
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`📧 Found ${messages.length} messages in database:`);
    
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.name} (${msg.email}) - ${new Date(msg.createdAt).toLocaleString()}`);
      console.log(`   Message: ${msg.message.substring(0, 50)}...`);
      if (msg.reply) {
        console.log(`   ✅ Replied: ${msg.reply.substring(0, 30)}...`);
      }
      console.log('');
    });
    
    // Test creating a new message
    console.log('🧪 Testing message creation...');
    const testMessage = await prisma.contactMessage.create({
      data: {
        id: 'test-' + Date.now(),
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message to verify the contact system is working properly.',
      },
    });
    
    console.log('✅ Test message created successfully');
    console.log('Message ID:', testMessage.id);
    console.log('Created at:', new Date(testMessage.createdAt).toLocaleString());
    
    // Clean up test message
    await prisma.contactMessage.delete({
      where: { id: testMessage.id }
    });
    
    console.log('🧹 Test message cleaned up');
    console.log('\n✅ Contact system is working properly!');
    
  } catch (error) {
    console.error('❌ Error testing contact system:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContactSystem();
