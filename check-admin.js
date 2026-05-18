const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndCreateAdmin() {
  try {
    console.log('Checking for admin user...');
    
    const admin = await prisma.adminUser.findUnique({
      where: { username: 'admin' }
    });
    
    if (admin) {
      console.log('✅ Admin user exists:', admin.username);
    } else {
      console.log('❌ Admin user does not exist, creating...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = await prisma.adminUser.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      
      console.log('✅ Admin user created:', newAdmin.username);
      console.log('🔑 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateAdmin();
