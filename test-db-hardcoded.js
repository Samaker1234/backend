const { PrismaClient } = require('@prisma/client');

async function checkConnection() {
  const url = "postgresql://postgres.groljgymspxrrucrljof:PvJZTMxUBGKbecuOdelamou12345@@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    console.log('Testing connection to Supabase with hardcoded URL...');
    const projectCount = await prisma.project.count();
    console.log('Number of projects:', projectCount);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
