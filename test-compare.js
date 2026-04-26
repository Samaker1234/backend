const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function checkConnection() {
  const hardcodedUrl = "postgresql://postgres.groljgymspxrrucrljof:PvJZTMxUBGKbecuOdelamou12345@@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  console.log('URL from .env:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'undefined');
  
  // Test with hardcoded first
  const prismaHardcoded = new PrismaClient({
    datasources: {
      db: {
        url: hardcodedUrl
      }
    }
  });

  try {
    console.log('Testing hardcoded...');
    await prismaHardcoded.project.count();
    console.log('Hardcoded SUCCESS');
  } catch (e) {
    console.log('Hardcoded FAILED:', e.message);
  } finally {
    await prismaHardcoded.$disconnect();
  }

  // Test with default (from .env)
  const prismaEnv = new PrismaClient();
  try {
    console.log('Testing .env...');
    await prismaEnv.project.count();
    console.log('.env SUCCESS');
  } catch (e) {
    console.log('.env FAILED:', e.message);
  } finally {
    await prismaEnv.$disconnect();
  }
}

checkConnection();
