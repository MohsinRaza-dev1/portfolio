const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    console.log('Checking ContactMessage schema...');
    
    // Try to find a message and check if reply fields exist
    const messages = await prisma.contactMessage.findMany({
      take: 1,
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        reply: true,
        repliedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log('✅ Schema check successful');
    console.log('Found', messages.length, 'message(s)');
    
    if (messages.length > 0) {
      const msg = messages[0];
      console.log('Sample message structure:');
      console.log('- id:', msg.id);
      console.log('- name:', msg.name);
      console.log('- reply field exists:', 'reply' in msg);
      console.log('- repliedAt field exists:', 'repliedAt' in msg);
      console.log('- updatedAt field exists:', 'updatedAt' in msg);
      console.log('- reply value:', msg.reply || 'null');
      console.log('- repliedAt value:', msg.repliedAt || 'null');
    }
    
  } catch (error) {
    console.error('❌ Schema error:', error.message);
    
    // Check if it's a column error
    if (error.message.includes('no such column')) {
      console.log('❌ The reply fields were not added to the database');
      console.log('🔧 Need to run database migration');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
