const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Installing dependencies for Mohsin Portfolio...');

try {
  // Install npm packages
  console.log('📦 Installing npm packages...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('🗄️  Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('🏗️  Setting up database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  // Seed database
  console.log('🌱 Seeding database with sample data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('✅ Installation complete!');
  console.log('🎯 Run "npm run dev" to start the development server');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  console.log('\n🔧 Manual installation steps:');
  console.log('1. npm install');
  console.log('2. npx prisma generate');
  console.log('3. npx prisma db push');
  console.log('4. npm run db:seed');
  console.log('5. npm run dev');
}
