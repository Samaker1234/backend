const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function checkConnection() {
  const url = process.env.DATABASE_URL;
  console.log('URL from .env:', url ? url.substring(0, 20) + '...' : 'undefined');
  
  const prisma = new PrismaClient();

  try {
    console.log('Testing connection to Supabase...');
    const projectCount = await prisma.project.count();
    console.log('Number of projects:', projectCount);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
