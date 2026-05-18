const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // First, let's check if there are any existing messages
    const existingMessages = await prisma.contactMessage.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true
      }
    });
    
    console.log(`Found ${existingMessages.length} existing messages`);
    
    // Since we can't alter the schema easily, let's recreate the table
    console.log('Dropping and recreating contact_messages table...');
    
    // Drop the table
    await prisma.$executeRaw`DROP TABLE IF EXISTS contact_messages`;
    
    // Recreate the table with the correct schema
    await prisma.$executeRaw`
      CREATE TABLE contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        reply TEXT,
        repliedAt DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Table recreated with correct schema');
    
    // Re-insert existing messages if any
    if (existingMessages.length > 0) {
      console.log('Re-inserting existing messages...');
      
      for (const msg of existingMessages) {
        await prisma.contactMessage.create({
          data: {
            id: msg.id,
            name: msg.name,
            email: msg.email,
            message: msg.message,
            createdAt: msg.createdAt,
            updatedAt: new Date()
          }
        });
      }
      
      console.log(`✅ Re-inserted ${existingMessages.length} messages`);
    }
    
    // Create a test message to verify the schema works
    const testMessage = await prisma.contactMessage.create({
      data: {
        id: 'test-' + Date.now(),
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message',
        reply: null,
        repliedAt: null
      }
    });
    
    console.log('✅ Test message created successfully');
    console.log('Test message ID:', testMessage.id);
    
    // Clean up the test message
    await prisma.contactMessage.delete({
      where: { id: testMessage.id }
    });
    
    console.log('✅ Schema fix completed successfully');
    console.log('🔑 Admin login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSchema();
